
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Star, Smartphone, Apple } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-16 bg-african-gradient text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="bg-white/20 text-white border-white/30 mb-6 animate-fade-in">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Join 50,000+ African Youth Building Wealth
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight animate-fade-in">
            Start Your Financial Journey Today
          </h2>
          
          <p className="text-xl mb-8 text-white/90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Download MyFinance and get personalized financial guidance, smart budgeting tools, 
            and investment education designed specifically for African youth. Your wealth-building journey starts now!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              disabled
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-white/90 font-semibold group px-8 py-4"
            >
              <Download className="mr-2 h-5 w-5" />
              Android app — coming soon
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              disabled
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-emerald-600 font-semibold px-8 py-4"
            >
              <Apple className="mr-2 h-5 w-5" />
              iOS app — coming soon
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-white/80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₦2.5B+</div>
              <div className="text-white/80">Money Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">4.9★</div>
              <div className="text-white/80">App Store Rating</div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-xl font-semibold mb-4">What you get with MyFinance:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Personalized financial health assessment</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Smart budgeting and expense tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>African investment education hub</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Access to certified financial coaches</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Community forum and peer support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Daily money tips and notifications</span>
              </div>
            </div>
          </div>

          <div className="mt-8 animate-fade-in" style={{ animationDelay: '1s' }}>
            <p className="text-white/80 text-sm">
              Web access is available now • Mobile apps are coming soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
