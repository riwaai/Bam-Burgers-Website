import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuCard from "@/components/MenuCard";
import { menuItems } from "@/data/menuItems";
import heroImage from "@/assets/hero-food.jpg";

const Index = () => {
  const popularItems = menuItems.filter((item) => item.popular).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground font-serif leading-tight">
              Delicious Food,
              <br />
              <span className="text-primary">Delivered Fast</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80">
              Fresh ingredients, bold flavors, and quick delivery. 
              Experience the best burgers in Kuwait with Bam Burgers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button size="lg" className="text-lg px-8">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  View Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Hot and fresh food delivered to your doorstep in 30 minutes or less.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Best Quality</h3>
                <p className="text-muted-foreground">
                  Premium ingredients and recipes crafted to perfection by our chefs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Open Late</h3>
                <p className="text-muted-foreground">
                  Craving food at night? We're open until 11 PM every day.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Most <span className="text-primary">Popular</span> Items
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our customers' favorites - tried, tested, and loved by thousands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/menu">
              <Button variant="outline" size="lg">
                View Full Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground font-serif mb-4">
            Join Our Loyalty Program
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Earn points with every order and unlock exclusive rewards, discounts, and free items!
          </p>
          <Link to="/loyalty">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-serif">
                Find <span className="text-primary">Us</span>
              </h2>
              <p className="text-muted-foreground">
                Visit us at our convenient location in the heart of the city. 
                We offer both dine-in and takeout options.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>123 Food Street, Tasty Town, FT 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Open Daily: 10:00 AM - 11:00 PM</span>
                </div>
              </div>
              <Link to="/contact">
                <Button variant="outline">
                  Get Directions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive Map</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
