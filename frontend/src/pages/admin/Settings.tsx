import { useState, useEffect } from "react";
import { Save, CreditCard, Truck, Bell, Globe, Store, ExternalLink, AlertTriangle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { useAdminMode } from "@/hooks/useAdminMode";

interface RestaurantSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
}

interface DeliverySettings {
  fee: number;
  minOrder: number;
  freeDeliveryThreshold: number;
  radius: number;
}

interface PaymentSettings {
  knet: { enabled: boolean; merchantId: string };
  myfatoorah: { enabled: boolean; apiKey: string };
  tap: { enabled: boolean; apiKey: string };
  cashOnDelivery: boolean;
}

interface NotificationSettings {
  newOrderAlerts: boolean;
  lowStockAlerts: boolean;
  dailySummary: boolean;
}

interface WebsiteSettings {
  onlineOrdering: boolean;
  loyaltyProgram: boolean;
  maintenanceMode: boolean;
}

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { mode, switchToRealMode, switchToMockMode, loading: modeLoading } = useAdminMode();
  
  const [restaurant, setRestaurant] = useState<RestaurantSettings>({
    name: "Bam Burgers",
    phone: "+965 1234 5678",
    email: "hello@bamburgers.com",
    address: "Kuwait City, Kuwait",
    currency: "KWD"
  });

  const [delivery, setDelivery] = useState<DeliverySettings>({
    fee: 1.000,
    minOrder: 3.000,
    freeDeliveryThreshold: 10.000,
    radius: 15
  });

  const [payment, setPayment] = useState<PaymentSettings>({
    knet: { enabled: false, merchantId: "" },
    myfatoorah: { enabled: false, apiKey: "" },
    tap: { enabled: false, apiKey: "" },
    cashOnDelivery: true
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    newOrderAlerts: true,
    lowStockAlerts: true,
    dailySummary: false
  });

  const [website, setWebsite] = useState<WebsiteSettings>({
    onlineOrdering: true,
    loyaltyProgram: true,
    maintenanceMode: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("settings").select("*");
      
      if (error) throw error;

      if (data) {
        data.forEach((setting) => {
          const value = setting.value as Record<string, unknown>;
          switch (setting.key) {
            case "restaurant":
              setRestaurant(value as unknown as RestaurantSettings);
              break;
            case "delivery":
              setDelivery(value as unknown as DeliverySettings);
              break;
            case "payment":
              setPayment(value as unknown as PaymentSettings);
              break;
            case "notifications":
              setNotifications(value as unknown as NotificationSettings);
              break;
            case "website":
              setWebsite(value as unknown as WebsiteSettings);
              break;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: { key: string; value: Json }[] = [
        { key: "restaurant", value: restaurant as unknown as Json },
        { key: "delivery", value: delivery as unknown as Json },
        { key: "payment", value: payment as unknown as Json },
        { key: "notifications", value: notifications as unknown as Json },
        { key: "website", value: website as unknown as Json }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("settings")
          .update({ value: update.value })
          .eq("key", update.key);

        if (error) throw error;
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold font-serif">Settings</h1>
              <p className="text-muted-foreground">Manage your restaurant settings</p>
            </div>
            <Badge variant={mode === "real" ? "default" : "secondary"} className="text-xs">
              {mode === "real" ? "Real Mode" : "Mock Mode"}
            </Badge>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Mode Toggle */}
        <Card className={mode === "mock" ? "border-yellow-500" : "border-green-500"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Admin Mode
            </CardTitle>
            <CardDescription>
              {mode === "mock" 
                ? "You're in Mock Mode - data is for demonstration only."
                : "You're in Real Mode - all changes affect your live business."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {mode === "mock" ? "Switch to Real Mode" : "Switch to Mock Mode"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {mode === "mock" 
                    ? "Warning: This will DELETE all mock orders, coupons, and customer data (menu items are preserved)."
                    : "Switch back to mock mode for testing."}
                </p>
              </div>
              <Button 
                variant={mode === "mock" ? "default" : "outline"}
                onClick={mode === "mock" ? switchToRealMode : switchToMockMode}
                disabled={modeLoading}
              >
                {modeLoading ? "Switching..." : mode === "mock" ? "Go Real" : "Go Mock"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Restaurant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  value={restaurant.name}
                  onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={restaurant.phone}
                  onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={restaurant.address}
                onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={restaurant.email}
                  onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={restaurant.currency}
                  onChange={(e) => setRestaurant({ ...restaurant, currency: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kuwait Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Kuwait Payment Options
            </CardTitle>
            <CardDescription>Configure payment gateways for Kuwait</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* KNET */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    KNET
                  </div>
                  <div>
                    <p className="font-medium">KNET Payment Gateway</p>
                    <p className="text-sm text-muted-foreground">
                      Accept local debit card payments in Kuwait
                    </p>
                  </div>
                </div>
                <Switch
                  checked={payment.knet.enabled}
                  onCheckedChange={(checked) =>
                    setPayment({ ...payment, knet: { ...payment.knet, enabled: checked } })
                  }
                />
              </div>
              {payment.knet.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="knetMerchantId">Merchant ID</Label>
                  <Input
                    id="knetMerchantId"
                    placeholder="Enter your KNET Merchant ID"
                    value={payment.knet.merchantId}
                    onChange={(e) =>
                      setPayment({ ...payment, knet: { ...payment.knet, merchantId: e.target.value } })
                    }
                  />
                </div>
              )}
            </div>

            {/* MyFatoorah */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    MF
                  </div>
                  <div>
                    <p className="font-medium">MyFatoorah</p>
                    <p className="text-sm text-muted-foreground">
                      Multi-payment gateway for GCC region
                    </p>
                  </div>
                </div>
                <Switch
                  checked={payment.myfatoorah.enabled}
                  onCheckedChange={(checked) =>
                    setPayment({ ...payment, myfatoorah: { ...payment.myfatoorah, enabled: checked } })
                  }
                />
              </div>
              {payment.myfatoorah.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="myfatoorahApiKey">API Key</Label>
                  <Input
                    id="myfatoorahApiKey"
                    type="password"
                    placeholder="Enter your MyFatoorah API Key"
                    value={payment.myfatoorah.apiKey}
                    onChange={(e) =>
                      setPayment({ ...payment, myfatoorah: { ...payment.myfatoorah, apiKey: e.target.value } })
                    }
                  />
                  <Button variant="link" asChild className="p-0 h-auto">
                    <a href="https://myfatoorah.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Get API Key
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Tap Payments */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    TAP
                  </div>
                  <div>
                    <p className="font-medium">Tap Payments</p>
                    <p className="text-sm text-muted-foreground">
                      Accept cards and Apple Pay in Kuwait
                    </p>
                  </div>
                </div>
                <Switch
                  checked={payment.tap.enabled}
                  onCheckedChange={(checked) =>
                    setPayment({ ...payment, tap: { ...payment.tap, enabled: checked } })
                  }
                />
              </div>
              {payment.tap.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="tapApiKey">Secret Key</Label>
                  <Input
                    id="tapApiKey"
                    type="password"
                    placeholder="Enter your Tap Secret Key"
                    value={payment.tap.apiKey}
                    onChange={(e) =>
                      setPayment({ ...payment, tap: { ...payment.tap, apiKey: e.target.value } })
                    }
                  />
                  <Button variant="link" asChild className="p-0 h-auto">
                    <a href="https://www.tap.company" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Get API Key
                    </a>
                  </Button>
                </div>
              )}
            </div>

            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">Allow customers to pay in cash</p>
              </div>
              <Switch
                checked={payment.cashOnDelivery}
                onCheckedChange={(checked) =>
                  setPayment({ ...payment, cashOnDelivery: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Settings
            </CardTitle>
            <CardDescription>Configure delivery options (prices in KWD)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Delivery Fee (KWD)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  step="0.001"
                  value={delivery.fee}
                  onChange={(e) => setDelivery({ ...delivery, fee: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Minimum Order (KWD)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  step="0.001"
                  value={delivery.minOrder}
                  onChange={(e) => setDelivery({ ...delivery, minOrder: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="freeDeliveryThreshold">Free Delivery Above (KWD)</Label>
                <Input
                  id="freeDeliveryThreshold"
                  type="number"
                  step="0.001"
                  value={delivery.freeDeliveryThreshold}
                  onChange={(e) => setDelivery({ ...delivery, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  value={delivery.radius}
                  onChange={(e) => setDelivery({ ...delivery, radius: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Order Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified for new orders</p>
              </div>
              <Switch
                checked={notifications.newOrderAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, newOrderAlerts: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Alert when menu items are running low
                </p>
              </div>
              <Switch
                checked={notifications.lowStockAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, lowStockAlerts: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Summary Email</p>
                <p className="text-sm text-muted-foreground">Receive daily sales summary</p>
              </div>
              <Switch
                checked={notifications.dailySummary}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, dailySummary: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Website Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Website Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Online Ordering</p>
                <p className="text-sm text-muted-foreground">Accept orders through the website</p>
              </div>
              <Switch
                checked={website.onlineOrdering}
                onCheckedChange={(checked) =>
                  setWebsite({ ...website, onlineOrdering: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Loyalty Program</p>
                <p className="text-sm text-muted-foreground">Enable customer rewards</p>
              </div>
              <Switch
                checked={website.loyaltyProgram}
                onCheckedChange={(checked) =>
                  setWebsite({ ...website, loyaltyProgram: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the storefront
                </p>
              </div>
              <Switch
                checked={website.maintenanceMode}
                onCheckedChange={(checked) =>
                  setWebsite({ ...website, maintenanceMode: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
