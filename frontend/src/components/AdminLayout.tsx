import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Gift,
  Tag,
  Users,
  Truck,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Menu Items", path: "/admin/menu", icon: UtensilsCrossed },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Loyalty Program", path: "/admin/loyalty", icon: Gift },
  { name: "Coupons", path: "/admin/coupons", icon: Tag },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Delivery (ARMADA)", path: "/admin/delivery", icon: Truck },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary font-serif">Bam Burgers</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <Separator />

        <div className="p-3 space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
