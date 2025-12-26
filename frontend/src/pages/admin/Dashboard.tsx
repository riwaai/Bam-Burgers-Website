import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,459",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Orders Today",
      value: "145",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Active Customers",
      value: "2,847",
      change: "+4.1%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Pending Orders",
      value: "23",
      change: "-2.3%",
      trend: "down",
      icon: Clock,
    },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Doe", items: 3, total: 24.99, status: "Preparing" },
    { id: "#ORD-002", customer: "Jane Smith", items: 2, total: 18.49, status: "Out for Delivery" },
    { id: "#ORD-003", customer: "Mike Johnson", items: 5, total: 42.99, status: "Delivered" },
    { id: "#ORD-004", customer: "Sarah Wilson", items: 1, total: 8.99, status: "Preparing" },
    { id: "#ORD-005", customer: "Chris Brown", items: 4, total: 35.49, status: "Pending" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-600";
      case "Out for Delivery":
        return "bg-blue-500/10 text-blue-600";
      case "Preparing":
        return "bg-yellow-500/10 text-yellow-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-sm">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground ml-1">from yesterday</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Orders & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Top Items Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Classic Cheeseburger", orders: 45 },
                { name: "Crispy Chicken Sandwich", orders: 38 },
                { name: "Loaded Fries", orders: 32 },
                { name: "Chocolate Milkshake", orders: 28 },
                { name: "Double Bacon Burger", orders: 24 },
              ].map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-5">#{index + 1}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.orders} orders</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
