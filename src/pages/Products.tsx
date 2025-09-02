import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrokerLogin from '@/components/BrokerLogin';
import BrokerDashboard from '@/components/BrokerDashboard';
import ProductCard from '@/components/ProductCard';
import CheckoutModal from '@/components/CheckoutModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Edit, Tag, Trash2 } from 'lucide-react';
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

interface Product {
  id: string;
  name: string;
  thickness: string;
  pricePerSqM: number;
  image: string;
  useCases: string[];
  description: string;
}

const Products = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBrokerLoggedIn, setIsBrokerLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null);
  const { toast } = useToast();

  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Luxury 35mm',
      thickness: '35',
      pricePerSqM: 1500,
      image: '/api/placeholder/300/200',
      useCases: ['Residential lawns', 'Luxury gardens', 'Rooftop terraces'],
      description: 'Ultra-soft luxury turf with realistic appearance, perfect for high-end residential applications.'
    },
    {
      id: '2',
      name: 'Family Perfect 30mm',
      thickness: '30',
      pricePerSqM: 1300,
      image: '/api/placeholder/300/200',
      useCases: ['Family gardens', 'Play areas', 'Pet-friendly spaces'],
      description: 'Durable and safe turf designed for families with children and pets, easy to maintain.'
    },
    {
      id: '3',
      name: 'Commercial Pro 25mm',
      thickness: '25',
      pricePerSqM: 1100,
      image: '/api/placeholder/300/200',
      useCases: ['Office spaces', 'Retail areas', 'Public spaces'],
      description: 'Hard-wearing commercial grade turf built to withstand heavy foot traffic.'
    },
    {
      id: '4',
      name: 'Budget Friendly 20mm',
      thickness: '20',
      pricePerSqM: 1000,
      image: '/api/placeholder/300/200',
      useCases: ['Small gardens', 'Balconies', 'Budget projects'],
      description: 'Cost-effective solution without compromising on quality, perfect for smaller spaces.'
    },
    {
      id: '5',
      name: 'Sports Elite 40mm',
      thickness: '40',
      pricePerSqM: 1600,
      image: '/api/placeholder/300/200',
      useCases: ['Sports fields', 'Training grounds', 'Professional venues'],
      description: 'Professional-grade turf designed for sports applications with FIFA certification.'
    },
    {
      id: '6',
      name: 'Eco Natural 28mm',
      thickness: '28',
      pricePerSqM: 1200,
      image: '/api/placeholder/300/200',
      useCases: ['Eco-conscious homes', 'Schools', 'Community spaces'],
      description: 'Environmentally friendly turf made from recycled materials with natural appearance.'
    }
  ];

  const discounts = [
    { id: 'first', name: 'First Transaction (15%)', value: 15 },
    { id: 'daily', name: 'Discount of the Day (10%)', value: 10 },
    { id: 'coupon', name: 'Special Coupon (20%)', value: 20 }
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
      description: `${product.name} (${width}m × ${length}m) - KES ${totalPrice.toLocaleString()}`,
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const totalCartValue = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    setCartCount(prev => prev - 1);
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
  };

  const handleEditCartItem = (itemId: string) => {
    // For simplicity, we'll just remove and let user re-add with new dimensions
    handleRemoveFromCart(itemId);
    toast({
      title: "Item Removed for Editing",
      description: "Please add the item again with new dimensions."
    });
  };

  const handleApplyDiscount = (discountId: string) => {
    const discount = discounts.find(d => d.id === discountId);
    if (!discount) return;

    const discountValue = (totalCartValue * discount.value) / 100;
    setDiscountAmount(discountValue);
    setAppliedDiscount(discount.name);
    
    toast({
      title: "Discount Applied!",
      description: `${discount.name} applied - Save KES ${discountValue.toLocaleString()}`
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to cart before checkout.",
        variant: "destructive"
      });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setCartCount(0);
    setDiscountAmount(0);
    setAppliedDiscount(null);
  };

  const finalTotal = totalCartValue - discountAmount;

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
                <div className="flex items-center justify-between mb-4">
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
                      KES {finalTotal.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total area: {cartItems.reduce((sum, item) => sum + item.area, 0).toFixed(1)} m²
                    </p>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-3 mb-4">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.width}m × {item.length}m = {item.area.toFixed(1)}m²
                        </p>
                        <p className="text-sm font-semibold">KES {item.totalPrice.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditCartItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Section */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Apply Discount
                    </h4>
                    {appliedDiscount && (
                      <Badge variant="secondary">{appliedDiscount}</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {discounts.map(discount => (
                      <Button
                        key={discount.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyDiscount(discount.id)}
                        disabled={appliedDiscount === discount.name}
                        className="text-xs"
                      >
                        {discount.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>KES {totalCartValue.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-KES {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                    <span>Total:</span>
                    <span>KES {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full mt-4"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
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
                  href="tel:+254743375997" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  Call us: +254 743 375 997
                </a>
                <a 
                  href="mailto:info@eastleighturfgrass.com" 
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

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={totalCartValue}
        discountAmount={discountAmount}
        onOrderComplete={handleOrderComplete}
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