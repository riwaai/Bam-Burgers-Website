import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  popular: boolean;
  available: boolean;
}

const categories = [
  { id: "all", name: "All Items" },
  { id: "burgers", name: "Burgers" },
  { id: "chicken", name: "Chicken" },
  { id: "sides", name: "Sides" },
  { id: "drinks", name: "Drinks" },
  { id: "desserts", name: "Desserts" },
];

const AdminMenuItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "burgers",
    image_url: "",
    popular: false,
    available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "burgers",
      image_url: "",
      popular: false,
      available: true,
    });
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || "",
        price: item.price.toString(),
        category: item.category,
        image_url: item.image_url || "",
        popular: item.popular,
        available: item.available,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image_url || null,
      popular: formData.popular,
      available: formData.available,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(itemData)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("Menu item updated!");
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert(itemData);

        if (error) throw error;
        toast.success("Menu item created!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error("Failed to save menu item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Menu item deleted");
      fetchMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ available: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Item availability updated");
      fetchMenuItems();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif">Menu Items</h1>
            <p className="text-muted-foreground">Manage your restaurant's menu</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Menu Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Classic Burger" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the item..." 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (KWD)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      placeholder="2.99" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    placeholder="https://..." 
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                    />
                    <Label htmlFor="popular">Popular Item</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingItem ? "Update" : "Save"} Item</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
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
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No menu items found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{item.category}</TableCell>
                      <TableCell>{item.price.toFixed(3)} KWD</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleAvailability(item.id, item.available)}
                          />
                          {item.popular && <Badge>Popular</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
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

export default AdminMenuItems;
