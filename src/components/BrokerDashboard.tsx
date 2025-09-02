import React, { useState, useEffect } from 'react';
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
  Tag,
  Wallet
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
    phone: '+254 743 375 997',
    email: 'john@eastleighturfgrass.com'
  });

  const [inquiryForm, setInquiryForm] = useState({
    product: '',
    sqMeters: '',
    suggestedPrice: '',
    notes: ''
  });

  const [brokerBalance, setBrokerBalance] = useState(() => {
    const savedBalance = localStorage.getItem('brokerBalance');
    return savedBalance ? parseFloat(savedBalance) : 0;
  });

  const [paymentAmount, setPaymentAmount] = useState('');

  const { toast } = useToast();

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('brokerBalance', brokerBalance.toString());
  }, [brokerBalance]);

  const products = [
    { id: '1', name: 'Premium Luxury 35mm', price: 1500 },
    { id: '2', name: 'Family Perfect 30mm', price: 1300 },
    { id: '3', name: 'Commercial Pro 25mm', price: 1100 },
    { id: '4', name: 'Budget Friendly 20mm', price: 1000 },
    { id: '5', name: 'Sports Elite 40mm', price: 1600 },
    { id: '6', name: 'Eco Natural 28mm', price: 1200 }
  ];

  const discounts = [
    { id: 'first', name: 'First Transaction', value: 15 },
    { id: 'daily', name: 'Discount of the Day', value: 10 },
    { id: 'coupon', name: 'Special Coupon', value: 20 }
  ];

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const formatNumber = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    return number.toLocaleString();
  };

  const handlePaymentAmountChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue) {
      const formatted = parseFloat(numericValue).toLocaleString();
      setPaymentAmount(formatted);
    } else {
      setPaymentAmount('');
    }
  };

  const handlePayment = () => {
    const payment = parseFloat(paymentAmount.replace(/,/g, ''));
    if (payment > 0) {
      setBrokerBalance(prev => prev + payment);
      toast({
        title: "Payment Added!",
        description: `KES ${payment.toLocaleString()} added to your balance.`
      });
      setPaymentAmount('');
    }
  };

  const handleDeductFromBalance = (amount: number) => {
    if (amount <= brokerBalance) {
      setBrokerBalance(prev => prev - amount);
      toast({
        title: "Balance Updated!",
        description: `KES ${amount.toLocaleString()} deducted from your balance.`
      });
    } else {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this transaction.",
        variant: "destructive"
      });
    }
  };

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
Subtotal: KES ${subtotal.toLocaleString()}
${selectedDiscount ? `Discount (${selectedDiscount.name}): -KES ${discountAmount.toLocaleString()}` : ''}
Total: KES ${total.toLocaleString()}
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
Suggested Price: KES ${parseFloat(inquiryForm.suggestedPrice).toLocaleString()}
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
          <div className="flex items-center gap-4">
            {/* Balance Display */}
            <div className="bg-primary/10 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-bold text-primary">{formatCurrency(brokerBalance)}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
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
                               {product.name} - KES {product.price.toLocaleString()}/m²
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
                           <span>{formatCurrency(subtotal)}</span>
                         </div>
                         {discountAmount > 0 && (
                           <div className="flex justify-between text-sm text-accent">
                             <span>Discount:</span>
                             <span>-{formatCurrency(discountAmount)}</span>
                           </div>
                         )}
                         <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                           <span>Total:</span>
                           <span>{formatCurrency(total)}</span>
                         </div>
                         
                         {/* Payment Section */}
                         <div className="border-t pt-4 space-y-3">
                           <div className="flex gap-2">
                             <Input
                               placeholder="Payment amount"
                               value={paymentAmount}
                               onChange={(e) => handlePaymentAmountChange(e.target.value)}
                               className="flex-1"
                             />
                             <Button onClick={handlePayment} variant="outline" size="sm">
                               Add Payment
                             </Button>
                           </div>
                           
                           {total > 0 && (
                             <div className="space-y-2">
                               <div className="flex justify-between text-sm">
                                 <span>Your Balance:</span>
                                 <span className="font-medium">{formatCurrency(brokerBalance)}</span>
                               </div>
                               <div className="flex justify-between text-sm">
                                 <span>Remaining Balance:</span>
                                 <span className={`font-medium ${brokerBalance >= total ? 'text-green-600' : 'text-red-600'}`}>
                                   {formatCurrency(Math.max(0, brokerBalance - total))}
                                 </span>
                               </div>
                               <Button 
                                 onClick={() => handleDeductFromBalance(total)}
                                 variant="secondary" 
                                 size="sm" 
                                 className="w-full"
                                 disabled={brokerBalance < total}
                               >
                                 {brokerBalance >= total ? 'Pay from Balance' : 'Insufficient Balance'}
                               </Button>
                             </div>
                           )}
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
                               {product.name} - KES {product.price.toLocaleString()}/m²
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
                           <span>{formatCurrency(total)}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Amount Paid:</span>
                           <span>{formatCurrency(parseFloat(orderForm.amount))}</span>
                         </div>
                         <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                           <span>Balance:</span>
                           <span>{formatCurrency(Math.max(0, total - parseFloat(orderForm.amount)))}</span>
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
                               {product.name} - KES {product.price.toLocaleString()}/m²
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