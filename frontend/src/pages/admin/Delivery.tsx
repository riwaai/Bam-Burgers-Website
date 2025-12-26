import { useState } from "react";
import { Truck, ExternalLink, AlertCircle, CheckCircle2, Clock, MapPin, Settings } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface DeliveryProvider {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
  enabled: boolean;
  apiKey: string;
  website: string;
}

const AdminDelivery = () => {
  const [providers, setProviders] = useState<DeliveryProvider[]>([
    {
      id: "talabat",
      name: "Talabat",
      description: "Leading food delivery platform in Kuwait and GCC",
      logo: "🧡",
      color: "bg-orange-500",
      enabled: false,
      apiKey: "",
      website: "https://www.talabat.com/kuwait/business"
    },
    {
      id: "carriage",
      name: "Carriage",
      description: "Popular delivery service across Kuwait",
      logo: "🔴",
      color: "bg-red-500",
      enabled: false,
      apiKey: "",
      website: "https://www.trycarriage.com"
    },
    {
      id: "deliveroo",
      name: "Deliveroo",
      description: "International delivery service available in Kuwait",
      logo: "🌊",
      color: "bg-teal-500",
      enabled: false,
      apiKey: "",
      website: "https://deliveroo.com.kw/en/for-business"
    },
    {
      id: "armada",
      name: "ARMADA",
      description: "Local delivery management and fleet service",
      logo: "🚚",
      color: "bg-blue-600",
      enabled: false,
      apiKey: "",
      website: "https://armadadelivery.com"
    }
  ]);

  const [ownDelivery, setOwnDelivery] = useState({
    enabled: true,
    estimatedTime: 30,
    maxDistance: 15
  });

  const deliveryStats = [
    { label: "Active Deliveries", value: "12", icon: Truck },
    { label: "Completed Today", value: "45", icon: CheckCircle2 },
    { label: "Avg. Delivery Time", value: "28 min", icon: Clock },
  ];

  const activeDeliveries = [
    {
      id: "DEL-001",
      orderId: "ORD-002",
      driver: "Ahmed M.",
      customer: "Sara Al-Mutairi",
      address: "Salmiya, Block 12",
      status: "In Transit",
      eta: "12 min",
    },
    {
      id: "DEL-002",
      orderId: "ORD-005",
      driver: "Pending Assignment",
      customer: "Fahad Al-Rashid",
      address: "Hawally, Block 5",
      status: "Awaiting Pickup",
      eta: "--",
    },
  ];

  const toggleProvider = (id: string) => {
    setProviders(providers.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const updateApiKey = (id: string, apiKey: string) => {
    setProviders(providers.map(p => 
      p.id === id ? { ...p, apiKey } : p
    ));
  };

  const saveIntegration = (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider && provider.apiKey) {
      toast.success(`${provider.name} integration saved!`);
    } else {
      toast.error("Please enter an API key");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif">Delivery Management</h1>
            <p className="text-muted-foreground">Kuwait Delivery Integrations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deliveryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Own Delivery Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Own Delivery Fleet
            </CardTitle>
            <CardDescription>
              Manage your in-house delivery service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Own Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Use your own delivery staff
                </p>
              </div>
              <Switch
                checked={ownDelivery.enabled}
                onCheckedChange={(checked) =>
                  setOwnDelivery({ ...ownDelivery, enabled: checked })
                }
              />
            </div>
            {ownDelivery.enabled && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Delivery Time (min)</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      value={ownDelivery.estimatedTime}
                      onChange={(e) => setOwnDelivery({ ...ownDelivery, estimatedTime: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDistance">Max Delivery Distance (km)</Label>
                    <Input
                      id="maxDistance"
                      type="number"
                      value={ownDelivery.maxDistance}
                      onChange={(e) => setOwnDelivery({ ...ownDelivery, maxDistance: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Kuwait Delivery Partners */}
        <Card>
          <CardHeader>
            <CardTitle>Kuwait Delivery Partners</CardTitle>
            <CardDescription>
              Connect with popular delivery services in Kuwait
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${provider.color} rounded-lg flex items-center justify-center text-2xl`}>
                      {provider.logo}
                    </div>
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {provider.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={provider.enabled}
                    onCheckedChange={() => toggleProvider(provider.id)}
                  />
                </div>
                {provider.enabled && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${provider.id}-api`}>API Key / Integration Token</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`${provider.id}-api`}
                          type="password"
                          placeholder={`Enter your ${provider.name} API Key`}
                          value={provider.apiKey}
                          onChange={(e) => updateApiKey(provider.id, e.target.value)}
                        />
                        <Button onClick={() => saveIntegration(provider.id)}>
                          Save
                        </Button>
                      </div>
                    </div>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <a href={provider.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Get API Key from {provider.name}
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Currently in-progress deliveries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDeliveries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active deliveries at the moment
              </div>
            ) : (
              activeDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{delivery.orderId}</p>
                      <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{delivery.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={
                        delivery.status === "In Transit"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }
                    >
                      {delivery.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {delivery.driver}
                    </p>
                    <p className="text-sm text-muted-foreground">ETA: {delivery.eta}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDelivery;
