
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PiggyBank, 
  TrendingUp, 
  Calculator, 
  BookOpen, 
  Users, 
  Target,
  Shield,
  Bell,
  Smartphone
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: PiggyBank,
      title: "Smart Budgeting Tool",
      description: "Monthly budget planners customized for students, salary earners, and small business owners with category-based spending analysis.",
      features: ["Expense Tracker", "Category Analysis", "Custom Plans"],
      color: "emerald"
    },
    {
      icon: Target,
      title: "Smart Savings Tracker",
      description: "Set and monitor savings goals with visual trackers. Join group savings challenges like the 52-week savings challenge.",
      features: ["Goal Setting", "Progress Tracking", "Group Challenges"],
      color: "gold"
    },
    {
      icon: BookOpen,
      title: "Investment Education Hub",
      description: "Learn about safe African investments including Treasury Bills, Mutual Funds, and AgricTech with risk education.",
      features: ["African Investments", "Risk Education", "How-to Guides"],
      color: "emerald"
    },
    {
      icon: Calculator,
      title: "Financial Calculator Tools",
      description: "Access loan repayment, compound interest, and savings projection calculators designed for African markets.",
      features: ["Loan Calculator", "Interest Calculator", "Savings Projector"],
      color: "gold"
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Join chat groups by topics like Student Finances, Business Owners, NYSC, and Side Hustles with expert Q&A sessions.",
      features: ["Topic Groups", "Expert Q&A", "Peer Support"],
      color: "emerald"
    },
    {
      icon: TrendingUp,
      title: "Personalized Financial Plan",
      description: "Get custom plans after onboarding with budget suggestions, investment recommendations, and spending alerts.",
      features: ["Custom Budget", "Investment Tips", "Smart Alerts"],
      color: "gold"
    },
    {
      icon: Bell,
      title: "Daily Money Tips",
      description: "Receive push notifications with tips on avoiding debt traps, saving on airtime/data, and income generation ideas.",
      features: ["Daily Tips", "Debt Avoidance", "Income Ideas"],
      color: "emerald"
    },
    {
      icon: Shield,
      title: "Premium Coaching",
      description: "Book sessions with certified finance coaches, access video/audio lessons, and join live Q&A sessions.",
      features: ["Expert Coaching", "Video Lessons", "Live Q&A"],
      color: "gold"
    },
    {
      icon: Smartphone,
      title: "Bank Sync & Integration",
      description: "Sync with popular African fintech wallets like Flutterwave, Opay, and Kuda for seamless expense tracking.",
      features: ["Bank Sync", "Fintech Integration", "Auto Tracking"],
      color: "emerald"
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">
            Everything You Need to Build Wealth
          </h2>
          <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
            MyFinance provides comprehensive tools and education specifically designed for African youth to master their finances and build lasting wealth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow duration-300 animate-fade-in border-emerald-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <CardTitle className="text-emerald-900">{feature.title}</CardTitle>
                  <CardDescription className="text-emerald-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((item, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className={`bg-${feature.color}-50 text-${feature.color}-700 border-${feature.color}-200`}
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-african-gradient text-white rounded-full font-medium">
            <TrendingUp className="w-5 h-5 mr-2" />
            Join 50,000+ users building wealth with MyFinance
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
