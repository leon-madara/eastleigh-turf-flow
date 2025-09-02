import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User, ArrowRight, ArrowLeft, Send } from 'lucide-react';
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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  onOrderComplete: () => void;
}

const CheckoutModal = ({ isOpen, onClose, cartItems, totalAmount, discountAmount = 0, onOrderComplete }: CheckoutModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Customer Details', icon: User },
    { number: 2, title: 'Contact & Location', icon: Phone },
    { number: 3, title: 'Review Order', icon: Send }
  ];

  const finalTotal = totalAmount - discountAmount;

  const handleLocationDetect = async () => {
    setIsDetectingLocation(true);
    
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Simulate location detection (in real app, use reverse geocoding)
              await new Promise(resolve => setTimeout(resolve, 2000));
              setCustomerDetails(prev => ({
                ...prev,
                location: 'Nairobi, Kenya'
              }));
              toast({
                title: "Location Detected",
                description: "Location has been automatically detected."
              });
            } catch (error) {
              toast({
                title: "Location Error",
                description: "Failed to detect location. Please enter manually.",
                variant: "destructive"
              });
            } finally {
              setIsDetectingLocation(false);
            }
          },
          (error) => {
            setIsDetectingLocation(false);
            toast({
              title: "Location Access Denied",
              description: "Please enter your location manually.",
              variant: "destructive"
            });
          }
        );
      }
    } catch (error) {
      setIsDetectingLocation(false);
      toast({
        title: "Location Error",
        description: "Location detection not supported. Please enter manually.",
        variant: "destructive"
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!customerDetails.name.trim()) {
        toast({
          title: "Name Required",
          description: "Please enter your full name.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!customerDetails.phone.trim() || !customerDetails.location.trim()) {
        toast({
          title: "Information Required",
          description: "Please provide phone number and location.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate Kenyan phone number
      const phonePattern = /^(\+254|0)[17]\d{8}$/;
      if (!phonePattern.test(customerDetails.phone.replace(/\s/g, ''))) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid Kenyan phone number.",
          variant: "destructive"
        });
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const formatPhoneNumber = (phone: string) => {
    // Format Kenyan phone number for WhatsApp
    let formattedPhone = phone.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    }
    return formattedPhone;
  };

  const handleSendOrder = () => {
    const whatsappNumber = '+254743375997';
    const businessName = 'Eastleigh Turf Grass';
    
    const orderItemsText = cartItems.map(item => 
      `• ${item.name} - ${item.width}m × ${item.length}m (${item.area.toFixed(1)}m²) - KES ${item.totalPrice.toLocaleString()}`
    ).join('\n');

    const totalArea = cartItems.reduce((sum, item) => sum + item.area, 0);
    const orderDate = new Date().toLocaleDateString();
    const orderTime = new Date().toLocaleTimeString();

    const message = `🏠 *${businessName} - New Order*

👤 *Customer Details:*
Name: ${customerDetails.name}
Phone: ${customerDetails.phone}
Location: ${customerDetails.location}

📦 *Order Items:*
${orderItemsText}

📊 *Order Summary:*
Total Area: ${totalArea.toFixed(1)}m²
Subtotal: KES ${totalAmount.toLocaleString()}
${discountAmount > 0 ? `Discount: -KES ${discountAmount.toLocaleString()}\n` : ''}*Final Total: KES ${finalTotal.toLocaleString()}*

📅 Order Date: ${orderDate}
🕒 Order Time: ${orderTime}

Please confirm this order and provide delivery details. Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Order Sent!",
      description: "Your order has been sent via WhatsApp.",
    });

    onOrderComplete();
    onClose();
    setCurrentStep(1);
    setCustomerDetails({ name: '', phone: '', location: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Checkout</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${currentStep >= step.number 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                  }
                `}>
                  <StepIcon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {/* Step 1: Customer Details */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Customer Information</h3>
                  <p className="text-muted-foreground">Please provide your full name</p>
                </div>
                
                <div>
                  <Label htmlFor="customer-name">Full Name *</Label>
                  <Input
                    id="customer-name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Contact & Location */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Contact & Location</h3>
                  <p className="text-muted-foreground">We need your contact details for delivery</p>
                </div>
                
                <div>
                  <Label htmlFor="customer-phone">Phone Number *</Label>
                  <Input
                    id="customer-phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254 7XX XXX XXX or 07XX XXX XXX"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a valid Kenyan phone number
                  </p>
                </div>

                <div>
                  <Label htmlFor="customer-location">Delivery Location *</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="customer-location"
                      value={customerDetails.location}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter your location"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleLocationDetect}
                      disabled={isDetectingLocation}
                      className="flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      {isDetectingLocation ? 'Detecting...' : 'Detect'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review Order */}
          {currentStep === 3 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Review Your Order</h3>
                  <p className="text-muted-foreground">Please review your order before sending</p>
                </div>

                {/* Customer Details Summary */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Customer Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {customerDetails.name}</p>
                    <p><strong>Phone:</strong> {customerDetails.phone}</p>
                    <p><strong>Location:</strong> {customerDetails.location}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-medium">Order Items</h4>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {item.width}m × {item.length}m ({item.area.toFixed(1)}m²)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">KES {item.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="bg-accent/10 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>KES {totalAmount.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Discount:</span>
                      <span>-KES {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                    <span>Final Total:</span>
                    <span>KES {finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNextStep} className="flex items-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSendOrder} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" />
              Send Order via WhatsApp
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;