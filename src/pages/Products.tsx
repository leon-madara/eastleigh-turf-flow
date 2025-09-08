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
import { ShoppingCart, Edit, Tag, Trash2, Ruler } from 'lucide-react';
import CartEditDropdown from '@/components/CartEditDropdown';
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
      name: 'Premium Turf 15mm',
      thickness: '15',
      pricePerSqM: 1000,
      image: '/Products/EnduraTurf.png',
      useCases: ['Residential', 'Light Traffic', 'Decorative'],
      description: 'Premium 15mm artificial turf featuring natural appearance, UV resistance, and easy maintenance. Includes advanced drainage system and soft texture, perfect for residential areas with light traffic and decorative applications.'
    },
    {
      id: '2',
      name: 'Sports Turf 20mm',
      thickness: '20',
      pricePerSqM: 1100,
      image: '/Products/FlexTurf.png',
      useCases: ['Sports', 'Playgrounds', 'Schools'],
      description: 'Professional 20mm sports turf with enhanced durability and superior bounce. Features weather resistance and high traffic tolerance, making it ideal for sports facilities, playgrounds, and school environments.'
    },
    {
      id: '3',
      name: 'Luxury Turf 30mm',
      thickness: '30',
      pricePerSqM: 1300,
      image: '/Products/VelvetGreen.png',
      useCases: ['Premium Residential', 'Commercial', 'Hospitality'],
      description: 'Luxury 30mm artificial turf offering premium quality with realistic feel and long-lasting performance. Features excellent drainage and fade resistance, perfect for premium residential, commercial, and hospitality applications.'
    },
    {
      id: '4',
      name: 'Elite Turf 35mm',
      thickness: '35',
      pricePerSqM: 1500,
      image: '/Products/UltraTurf.png',
      useCases: ['High-end Commercial', 'Sports Facilities', 'Luxury Homes'],
      description: 'Elite 35mm artificial turf delivering maximum comfort and professional grade performance. Built with heavy duty construction and advanced technology, offering superior aesthetics for high-end commercial and luxury home applications.'
    },
    {
      id: '5',
      name: 'Professional Grade 40mm',
      thickness: '40',
      pricePerSqM: 1600,
      image: '/Products/ProfessionalGrade.png',
      useCases: ['Professional Sports', 'Commercial', 'Premium'],
      description: 'Professional grade 40mm turf featuring maximum durability and superior performance. Weather proof construction with championship quality standards, designed for professional sports venues and premium commercial applications.'
    },
    {
      id: '6',
      name: 'Championship Turf 45mm',
      thickness: '45',
      pricePerSqM: 1800,
      image: '/Products/ProfitGrass.png',
      useCases: ['Championship', 'Premium Sports', 'Elite Facilities'],
      description: 'Championship 45mm artificial turf representing the ultimate in performance and quality. Features elite grade construction with professional standards and premium durability, designed for championship venues and elite sports facilities.'
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

  const handleEditCartItem = (itemId: string, newWidth: number, newLength: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
            ...item,
            width: newWidth,
            length: newLength,
            area: newWidth * newLength,
            totalPrice: newWidth * newLength * item.pricePerSqM
          }
          : item
      )
    );
    toast({
      title: "Item Updated",
      description: "Cart item dimensions have been updated successfully."
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

            <main className="pt-40 pb-20">
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

          {/* Free Measurement Card */}
          <Card className="mb-8 bg-blue-50 border-blue-200 animate-fade-in">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Ruler className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-blue-800">Unsure About Your Measurements?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  No problem! We can connect you with a trusted installer (<i>fundi</i>) who will visit your location, take precise measurements, and provide all the details you need—completely free of charge.
                </p>
              </div>
              <div className="flex-shrink-0 mt-4 md:mt-0">
                <a
                  href="https://wa.me/254743375997?text=Hello!%20I'm%20interested%20in%20a%20free%20measurement%20for%20my%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Request a Free Measurement
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div id="cart-summary">
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
                    <div key={item.id} className="md:flex md:items-center md:justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center gap-3 md:flex-1">
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                        <div className="md:flex md:items-center md:gap-4 md:flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.width}m × {item.length}m = {item.area.toFixed(1)}m²
                          </p>
                          <p className="text-sm font-semibold">KES {item.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <CartEditDropdown
                          item={item}
                          onSave={handleEditCartItem}
                        />
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
            </div>
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