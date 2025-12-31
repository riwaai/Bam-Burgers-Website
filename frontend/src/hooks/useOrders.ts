import { useState, useEffect } from 'react';
import { supabase, TENANT_ID, BRANCH_ID } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Order status flow: pending -> accepted -> preparing -> ready -> out_for_delivery -> delivered
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  item_id: string;
  name_en: string;
  name_ar: string;
  price: number;
  quantity: number;
  modifiers: {
    id: string;
    name_en: string;
    name_ar: string;
    price: number;
  }[];
  special_instructions?: string;
  total_price: number;
}

export interface Order {
  id: string;
  tenant_id: string;
  branch_id: string;
  order_number: string;
  order_type: string;
  channel: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  delivery_address: any;
  delivery_instructions: string | null;
  subtotal: number;
  tax_amount: number;
  service_charge: number;
  discount_amount: number;
  delivery_fee: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: string;
  notes: string | null;
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

// Hook to create an order
export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: {
    order_type: 'delivery' | 'pickup';
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    delivery_address?: any;
    delivery_instructions?: string;
    items: OrderItem[];
    subtotal: number;
    discount_amount?: number;
    delivery_fee?: number;
    total_amount: number;
    notes?: string;
  }): Promise<Order | null> => {
    setLoading(true);
    setError(null);

    try {
      // Generate order number
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      
      // Get the count of today's orders
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', date.toISOString().slice(0, 10));
      
      const orderNum = ((count || 0) + 1).toString().padStart(3, '0');
      const orderNumber = `ORD-${dateStr}-${orderNum}`;

      const { data, error: insertError } = await supabase
        .from('orders')
        .insert({
          tenant_id: TENANT_ID,
          branch_id: BRANCH_ID,
          order_number: orderNumber,
          order_type: orderData.order_type,
          channel: 'website',
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_email: orderData.customer_email || null,
          delivery_address: orderData.delivery_address || null,
          delivery_instructions: orderData.delivery_instructions || null,
          subtotal: orderData.subtotal,
          tax_amount: 0,
          service_charge: 0,
          discount_amount: orderData.discount_amount || 0,
          delivery_fee: orderData.delivery_fee || 0,
          total_amount: orderData.total_amount,
          status: 'pending',
          payment_status: 'pending',
          notes: orderData.notes || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Insert order items
      if (data && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: data.id,
          item_id: item.item_id,
          item_name_en: item.name_en,
          item_name_ar: item.name_ar,
          unit_price: item.price,
          quantity: item.quantity,
          modifiers: item.modifiers,
          special_instructions: item.special_instructions || null,
          total_price: item.total_price,
        }));

        await supabase.from('order_items').insert(orderItems);
      }

      return data as Order;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
}

// Hook to track an order with realtime updates
export function useOrderTracking(orderId: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data as Order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();

    // Subscribe to realtime changes for this specific order
    channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [orderId]);

  return { order, loading, error };
}

// Hook to get order by order number
export function useOrderByNumber(orderNumber: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumber)
          .single();

        if (error) throw error;
        setOrder(data as Order);

        // Subscribe to realtime changes
        if (data) {
          channel = supabase
            .channel(`order-${data.id}`)
            .on(
              'postgres_changes',
              { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${data.id}` },
              (payload) => {
                setOrder(payload.new as Order);
              }
            )
            .subscribe();
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [orderNumber]);

  return { order, loading, error };
}
