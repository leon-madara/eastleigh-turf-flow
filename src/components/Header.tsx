import { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/ThemeProvider';
import grassTextureBg from '@/assets/grass-texture-bg.jpg';

interface HeaderProps {
  cartCount: number;
  onBrokerLogin: () => void;
}

const Header = ({ cartCount, onBrokerLogin }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isDashboard = location.pathname.includes('/dashboard');
  
  return (
    <>
      <header 
        className={`fixed top-6 left-2 right-3 z-50 transition-all duration-300 ${
          isScrolled ? 'floating-header-with-bg' : 'bg-transparent'
        }`}
        style={{
          borderRadius: 'var(--radius)',
        }}
      >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ET</span>
            </div>
            <span className="font-bold text-lg text-primary">Eastleigh Turf Grass</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={scrollToTop}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname === item.path ? 'text-primary' : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 p-0"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Cart Icon */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Broker Login */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBrokerLogin}
              className="hidden sm:flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Broker Login</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`hamburger-icon ${isMobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Button>
          </div>
        </div>

        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <nav className="flex flex-col items-center justify-center space-y-8 h-full">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`mobile-nav-link ${isDashboard ? 'text-black' : 'text-white'} ${
                  location.pathname === item.path ? 'active' : ''
                }`}
                onClick={() => {
                  scrollToTop();
                  setIsMobileMenuOpen(false);
                }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
              </Link>
            ))}
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                onBrokerLogin();
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 mt-4 ${
                isDashboard 
                  ? 'border-black text-black hover:bg-black hover:text-white' 
                  : 'border-white text-white hover:bg-white hover:text-black'
              }`}
              style={{ animationDelay: '0.4s' }}
            >
              <User className="w-4 h-4" />
              <span>Broker Login</span>
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;