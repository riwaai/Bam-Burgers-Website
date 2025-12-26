import { Gift, Star, Award, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Loyalty = () => {
  // Mock user loyalty data
  const userPoints = 450;
  const nextRewardAt = 500;
  const progress = (userPoints / nextRewardAt) * 100;

  const rewards = [
    { points: 100, reward: "Free Drink", icon: Zap },
    { points: 250, reward: "Free Side", icon: Star },
    { points: 500, reward: "Free Burger", icon: Award },
    { points: 1000, reward: "$15 Off Order", icon: Gift },
  ];

  const howItWorks = [
    { step: 1, title: "Sign Up", description: "Create an account to start earning points" },
    { step: 2, title: "Order Food", description: "Earn 1 point for every $1 spent" },
    { step: 3, title: "Collect Points", description: "Watch your points grow with every order" },
    { step: 4, title: "Redeem Rewards", description: "Exchange points for free food and discounts" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground font-serif mb-4">
              FastBite Rewards
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Earn points with every order and unlock exclusive rewards, free food, and special discounts!
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Current Progress */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Your Rewards Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">{userPoints}</p>
                <p className="text-muted-foreground">Points Earned</p>
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-center text-muted-foreground">
                  {nextRewardAt - userPoints} points until your next reward
                </p>
              </div>
              <div className="text-center">
                <Button size="lg">Sign In to Track Points</Button>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold font-serif text-center mb-8">
              How It <span className="text-primary">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item) => (
                <Card key={item.step} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Rewards Tiers */}
          <section>
            <h2 className="text-3xl font-bold font-serif text-center mb-8">
              Available <span className="text-primary">Rewards</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewards.map((reward) => {
                const Icon = reward.icon;
                const isUnlocked = userPoints >= reward.points;
                
                return (
                  <Card
                    key={reward.points}
                    className={`text-center transition-all ${
                      isUnlocked ? "border-primary shadow-lg" : "opacity-60"
                    }`}
                  >
                    <CardContent className="pt-6 space-y-4">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                          isUnlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-bold text-2xl">{reward.points}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                      <p className="font-semibold">{reward.reward}</p>
                      <Button
                        variant={isUnlocked ? "default" : "outline"}
                        disabled={!isUnlocked}
                        className="w-full"
                      >
                        {isUnlocked ? "Redeem" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Loyalty;
