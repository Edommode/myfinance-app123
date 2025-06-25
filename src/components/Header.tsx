
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-african-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MF</span>
          </div>
          <span className="text-xl font-bold text-emerald-800">MyFinance</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-emerald-700 hover:text-emerald-800 transition-colors">Features</a>
          <a href="#health-check" className="text-emerald-700 hover:text-emerald-800 transition-colors">Health Check</a>
          <a href="#education" className="text-emerald-700 hover:text-emerald-800 transition-colors">Education</a>
          <a href="#testimonials" className="text-emerald-700 hover:text-emerald-800 transition-colors">Testimonials</a>
          <a href="#contact" className="text-emerald-700 hover:text-emerald-800 transition-colors">Contact</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            Sign In
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Download App
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 animate-fade-in">
          <nav className="flex flex-col space-y-4 p-4">
            <a href="#features" className="text-emerald-700 hover:text-emerald-800 transition-colors">Features</a>
            <a href="#health-check" className="text-emerald-700 hover:text-emerald-800 transition-colors">Health Check</a>
            <a href="#education" className="text-emerald-700 hover:text-emerald-800 transition-colors">Education</a>
            <a href="#testimonials" className="text-emerald-700 hover:text-emerald-800 transition-colors">Testimonials</a>
            <a href="#contact" className="text-emerald-700 hover:text-emerald-800 transition-colors">Contact</a>
            <hr className="border-emerald-100" />
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              Sign In
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Download App
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
