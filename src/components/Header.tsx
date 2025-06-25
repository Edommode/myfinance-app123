
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-gold-500 rounded-lg"></div>
            <span className="text-xl font-bold text-emerald-900">MyFinance</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#health-check" className="text-emerald-700 hover:text-emerald-900 transition-colors">
              Health Check
            </a>
            <a href="#features" className="text-emerald-700 hover:text-emerald-900 transition-colors">
              Features
            </a>
            <a href="#education" className="text-emerald-700 hover:text-emerald-900 transition-colors">
              Education
            </a>
            <a href="#testimonials" className="text-emerald-700 hover:text-emerald-900 transition-colors">
              Success Stories
            </a>
            <a href="#contact" className="text-emerald-700 hover:text-emerald-900 transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-emerald-900" />
            ) : (
              <Menu className="w-6 h-6 text-emerald-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100">
            <nav className="flex flex-col space-y-4">
              <a
                href="#health-check"
                className="text-emerald-700 hover:text-emerald-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Health Check
              </a>
              <a
                href="#features"
                className="text-emerald-700 hover:text-emerald-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#education"
                className="text-emerald-700 hover:text-emerald-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Education
              </a>
              <a
                href="#testimonials"
                className="text-emerald-700 hover:text-emerald-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Success Stories
              </a>
              <a
                href="#contact"
                className="text-emerald-700 hover:text-emerald-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              {user ? (
                <div className="pt-4 border-t border-emerald-100 space-y-2">
                  <p className="text-sm text-emerald-600">
                    Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-emerald-100 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/auth")}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate("/auth")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
