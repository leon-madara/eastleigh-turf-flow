import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import BrokerLogin from '@/components/BrokerLogin';
import BrokerDashboard from '@/components/BrokerDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Truck, Award, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBrokerLoggedIn, setIsBrokerLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const featuredProducts = [
    {
      id: '1',
      name: 'Luxury Turf 30mm',
      price: 1300,
      image: '/src/assets/Products/luxury-turf-30mm.png',
      description: 'Ultra-soft luxury turf perfect for high-end residential spaces',
      features: ['30mm pile height', 'UV resistant', '10-year warranty']
    },
    {
      id: '2',
      name: 'Sports Turf 20mm',
      price: 1100,
      image: '/src/assets/Products/sports-turf-20mm.png',
      description: 'Durable and safe turf ideal for sports and playgrounds',
      features: ['20mm pile height', 'Enhanced durability', 'Weather resistant']
    },
    {
      id: '3',
      name: 'Professional Grade 40mm',
      price: 1600,
      image: '/src/assets/Products/professional-grade-40mm.png',
      description: 'Professional-grade turf designed for sports applications',
      features: ['40mm pile height', 'Maximum durability', 'Championship quality']
    }
  ];

  const testimonials = [
    {
      name: 'James Mwangi',
      location: 'Nairobi',
      rating: 5,
      comment: 'Absolutely thrilled with our new lawn! The transformation is incredible and the quality is outstanding.',
      product: 'Premium Luxury 35mm'
    },
    {
      name: 'Grace Wanjiku',
      location: 'Eldoret',
      rating: 5,
      comment: 'Perfect for our garden. The kids love playing on it and it looks amazing all year round.',
      product: 'Family Perfect 30mm'
    },
    {
      name: 'Peter Kipchoge',
      location: 'Mombasa',
      rating: 5,
      comment: 'Professional installation and top-quality turf. Highly recommend Eastleigh Turf Grass!',
      product: 'Sports Elite 40mm'
    }
  ];

  if (isBrokerLoggedIn) {
    return <BrokerDashboard onLogout={() => setIsBrokerLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative lg:h-screen">
        <Header
          cartCount={cartCount}
          onBrokerLogin={() => setIsLoginOpen(true)}
        />
        <Hero />
      </div>

      {/* Product Showcase Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our range of premium artificial turf designed for every need,
              from luxurious residential lawns to professional sports facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="card-hover group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gradient-to-br from-grass-light to-grass-medium rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <CardTitle className="text-white text-xl font-bold mb-2">{product.name}</CardTitle>
                      <div className="text-accent font-bold text-2xl">KES {product.price.toLocaleString()}/m²</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/products">
                    <Button className="w-full btn-bounce">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="outline" className="btn-bounce">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">10 Year Warranty</h3>
              <p className="text-sm text-muted-foreground">Long-lasting quality guaranteed</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Free Delivery</h3>
              <p className="text-sm text-muted-foreground">On orders over KES 50,000</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expert Installation</h3>
              <p className="text-sm text-muted-foreground">Professional fitting service</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">5-Star Rated</h3>
              <p className="text-sm text-muted-foreground">Trusted by 1000+ customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Don't just take our word for it. See what our satisfied customers
              have to say about their turf transformation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-accent mr-3" />
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.comment}"
                  </p>

                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {testimonial.product}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

export default Home;