import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrokerLogin from '@/components/BrokerLogin';
import BrokerDashboard from '@/components/BrokerDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Award,
  Clock,
  MapPin,
  Leaf,
  Shield,
  Truck,
  CheckCircle,
  Target,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBrokerLoggedIn, setIsBrokerLoggedIn] = useState(false);

  const stats = [
    { icon: Users, label: 'Happy Customers', value: '1,500+', color: 'text-blue-600' },
    { icon: Award, label: 'Years Experience', value: '15+', color: 'text-green-600' },
    { icon: MapPin, label: 'Projects Completed', value: '2,000+', color: 'text-purple-600' },
    { icon: Clock, label: 'Installation Time', value: '24hrs', color: 'text-orange-600' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We source only the finest artificial turf materials with comprehensive warranties and quality guarantees.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure every customer is delighted with their new lawn.'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Our turf solutions help conserve water and eliminate the need for harmful pesticides and fertilizers.'
    },
    {
      icon: Target,
      title: 'Precision Installation',
      description: 'Our certified installers ensure perfect results with attention to every detail, from preparation to finishing.'
    }
  ];

  const team = [
    {
      name: 'James Mitchell',
      role: 'Founder & CEO',
      experience: '15+ years',
      bio: 'James founded Eastleigh Turf Grass with a vision to transform outdoor spaces across Hampshire.',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Sarah Campbell',
      role: 'Head of Installation',
      experience: '12+ years',
      bio: 'Sarah leads our installation team, ensuring every project meets our exacting standards.',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Michael Roberts',
      role: 'Customer Relations',
      experience: '8+ years',
      bio: 'Michael ensures our customers receive exceptional service from initial consultation to completion.',
      image: '/api/placeholder/200/200'
    }
  ];

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
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient">Eastleigh Turf Grass</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              For over 15 years, we've been transforming outdoor spaces across Hampshire with
              premium artificial turf solutions. From residential gardens to commercial installations,
              we bring expertise, quality, and passion to every project.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="card-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <div className="animate-fade-in mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground max-w-4xl">
                <p>
                  Founded in 2008 by James Mitchell, Eastleigh Turf Grass began as a small family business
                  with a simple mission: to provide beautiful, low-maintenance lawns that families could
                  enjoy year-round.
                </p>
                <p>
                  What started as a local service has grown into Kenya's most trusted artificial turf
                  provider. We've completed over 2,000 installations, from small residential gardens to
                  large commercial projects, always maintaining our commitment to quality and customer satisfaction.
                </p>
                <p>
                  Today, we're proud to be at the forefront of artificial turf technology, offering
                  eco-friendly solutions that save water, eliminate chemical treatments, and provide
                  stunning results that last for years.
                </p>
              </div>
              <div className="mt-6">
                <Link to="/contact">
                  <Button className="btn-bounce">Get Your Free Quote</Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-slide-up max-w-md mx-auto">
              <div className="aspect-square bg-gradient-to-br from-grass-light to-grass-medium rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Users className="w-20 h-20 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">15+ Years</h3>
                    <p className="text-lg">of Excellence</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Fully Insured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These core principles guide everything we do, from product selection to customer service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The experienced professionals behind every successful installation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="card-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-grass-light to-grass-medium rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Badge variant="secondary">{member.role}</Badge>
                      <Badge variant="outline">{member.experience}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Eastleigh Turf Grass?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We're not just about selling turf – we're about creating outdoor spaces that bring joy for years to come.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Premium Quality Products</h4>
                  <p className="text-sm text-muted-foreground">Only the finest artificial turf from trusted manufacturers</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Professional Installation</h4>
                  <p className="text-sm text-muted-foreground">Certified installers with 15+ years experience</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">10-Year Warranty</h4>
                  <p className="text-sm text-muted-foreground">Comprehensive coverage for peace of mind</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Free Consultation</h4>
                  <p className="text-sm text-muted-foreground">Expert advice tailored to your specific needs</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Local Hampshire Business</h4>
                  <p className="text-sm text-muted-foreground">Supporting our community for over 15 years</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Competitive Pricing</h4>
                  <p className="text-sm text-muted-foreground">Best value for money without compromising quality</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link to="/contact">
                <Button size="lg" className="btn-bounce">
                  Start Your Project Today
                </Button>
              </Link>
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
    </div>
  );
};

export default About;