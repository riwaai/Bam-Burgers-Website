import { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Customer {
  id: string;
  customer_name: string | null;
  customer_email: string;
  orders_count: number;
  total_spent: number;
  points: number;
  tier: string;
  created_at: string;
}

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customer_loyalty")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.customer_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      customer.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Customers", value: customers.length.toString(), icon: Users },
    { label: "Total Orders", value: customers.reduce((sum, c) => sum + c.orders_count, 0).toString() },
    { label: "Total Revenue", value: `${customers.reduce((sum, c) => sum + Number(c.total_spent), 0).toFixed(3)} KWD` },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-500/10 text-yellow-600";
      case "Silver":
        return "bg-gray-400/10 text-gray-600";
      case "Platinum":
        return "bg-purple-500/10 text-purple-600";
      default:
        return "bg-amber-700/10 text-amber-700";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-serif">Customers</h1>
          <p className="text-muted-foreground">View and manage customer information</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No customers found. Customers will appear here when they make orders or join the loyalty program.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.customer_name || "Guest"}</p>
                          <p className="text-sm text-muted-foreground">{customer.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{customer.orders_count}</TableCell>
                      <TableCell>{Number(customer.total_spent).toFixed(3)} KWD</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.points} pts</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierColor(customer.tier)}>{customer.tier}</Badge>
                      </TableCell>
                      <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
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

export default AdminCustomers;
