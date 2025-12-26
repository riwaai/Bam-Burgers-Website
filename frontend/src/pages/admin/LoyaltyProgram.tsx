import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Gift, Star, Award, Zap, Save } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  description: string;
  active: boolean;
}

const AdminLoyalty = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pointsPerDollar, setPointsPerDollar] = useState(10);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    pointsRequired: "",
    description: "",
    active: true,
  });

  useEffect(() => {
    fetchLoyaltySettings();
  }, []);

  const fetchLoyaltySettings = async () => {
    try {
      const { data, error } = await supabase
        .from("loyalty_settings")
        .select("*")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No settings found, create default
          await supabase.from("loyalty_settings").insert({
            points_per_dollar: 10,
            rewards: [],
            active: true,
          });
        } else {
          throw error;
        }
      } else if (data) {
        setPointsPerDollar(data.points_per_dollar);
        const rewardsData = data.rewards as Json;
        if (Array.isArray(rewardsData)) {
          setRewards(
            rewardsData.map((r) => {
              const reward = r as Record<string, unknown>;
              return {
                id: String(reward.id || crypto.randomUUID()),
                name: String(reward.name || ""),
                pointsRequired: Number(reward.pointsRequired || 0),
                description: String(reward.description || ""),
                active: Boolean(reward.active),
              };
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching loyalty settings:", error);
      toast.error("Failed to load loyalty settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newRewards?: Reward[], newPoints?: number) => {
    try {
      const rewardsToSave = newRewards || rewards;
      const pointsToSave = newPoints !== undefined ? newPoints : pointsPerDollar;

      const { error } = await supabase
        .from("loyalty_settings")
        .update({
          points_per_dollar: pointsToSave,
          rewards: rewardsToSave as unknown as Json,
        })
        .eq("active", true);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  };

  const handlePointsChange = async (value: number) => {
    setPointsPerDollar(value);
    try {
      await saveSettings(undefined, value);
      toast.success("Points per dollar updated");
    } catch {
      toast.error("Failed to update points");
    }
  };

  const stats = [
    { label: "Points per KWD", value: pointsPerDollar.toString(), icon: Gift },
    { label: "Total Rewards", value: rewards.length.toString(), icon: Star },
    { label: "Active Rewards", value: rewards.filter((r) => r.active).length.toString(), icon: Zap },
  ];

  const resetForm = () => {
    setFormData({ name: "", pointsRequired: "", description: "", active: true });
    setEditingReward(null);
  };

  const handleOpenDialog = (reward?: Reward) => {
    if (reward) {
      setEditingReward(reward);
      setFormData({
        name: reward.name,
        pointsRequired: reward.pointsRequired.toString(),
        description: reward.description,
        active: reward.active,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const toggleRewardStatus = async (id: string) => {
    const updatedRewards = rewards.map((reward) =>
      reward.id === id ? { ...reward, active: !reward.active } : reward
    );
    setRewards(updatedRewards);
    try {
      await saveSettings(updatedRewards);
      toast.success("Reward status updated");
    } catch {
      toast.error("Failed to update reward status");
    }
  };

  const handleSaveReward = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReward: Reward = {
      id: editingReward?.id || crypto.randomUUID(),
      name: formData.name,
      pointsRequired: parseInt(formData.pointsRequired),
      description: formData.description,
      active: formData.active,
    };

    let updatedRewards: Reward[];
    if (editingReward) {
      updatedRewards = rewards.map((r) => (r.id === editingReward.id ? newReward : r));
    } else {
      updatedRewards = [...rewards, newReward];
    }

    try {
      await saveSettings(updatedRewards);
      setRewards(updatedRewards);
      toast.success(editingReward ? "Reward updated!" : "Reward created!");
      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to save reward");
    }
  };

  const handleDeleteReward = async (id: string) => {
    const updatedRewards = rewards.filter((reward) => reward.id !== id);
    try {
      await saveSettings(updatedRewards);
      setRewards(updatedRewards);
      toast.success("Reward deleted");
    } catch {
      toast.error("Failed to delete reward");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif">Loyalty Program</h1>
            <p className="text-muted-foreground">Manage rewards and points settings</p>
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
                Add Reward
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingReward ? "Edit" : "Add"} Reward</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveReward} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Reward Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Free Burger"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points Required</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="500"
                    value={formData.pointsRequired}
                    onChange={(e) => setFormData({ ...formData, pointsRequired: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
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
                  <Button type="submit">{editingReward ? "Update" : "Save"} Reward</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
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

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Points Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Points per KWD Spent</p>
                <p className="text-sm text-muted-foreground">
                  How many points customers earn for each 1 KWD spent
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={pointsPerDollar}
                  onChange={(e) => handlePointsChange(Number(e.target.value))}
                  className="w-20"
                  min={1}
                />
                <span className="text-sm text-muted-foreground">points</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Table */}
        <Card>
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : rewards.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No rewards configured. Add your first reward to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reward</TableHead>
                    <TableHead>Points Required</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">{reward.name}</TableCell>
                      <TableCell>{reward.pointsRequired.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{reward.description}</TableCell>
                      <TableCell>
                        <Switch
                          checked={reward.active}
                          onCheckedChange={() => toggleRewardStatus(reward.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(reward)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteReward(reward.id)}
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

export default AdminLoyalty;
