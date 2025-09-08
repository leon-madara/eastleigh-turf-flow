import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrokerLogin from '@/components/BrokerLogin';
import BrokerDashboard from '@/components/BrokerDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Calculator,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBrokerLoggedIn, setIsBrokerLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    projectType: 'residential',
    area: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Quote Request Sent!",
        description: "We'll contact you within 24 hours with a detailed quote.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        projectType: 'residential',
        area: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const estimatePrice = () => {
    const area = parseFloat(formData.area);
    if (!area) return null;

    const basePrice = formData.projectType === 'commercial' ? 1100 : 1300;
    const total = area * basePrice;
    return total;
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+254 743 375 997',
      description: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      action: 'tel:+254743375997'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'info@eastleighturfgrass.com',
      description: 'We respond within 2 hours',
      action: 'mailto:info@eastleighturfgrass.com'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      details: '+254 743 375 997',
      description: 'Quick responses 9AM-5PM',
      action: 'https://wa.me/254743375997'
    }
  ];

  const services = [
    'Free site consultation',
    'Detailed project planning',
    'Ground preparation',
    'Professional installation',
    'Quality assurance check',
    '10-year warranty'
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

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get Your <span className="text-gradient">Free Quote</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to transform your outdoor space? Contact us today for a free consultation
              and personalized quote. Our experts are here to help bring your vision to life.
            </p>
          </div>

          {/* Request Quote Form - Full Width */}
          <Card className="animate-fade-in mb-12">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span>Request Your Quote</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 712 345 678"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Project Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Full address of the project"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectType">Project Type</Label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="residential">Residential Garden</option>
                      <option value="commercial">Commercial Space</option>
                      <option value="sports">Sports Facility</option>
                      <option value="rooftop">Rooftop/Balcony</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="area">Approximate Area (m²)</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      step="0.1"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g. 50"
                    />
                  </div>
                </div>

                {/* Price Estimate */}
                {formData.area && estimatePrice() && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calculator className="w-4 h-4 text-accent" />
                      <span className="font-medium">Estimated Price Range</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      KES {Math.round(estimatePrice()! * 0.8).toLocaleString()} - KES {Math.round(estimatePrice()! * 1.2).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Final price may vary based on ground conditions and specific requirements
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="message">Project Details</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project, specific requirements, timeline, or any questions you have..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-bounce"
                  size="lg"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Get My Free Quote
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to be contacted by our team.
                  We respect your privacy and never share your information.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Get In Touch Section - Narrower Width */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.action}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <method.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {method.title}
                      </h4>
                      <p className="text-sm font-medium text-primary">{method.details}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Business Hours and Service Area Together */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Business Hours */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
                <div className="border-t pt-3">
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    Emergency consultations available
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Service Area */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Service Area</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  We proudly serve all of Nairobi and surrounding areas:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Eastleigh</div>
                  <div>• Westlands</div>
                  <div>• Karen</div>
                  <div>• Kileleshwa</div>
                  <div>• Lavington</div>
                  <div>• Runda</div>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Outside Nairobi? Contact us - we may still be able to help!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What's Included */}
          <Card className="animate-slide-up mb-12">
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Quick answers to common questions about our artificial turf installation process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">How long does installation take?</h3>
                  <p className="text-sm text-muted-foreground">
                    Most residential projects are completed within 1-2 days, depending on the area size
                    and ground conditions. We'll provide a detailed timeline during your consultation.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Do you offer financing options?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, we offer flexible payment plans to make your project more affordable.
                    Contact us to discuss financing options that work for your budget.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">What's included in the warranty?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our 10-year warranty covers fading, wear, and manufacturing defects.
                    We also provide a 2-year workmanship guarantee on our installation.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Can I see samples before deciding?</h3>
                  <p className="text-sm text-muted-foreground">
                    Absolutely! We bring samples to every consultation so you can feel the quality
                    and see how different products look in your space.
                  </p>
                </CardContent>
              </Card>
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

export default Contact;