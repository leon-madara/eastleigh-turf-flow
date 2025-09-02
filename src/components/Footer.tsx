import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-grass-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-foreground font-bold text-sm">ET</span>
              </div>
              <span className="font-bold text-lg">Eastleigh Turf Grass</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium artificial turf solutions for residential and commercial spaces. 
              Transform your landscape with our high-quality, durable grass products.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-300 hover:text-accent transition-colors text-sm">
                Home
              </Link>
              <Link to="/products" className="text-gray-300 hover:text-accent transition-colors text-sm">
                Products
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-accent transition-colors text-sm">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-accent transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-gray-300">Eastleigh, Hampshire, UK</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-gray-300">+44 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-gray-300">info@eastleighturf.co.uk</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Business Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                <div className="text-gray-300">
                  <div>Mon - Fri: 8:00 AM - 6:00 PM</div>
                  <div>Sat: 9:00 AM - 4:00 PM</div>
                  <div>Sun: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-grass-medium/30 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Eastleigh Turf Grass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;