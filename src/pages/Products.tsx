import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrokerLogin from '@/components/BrokerLogin';
import BrokerDashboard from '@/components/BrokerDashboard';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  width: number;
  length: number;
  pricePerSqM: number;
  totalPrice: number;
  area: number;
}

const Products = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBrokerLoggedIn, setIsBrokerLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { toast } = useToast();

  const products = [
    {
      id: '1',
      name: 'Premium Luxury 35mm',
      thickness: '35',
      pricePerSqM: 25,
      image: '/api/placeholder/300/200',
      useCases: ['Residential lawns', 'Luxury gardens', 'Rooftop terraces'],
      description: 'Ultra-soft luxury turf with realistic appearance, perfect for high-end residential applications.'
    },
    {
      id: '2',
      name: 'Family Perfect 30mm',
      thickness: '30',
      pricePerSqM: 22,
      image: '/api/placeholder/300/200',
      useCases: ['Family gardens', 'Play areas', 'Pet-friendly spaces'],
      description: 'Durable and safe turf designed for families with children and pets, easy to maintain.'
    },
    {
      id: '3',
      name: 'Commercial Pro 25mm',
      thickness: '25',
      pricePerSqM: 18,
      image: '/api/placeholder/300/200',
      useCases: ['Office spaces', 'Retail areas', 'Public spaces'],
      description: 'Hard-wearing commercial grade turf built to withstand heavy foot traffic.'
    },
    {
      id: '4',
      name: 'Budget Friendly 20mm',
      thickness: '20',
      pricePerSqM: 15,
      image: '/api/placeholder/300/200',
      useCases: ['Small gardens', 'Balconies', 'Budget projects'],
      description: 'Cost-effective solution without compromising on quality, perfect for smaller spaces.'
    },
    {
      id: '5',
      name: 'Sports Elite 40mm',
      thickness: '40',
      pricePerSqM: 30,
      image: '/api/placeholder/300/200',
      useCases: ['Sports fields', 'Training grounds', 'Professional venues'],
      description: 'Professional-grade turf designed for sports applications with FIFA certification.'
    },
    {
      id: '6',
      name: 'Eco Natural 28mm',
      thickness: '28',
      pricePerSqM: 20,
      image: '/api/placeholder/300/200',
      useCases: ['Eco-conscious homes', 'Schools', 'Community spaces'],
      description: 'Environmentally friendly turf made from recycled materials with natural appearance.'
    }
  ];

  const handleAddToCart = (product: any, width: number, length: number, totalPrice: number) => {
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      width,
      length,
      pricePerSqM: product.pricePerSqM,
      totalPrice,
      area: width * length
    };

    setCartItems(prev => [...prev, newItem]);
    setCartCount(prev => prev + 1);
    
    toast({
      title: "Added to Cart!",
      description: `${product.name} (${width}m × ${length}m) - £${totalPrice.toFixed(2)}`,
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const totalCartValue = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (isBrokerLoggedIn) {
    return <BrokerDashboard onLogout={() => setIsBrokerLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartCount={cartCount} 
        onBrokerLogin={() => setIsLoginOpen(true)} 
      />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient">Products</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Choose from our comprehensive range of premium artificial turf products. 
              Each product is carefully selected for quality, durability, and aesthetic appeal.
            </p>
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <Card className="mb-8 bg-accent/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-5 h-5 text-accent" />
                    <div>
                      <h3 className="font-semibold">Cart Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      £{totalCartValue.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total area: {cartItems.reduce((sum, item) => sum + item.area, 0).toFixed(1)} m²
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-20 text-center">
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Need Help Choosing?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our turf experts are here to help you select the perfect product for your needs. 
                Contact us for a free consultation and personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+441234567890" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  Call us: +44 123 456 7890
                </a>
                <a 
                  href="mailto:info@eastleighturf.co.uk" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Email us for quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <BrokerLogin 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={() => setIsBrokerLoggedIn(true)}
      />

      {/* Cart Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg animate-bounce-in z-50">
          Item added to cart!
        </div>
      )}
    </div>
  );
};

export default Products;