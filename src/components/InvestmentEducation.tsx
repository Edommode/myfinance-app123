
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  BookOpen,
  Play,
  ExternalLink
} from "lucide-react";

const InvestmentEducation = () => {
  const investments = [
    {
      title: "Treasury Bills",
      description: "Low-risk government securities with guaranteed returns",
      minAmount: "₦1,000",
      riskLevel: "Low",
      expectedReturn: "10-15% annually",
      color: "emerald"
    },
    {
      title: "Mutual Funds",
      description: "Professionally managed diversified investment portfolios",
      minAmount: "₦5,000",
      riskLevel: "Medium",
      expectedReturn: "12-20% annually",
      color: "gold"
    },
    {
      title: "AgricTech Investments",
      description: "Invest in African agricultural technology and farming projects",
      minAmount: "₦10,000",
      riskLevel: "Medium-High",
      expectedReturn: "15-25% annually",
      color: "emerald"
    }
  ];

  const courses = [
    "Money Mistakes to Avoid in Your 20s",
    "How to Build Wealth with a 9-5 Job",
    "Debt-Free Living in Africa",
    "Start Investing with ₦5,000",
    "Understanding Nigerian Capital Market"
  ];

  return (
    <section id="education" className="py-16 bg-gradient-to-br from-emerald-50 to-gold-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">
            Investment Education Hub
          </h2>
          <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
            Learn about safe investment opportunities in Africa and build your wealth with expert guidance from Finance Wise.
          </p>
        </div>

        {/* Investment Options */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
            Safe Investment Options in Africa
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {investments.map((investment, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-emerald-900">{investment.title}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`bg-${investment.color}-100 text-${investment.color}-700 border-${investment.color}-200`}
                    >
                      {investment.riskLevel}
                    </Badge>
                  </div>
                  <CardDescription>{investment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Minimum:</span>
                      <span className="font-semibold text-emerald-800">{investment.minAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Expected Return:</span>
                      <span className="font-semibold text-emerald-800">{investment.expectedReturn}</span>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Warning Section */}
        <Card className="mb-12 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <CardTitle className="text-red-800">Avoid Investment Scams</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-800 mb-3">Red Flags to Watch For:</h4>
                <ul className="space-y-2 text-red-700">
                  <li>• Promises of unrealistic returns (50%+ monthly)</li>
                  <li>• Pressure to recruit others (Ponzi schemes)</li>
                  <li>• Lack of proper registration or licenses</li>
                  <li>• No clear business model or transparency</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-3">Stay Safe:</h4>
                <ul className="space-y-2 text-red-700">
                  <li>• Verify with SEC Nigeria before investing</li>
                  <li>• Start small and research thoroughly</li>
                  <li>• Never invest borrowed money</li>
                  <li>• Diversify your investment portfolio</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Courses */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-900">
                <BookOpen className="w-6 h-6 mr-2" />
                Financial Education Courses
              </CardTitle>
              <CardDescription>
                Access premium and free content to accelerate your financial education
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-800">{course}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-gold-100 text-gold-800 border-gold-200">
                        {index < 2 ? "Premium" : "Free"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-900">
                <TrendingUp className="w-6 h-6 mr-2" />
                Finance Wise YouTube Channel
              </CardTitle>
              <CardDescription>
                Watch expert financial advice and join live Q&A sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-emerald-50 p-6 rounded-lg text-center mb-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Latest Video</h4>
                <p className="text-emerald-600 mb-4">"5 Investment Mistakes Nigerian Youth Make"</p>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Watch on YouTube
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Youtube.com/@financewise
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InvestmentEducation;
