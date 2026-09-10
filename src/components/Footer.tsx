
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Youtube, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-african-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MF</span>
              </div>
              <span className="text-xl font-bold">MyFinance</span>
            </div>
            <p className="text-emerald-200 mb-4 leading-relaxed">
              MyFinance by Finance Wise empowers African youth to master their finances and build lasting wealth through education, tools, and community support.
            </p>
            <div className="flex space-x-4">
              <Youtube className="w-5 h-5 text-emerald-300 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-emerald-300 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-emerald-300 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-emerald-300 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-emerald-200 hover:text-white transition-colors">Features</a></li>
              <li><a href="#health-check" className="text-emerald-200 hover:text-white transition-colors">Financial Health Check</a></li>
              <li><a href="#education" className="text-emerald-200 hover:text-white transition-colors">Investment Education</a></li>
              <li><a href="#testimonials" className="text-emerald-200 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="text-emerald-200 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              <li><span className="text-emerald-200">Smart Budgeting</span></li>
              <li><span className="text-emerald-200">Savings Tracking</span></li>
              <li><span className="text-emerald-200">Investment Education</span></li>
              <li><span className="text-emerald-200">Financial Coaching</span></li>
              <li><span className="text-emerald-200">Community Support</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200">hello@financewise.ng</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200">+234 (0) 800-FINANCE</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200">Lagos, Nigeria</span>
              </div>
              <div className="flex items-center space-x-3">
                <Youtube className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200">Youtube.com/@financewise</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-emerald-700" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-emerald-200 text-sm mb-4 md:mb-0">
            © 2024 MyFinance by Finance Wise. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="/legal/privacy" className="text-emerald-200 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/legal/terms" className="text-emerald-200 hover:text-white transition-colors">Terms of Service</a>
            <a href="/legal/cookies" className="text-emerald-200 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
