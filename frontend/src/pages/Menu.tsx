import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuCard from "@/components/MenuCard";
import { Button } from "@/components/ui/button";
import { menuItems, categories } from "@/data/menuItems";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Our <span className="text-primary">Menu</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our delicious selection of burgers, chicken, sides, drinks, and desserts.
              All made fresh with premium ingredients.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
