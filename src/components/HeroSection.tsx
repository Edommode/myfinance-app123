
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, TrendingUp, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-emerald-50 to-gold-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trusted by 50,000+ African Youth
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-emerald-900 mb-6 leading-tight">
              Master Your 
              <span className="bg-african-gradient bg-clip-text text-transparent"> Finances</span>, 
              Build Your 
              <span className="text-gold-600">Wealth</span>
            </h1>
            
            <p className="text-lg text-emerald-700 mb-8 leading-relaxed">
              MyFinance by Finance Wise helps African youth take control of their money with smart budgeting, 
              savings tracking, local investment education, and personalized financial coaching.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white group">
                Start Your Financial Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <Smartphone className="mr-2 h-5 w-5" />
                Download App
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-emerald-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Bank-level Security
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Proven Results
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative mx-auto w-80 h-96 lg:w-96 lg:h-[500px]">
              {/* Phone mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="absolute inset-4 bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="h-full bg-gradient-to-b from-emerald-50 to-white p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-emerald-800">MyFinance</h3>
                      <div className="w-8 h-8 bg-emerald-100 rounded-full"></div>
                    </div>
                    
                    <div className="bg-african-gradient rounded-2xl p-4 text-white mb-4">
                      <p className="text-sm opacity-90">Total Savings</p>
                      <p className="text-2xl font-bold">₦125,000</p>
                      <p className="text-sm">+15% this month</p>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <span className="text-sm text-emerald-700">Emergency Fund</span>
                        <span className="text-sm font-semibold text-emerald-800">₦45,000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                        <span className="text-sm text-gold-700">Business Capital</span>
                        <span className="text-sm font-semibold text-gold-800">₦80,000</span>
                      </div>
                      <div className="bg-emerald-600 rounded-lg p-3 text-white text-center">
                        <p className="text-sm">Financial Health Score</p>
                        <p className="text-xl font-bold">85/100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
