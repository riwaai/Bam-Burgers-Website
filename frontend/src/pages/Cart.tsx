import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeItem, total, appliedCoupon, applyCoupon, removeCoupon, discount } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      setCouponCode("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/menu" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8">
            Your <span className="text-primary">Cart</span>
          </h1>

          {items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground">Add some delicious items from our menu!</p>
                <Link to="/menu">
                  <Button>Browse Menu</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{item.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-primary font-medium">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <span className="ml-auto font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Coupon */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Coupon Code
                      </label>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-primary/10 p-2 rounded-lg">
                          <span className="text-sm font-medium text-primary">
                            {appliedCoupon} applied
                          </span>
                          <Button variant="ghost" size="sm" onClick={removeCoupon}>
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <Button variant="outline" onClick={handleApplyCoupon}>
                            Apply
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-primary">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>$2.99</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${(total + 2.99).toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to="/checkout" className="w-full">
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
