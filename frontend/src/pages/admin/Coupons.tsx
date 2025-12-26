import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag, Copy } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
}

const AdminCoupons = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "",
    max_uses: "",
    expires_at: "",
    active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Active Coupons", value: coupons.filter((c) => c.active).length.toString() },
    { label: "Total Redemptions", value: coupons.reduce((sum, c) => sum + c.used_count, 0).toLocaleString() },
    { label: "Total Coupons", value: coupons.length.toString() },
  ];

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      min_order_amount: "",
      max_uses: "",
      expires_at: "",
      active: true,
    });
    setEditingCoupon(null);
  };

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value.toString(),
        min_order_amount: coupon.min_order_amount?.toString() || "",
        max_uses: coupon.max_uses?.toString() || "",
        expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
        active: coupon.active,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("coupons")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Coupon status updated");
      fetchCoupons();
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("Failed to update coupon status");
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    const couponData = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      expires_at: formData.expires_at ? `${formData.expires_at}T23:59:59Z` : null,
      active: formData.active,
    };

    try {
      if (editingCoupon) {
        const { error } = await supabase
          .from("coupons")
          .update(couponData)
          .eq("id", editingCoupon.id);

        if (error) throw error;
        toast.success("Coupon updated!");
      } else {
        const { error } = await supabase.from("coupons").insert(couponData);

        if (error) throw error;
        toast.success("Coupon created!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error("Failed to save coupon");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);

      if (error) throw error;
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code} to clipboard`);
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif">Coupons</h1>
            <p className="text-muted-foreground">Create and manage discount codes</p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCoupon ? "Edit" : "Create"} Coupon</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveCoupon} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., SUMMER20"
                    className="uppercase"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Value</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder="20"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Min. Order (KWD)</Label>
                    <Input
                      id="minOrder"
                      type="number"
                      placeholder="0"
                      value={formData.min_order_amount}
                      onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUses">Max Uses</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      placeholder="100"
                      value={formData.max_uses}
                      onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiry Date</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingCoupon ? "Update" : "Create"} Coupon</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Tag className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coupons Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : coupons.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No coupons found. Create your first coupon to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min. Order</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
                            {coupon.code}
                          </code>
                          <Button variant="ghost" size="icon" onClick={() => copyCode(coupon.code)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `${coupon.discount_value} KWD`}
                      </TableCell>
                      <TableCell>
                        {coupon.min_order_amount ? `${coupon.min_order_amount} KWD` : "-"}
                      </TableCell>
                      <TableCell>
                        {coupon.used_count} / {coupon.max_uses || "∞"}
                      </TableCell>
                      <TableCell>
                        {coupon.expires_at ? (
                          <Badge variant={isExpired(coupon.expires_at) ? "destructive" : "secondary"}>
                            {new Date(coupon.expires_at).toLocaleDateString()}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={coupon.active}
                          onCheckedChange={() => toggleCouponStatus(coupon.id, coupon.active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(coupon)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default AdminCoupons;
