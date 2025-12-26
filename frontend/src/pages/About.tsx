import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, Heart, Users } from "lucide-react";

const About = () => {
  const stats = [
    { number: "5+", label: "Years of Service", icon: Clock },
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "100+", label: "Menu Items", icon: Heart },
    { number: "15", label: "Awards Won", icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="bg-card py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              About <span className="text-primary">FastBite</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We're passionate about serving delicious, high-quality fast food that brings joy to every bite.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Story */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-serif">
                Our <span className="text-primary">Story</span>
              </h2>
              <p className="text-muted-foreground">
                FastBite was founded in 2020 with a simple mission: to serve fast food that doesn't compromise on quality. 
                We believe that quick service and great taste can go hand in hand.
              </p>
              <p className="text-muted-foreground">
                Our chefs use only the freshest ingredients, sourced locally whenever possible. 
                Every burger, sandwich, and side dish is prepared with care and attention to detail.
              </p>
              <p className="text-muted-foreground">
                Today, we're proud to serve thousands of satisfied customers who trust us for their 
                favorite comfort food. Join our family and taste the FastBite difference!
              </p>
            </div>
            <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-2" />
                <p>Our Team</p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6 space-y-2">
                    <Icon className="h-8 w-8 mx-auto text-primary" />
                    <p className="text-3xl font-bold text-primary">{stat.number}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Values */}
          <section className="text-center">
            <h2 className="text-3xl font-bold font-serif mb-8">
              Our <span className="text-primary">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Quality First</h3>
                  <p className="text-muted-foreground">
                    We never compromise on the quality of our ingredients or preparation methods.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Speed & Efficiency</h3>
                  <p className="text-muted-foreground">
                    Quick service without sacrificing the taste and quality you deserve.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Customer Focus</h3>
                  <p className="text-muted-foreground">
                    Your satisfaction is our priority. We listen, adapt, and improve for you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
