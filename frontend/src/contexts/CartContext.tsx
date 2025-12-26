import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock coupons - will be replaced with database
const mockCoupons: Record<string, number> = {
  "SAVE10": 10,
  "SAVE20": 20,
  "FIRST50": 50,
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        toast.success(`Added another ${item.name} to cart`);
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${item.name} added to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const discount = appliedCoupon ? (subtotal * (mockCoupons[appliedCoupon] || 0)) / 100 : 0;
  const total = subtotal - discount;

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (mockCoupons[upperCode]) {
      setAppliedCoupon(upperCode);
      toast.success(`Coupon applied! ${mockCoupons[upperCode]}% off`);
      return true;
    }
    toast.error("Invalid coupon code");
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
