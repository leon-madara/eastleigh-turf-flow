import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Clock, 
  MessageSquare, 
  User, 
  Calculator,
  Send,
  LogOut,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrokerDashboardProps {
  onLogout: () => void;
}

const BrokerDashboard = ({ onLogout }: BrokerDashboardProps) => {
  const [orderForm, setOrderForm] = useState({
    product: '',
    sqMeters: '',
    amount: '',
    discount: '',
    customerPhone: '',
    customerLocation: ''
  });
  
  const [userDetails, setUserDetails] = useState({
    name: 'John Broker',
    phone: '+44 123 456 7890',
    email: 'john@eastleighturf.co.uk'
  });

  const [inquiryForm, setInquiryForm] = useState({
    product: '',
    sqMeters: '',
    suggestedPrice: '',
    notes: ''
  });

  const { toast } = useToast();

  const products = [
    { id: '1', name: 'Premium Luxury 35mm', price: 25 },
    { id: '2', name: 'Family Perfect 30mm', price: 22 },
    { id: '3', name: 'Commercial Pro 25mm', price: 18 },
    { id: '4', name: 'Budget Friendly 20mm', price: 15 },
    { id: '5', name: 'Sports Elite 40mm', price: 30 },
    { id: '6', name: 'Eco Natural 28mm', price: 20 }
  ];

  const discounts = [
    { id: 'first', name: 'First Transaction', value: 15 },
    { id: 'daily', name: 'Discount of the Day', value: 10 },
    { id: 'coupon', name: 'Special Coupon', value: 20 }
  ];

  const calculateTotal = (product: string, sqMeters: string, discount: string) => {
    const selectedProduct = products.find(p => p.id === product);
    const meters = parseFloat(sqMeters);
    
    if (!selectedProduct || !meters) return { subtotal: 0, discountAmount: 0, total: 0 };
    
    const subtotal = selectedProduct.price * meters;
    const selectedDiscount = discounts.find(d => d.id === discount);
    const discountAmount = selectedDiscount ? (subtotal * selectedDiscount.value) / 100 : 0;
    const total = subtotal - discountAmount;
    
    return { subtotal, discountAmount, total };
  };

  const handleSendOrder = (type: string) => {
    const { subtotal, discountAmount, total } = calculateTotal(
      orderForm.product, 
      orderForm.sqMeters, 
      orderForm.discount
    );
    
    if (!orderForm.product || !orderForm.sqMeters) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate WhatsApp message
    const selectedProduct = products.find(p => p.id === orderForm.product);
    const selectedDiscount = discounts.find(d => d.id === orderForm.discount);
    
    const message = `
New ${type} from Broker Dashboard:
Product: ${selectedProduct?.name}
Area: ${orderForm.sqMeters} m²
Subtotal: £${subtotal.toFixed(2)}
${selectedDiscount ? `Discount (${selectedDiscount.name}): -£${discountAmount.toFixed(2)}` : ''}
Total: £${total.toFixed(2)}
Customer Phone: ${orderForm.customerPhone}
Location: ${orderForm.customerLocation}
    `.trim();

    console.log('WhatsApp message:', message);
    
    toast({
      title: `${type} Sent!`,
      description: "Order details sent via WhatsApp successfully.",
    });

    // Reset form
    setOrderForm({
      product: '',
      sqMeters: '',
      amount: '',
      discount: '',
      customerPhone: '',
      customerLocation: ''
    });
  };

  const handleSendInquiry = () => {
    if (!inquiryForm.product || !inquiryForm.sqMeters || !inquiryForm.suggestedPrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedProduct = products.find(p => p.id === inquiryForm.product);
    const message = `
Broker Price Inquiry:
Product: ${selectedProduct?.name}
Area: ${inquiryForm.sqMeters} m²
Suggested Price: £${inquiryForm.suggestedPrice}
Notes: ${inquiryForm.notes}
    `.trim();

    console.log('Inquiry message:', message);
    
    toast({
      title: "Inquiry Sent!",
      description: "Price inquiry sent for negotiation.",
    });

    setInquiryForm({
      product: '',
      sqMeters: '',
      suggestedPrice: '',
      notes: ''
    });
  };

  const { subtotal, discountAmount, total } = calculateTotal(
    orderForm.product, 
    orderForm.sqMeters, 
    orderForm.discount
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Broker Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userDetails.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="preorders" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Pre-Orders</span>
            </TabsTrigger>
            <TabsTrigger value="inquiry" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Inquiry</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Create Order</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Product</Label>
                      <Select value={orderForm.product} onValueChange={(value) => 
                        setOrderForm(prev => ({ ...prev, product: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - £{product.price}/m²
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Square Meters</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={orderForm.sqMeters}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, sqMeters: e.target.value }))}
                        placeholder="Enter area in m²"
                      />
                    </div>

                    <div>
                      <Label>Discount</Label>
                      <Select value={orderForm.discount} onValueChange={(value) => 
                        setOrderForm(prev => ({ ...prev, discount: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount" />
                        </SelectTrigger>
                        <SelectContent>
                          {discounts.map(discount => (
                            <SelectItem key={discount.id} value={discount.id}>
                              {discount.name} - {discount.value}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Customer Phone</Label>
                      <Input
                        value={orderForm.customerPhone}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                        placeholder="Customer phone number"
                      />
                    </div>

                    <div>
                      <Label>Customer Location</Label>
                      <Input
                        value={orderForm.customerLocation}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, customerLocation: e.target.value }))}
                        placeholder="Customer location"
                      />
                    </div>

                    {/* Calculation Results */}
                    {orderForm.product && orderForm.sqMeters && (
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>£{subtotal.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-sm text-accent">
                            <span>Discount:</span>
                            <span>-£{discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                          <span>Total:</span>
                          <span>£{total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={() => handleSendOrder('Order')} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Order via WhatsApp
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pre-Orders Tab */}
          <TabsContent value="preorders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Create Pre-Order</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    Pre-orders allow customers to reserve products with advance payment.
                  </p>
                </div>
                
                {/* Same form as orders but with pre-order context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Product</Label>
                      <Select value={orderForm.product} onValueChange={(value) => 
                        setOrderForm(prev => ({ ...prev, product: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - £{product.price}/m²
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Square Meters</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={orderForm.sqMeters}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, sqMeters: e.target.value }))}
                        placeholder="Enter area in m²"
                      />
                    </div>

                    <div>
                      <Label>Amount Paid</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={orderForm.amount}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Amount customer has paid"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Discount</Label>
                      <Select value={orderForm.discount} onValueChange={(value) => 
                        setOrderForm(prev => ({ ...prev, discount: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount" />
                        </SelectTrigger>
                        <SelectContent>
                          {discounts.map(discount => (
                            <SelectItem key={discount.id} value={discount.id}>
                              {discount.name} - {discount.value}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Balance Calculation */}
                    {orderForm.product && orderForm.sqMeters && orderForm.amount && (
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Amount:</span>
                          <span>£{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Amount Paid:</span>
                          <span>£{parseFloat(orderForm.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                          <span>Balance:</span>
                          <span>£{Math.max(0, total - parseFloat(orderForm.amount)).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={() => handleSendOrder('Pre-Order')} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Pre-Order via WhatsApp
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiry Tab */}
          <TabsContent value="inquiry">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Price Inquiry</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Submit a price inquiry to negotiate better rates with suppliers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Product</Label>
                      <Select value={inquiryForm.product} onValueChange={(value) => 
                        setInquiryForm(prev => ({ ...prev, product: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - £{product.price}/m²
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Square Meters</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={inquiryForm.sqMeters}
                        onChange={(e) => setInquiryForm(prev => ({ ...prev, sqMeters: e.target.value }))}
                        placeholder="Enter area in m²"
                      />
                    </div>

                    <div>
                      <Label>Suggested Price (per m²)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={inquiryForm.suggestedPrice}
                        onChange={(e) => setInquiryForm(prev => ({ ...prev, suggestedPrice: e.target.value }))}
                        placeholder="Your suggested price"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Additional Notes</Label>
                      <Textarea
                        value={inquiryForm.notes}
                        onChange={(e) => setInquiryForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional notes for negotiation..."
                        rows={6}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSendInquiry} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Inquiry for Negotiation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>User Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={userDetails.name}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        value={userDetails.phone}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Your phone number"
                      />
                    </div>

                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={userDetails.email}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Your email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Account Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Account Type:</span>
                          <Badge variant="secondary">Broker</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status:</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Member Since:</span>
                          <span className="text-sm">Jan 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => {
                  toast({
                    title: "Profile Updated",
                    description: "Your profile information has been saved.",
                  });
                }}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrokerDashboard;