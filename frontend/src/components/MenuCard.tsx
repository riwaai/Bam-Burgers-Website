import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { MenuItem } from "@/data/menuItems";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.popular && (
          <Badge className="absolute top-3 left-3 bg-primary">Popular</Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
          <span className="font-bold text-primary whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <Button onClick={handleAddToCart} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
