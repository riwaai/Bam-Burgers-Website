import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, MapPin, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, discount, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === "delivery" ? 2.99 : 0;
  const finalTotal = total + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Order placed successfully! Your food is being prepared.");
    clearCart();
    navigate("/");
    setIsProcessing(false);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </button>

          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8">
            <span className="text-primary">Checkout</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Delivery Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={deliveryMethod}
                      onValueChange={setDeliveryMethod}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Label
                        htmlFor="delivery"
                        className={`flex items-center justify-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                          deliveryMethod === "delivery"
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Truck className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Delivery</p>
                          <p className="text-sm text-muted-foreground">$2.99</p>
                        </div>
                      </Label>
                      <Label
                        htmlFor="pickup"
                        className={`flex items-center justify-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                          deliveryMethod === "pickup"
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem value="pickup" id="pickup" />
                        <MapPin className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Pickup</p>
                          <p className="text-sm text-muted-foreground">Free</p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                {deliveryMethod === "delivery" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" placeholder="123 Main St" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="Tasty Town" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" placeholder="12345" required />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Payment integration with Stripe coming soon. Demo mode only.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
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
                        <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "Free"}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
