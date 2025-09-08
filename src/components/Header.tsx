import { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/ThemeProvider';
import grassTextureBg from '@/assets/grass-texture-bg.jpg';
import mainLogo from '@/assets/mainLogo.png';

interface HeaderProps {
  cartCount: number;
  onBrokerLogin: () => void;
}

const Header = ({ cartCount, onBrokerLogin }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  const handleCartClick = () => {
    if (location.pathname === '/products') {
      const cartSummary = document.getElementById('cart-summary');
      if (cartSummary) {
        cartSummary.scrollIntoView({ behavior: 'smooth' });
      } else {
        scrollToTop();
      }
    } else {
      // Navigate to products page and then scroll to cart
      window.location.href = '/products#cart-summary';
    }
  };

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
        className="relative lg:fixed lg:top-3 lg:left-4 lg:right-4 mx-auto z-50 transition-all duration-300 bg-[hsl(88,36%,70%)] border border-gray-400 rounded-md lg:mx-4"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
              <img
                src={mainLogo}
                alt="Eastleigh Turf Grass Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg text-black">Eastleigh Turf Grass</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={scrollToTop}
                  className={`text-base font-medium transition-colors duration-200 hover:text-white ${location.pathname === item.path ? '' : 'text-foreground'
                    }`}
                  style={{
                    color: location.pathname === item.path ? 'hsl(84, 100%, 66%)' : undefined
                  }}
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={handleCartClick}
              >
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
                className="md:hidden relative z-[60]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className={`w-5 h-5 ${isDashboard ? 'text-black' : 'text-black'}`} />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
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
                className={`mobile-nav-link ${isDashboard ? 'text-black' : 'text-white'} ${location.pathname === item.path ? 'active' : ''
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
              className={`flex items-center space-x-2 mt-4 ${isDashboard
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