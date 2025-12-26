import { useState, useEffect } from "react";
import { Search, Eye, Truck, Check, X, Clock } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  items: OrderItem[];
  total: number;
  status: string;
  order_type: string;
  created_at: string;
  notes: string | null;
}

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Set up realtime subscription
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsedOrders = (data || []).map((order) => ({
        ...order,
        items: parseItems(order.items),
      }));

      setOrders(parsedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const parseItems = (items: Json): OrderItem[] => {
    if (Array.isArray(items)) {
      return items.map((item) => {
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          return {
            name: String(obj.name || ""),
            quantity: Number(obj.quantity || 1),
            price: Number(obj.price || 0),
          };
        }
        return { name: "", quantity: 1, price: 0 };
      });
    }
    return [];
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-600";
      case "out_for_delivery":
        return "bg-blue-500/10 text-blue-600";
      case "preparing":
        return "bg-yellow-500/10 text-yellow-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-serif">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No orders found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>{order.total.toFixed(3)} KWD</TableCell>
                      <TableCell className="capitalize">{order.order_type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          {formatStatus(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Customer Details</h4>
                                  <div className="text-sm space-y-1 text-muted-foreground">
                                    <p>{order.customer_name}</p>
                                    {order.customer_email && <p>{order.customer_email}</p>}
                                    {order.customer_phone && <p>{order.customer_phone}</p>}
                                    {order.delivery_address && <p>{order.delivery_address}</p>}
                                  </div>
                                </div>
                                <Separator />
                                <div>
                                  <h4 className="font-medium mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                        <span>
                                          {item.name} x {item.quantity}
                                        </span>
                                        <span>{(item.price * item.quantity).toFixed(3)} KWD</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {order.notes && (
                                  <>
                                    <Separator />
                                    <div>
                                      <h4 className="font-medium mb-2">Notes</h4>
                                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                                    </div>
                                  </>
                                )}
                                <Separator />
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>{order.total.toFixed(3)} KWD</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Ordered: {formatDate(order.created_at)}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {order.status === "pending" && (
                                    <Button
                                      className="flex-1"
                                      onClick={() => updateOrderStatus(order.id, "preparing")}
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Start Preparing
                                    </Button>
                                  )}
                                  {order.status === "preparing" && (
                                    <Button
                                      className="flex-1"
                                      onClick={() => updateOrderStatus(order.id, "out_for_delivery")}
                                    >
                                      <Truck className="h-4 w-4 mr-2" />
                                      Send for Delivery
                                    </Button>
                                  )}
                                  {order.status === "out_for_delivery" && (
                                    <Button
                                      className="flex-1"
                                      onClick={() => updateOrderStatus(order.id, "delivered")}
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Mark Delivered
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {order.status !== "cancelled" && order.status !== "delivered" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
