import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  Send,
  DollarSign,
  TrendingUp,
  Package,
  User,
  LogOut,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { PreOrderForm } from './PreOrderForm';
import { PreOrderList } from './PreOrderList';
import { InquiryForm } from './InquiryForm';
import { InquiryList } from './InquiryList';
import { Inquiry, InquiryFormData, InquiryStatus } from '@/types';

interface OrderItem {
  id: string;
  product: string;
  squareMeters: number;
  pricePerM2: number;
  discount: number;
  subtotal: number;
  total: number;
}

interface BrokerDashboardProps {
  onLogout: () => void;
}

const BrokerDashboard = ({ onLogout }: BrokerDashboardProps) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [squareMeters, setSquareMeters] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderItem | null>(null);
  const [preOrders, setPreOrders] = useState([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const products = useMemo(() => ([
    { id: 'commercial-pro-25mm', name: 'Commercial Pro 25mm', price: 1100, description: 'KES 1,100/m²' },
    { id: 'enduraturf', name: 'EnduraTurf', price: 950, description: 'KES 950/m²' },
    { id: 'flexturf', name: 'FlexTurf', price: 1200, description: 'KES 1,200/m²' },
    { id: 'professional-grade', name: 'Professional Grade', price: 1350, description: 'KES 1,350/m²' },
    { id: 'profitgrass', name: 'ProfitGrass', price: 1050, description: 'KES 1,050/m²' },
    { id: 'ultraturf', name: 'UltraTurf', price: 1400, description: 'KES 1,400/m²' },
    { id: 'velvetgreen', name: 'VelvetGreen', price: 1150, description: 'KES 1,150/m²' }
  ]), []);

  const discounts = [
    { name: 'No Discount', value: 0 },
    { name: '5% Off', value: 5 },
    { name: '10% Off', value: 10 },
    { name: '15% Off', value: 15 },
    { name: '20% Off', value: 20 }
  ];

  // Calculate totals based on current order
  const calculateOrder = () => {
    if (!selectedProduct || !squareMeters) return null;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return null;

    const subtotal = product.price * parseFloat(squareMeters);
    const discountAmount = subtotal * (parseFloat(selectedDiscount) / 100);
    const total = subtotal - discountAmount;

    return {
      id: `ORD-${Date.now()}`,
      product: selectedProduct,
      squareMeters: parseFloat(squareMeters),
      pricePerM2: product.price,
      discount: parseFloat(selectedDiscount),
      subtotal,
      total
    };
  };

  // Update current order when inputs change
  useEffect(() => {
    const order = calculateOrder();
    setCurrentOrder(order);
  }, [selectedProduct, squareMeters, selectedDiscount]);

  // Calculate balance overview
  const amountPaid = parseFloat(paymentAmount) || 0;
  const totalOrdersValue = orders.reduce((sum, order) => sum + order.total, 0) + (currentOrder?.total || 0);
  const currentDeficit = totalOrdersValue - amountPaid;
  const hasInsufficientFunds = currentDeficit > 0;

  const handleCreateOrder = () => {
    if (!currentOrder) return;

    setOrders(prev => [...prev, currentOrder]);
    setSelectedProduct('');
    setSquareMeters('');
    setSelectedDiscount('');
    setCurrentOrder(null);
  };

  const handleResetOrder = () => {
    setSelectedProduct('');
    setSquareMeters('');
    setSelectedDiscount('');
    setPaymentAmount('');
    setCurrentOrder(null);
    setOrders([]); // Clear all orders
  };

  const handleSetPayment = () => {
    // This would typically update the broker's payment in the backend
    console.log('Payment amount set:', paymentAmount);
  };

  const handleMPESAPayment = () => {
    // This would integrate with MPESA STK Push
    console.log('Processing MPESA payment for:', paymentAmount);
  };

  const handleSendWhatsApp = async (type: 'ORDER' | 'PAYMENT' | 'STATUS', data: any) => {
    try {
      let message = '';
      switch (type) {
        case 'ORDER':
          message = generateOrderMessage(orders, totalOrdersValue);
          break;
        case 'PAYMENT':
          message = generatePaymentReminder(data.clientName, data.amount, data.dueDate);
          break;
        case 'STATUS':
          message = generateStatusUpdate(data.clientName, data.status, data.orderDetails);
          break;
      }

      await sendWhatsAppMessage(data.phone, message);
      toast({
        title: "Message Sent",
        description: "WhatsApp notification sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send WhatsApp message",
        variant: "destructive",
      });
    }
  };

  const handlePreOrderSubmit = async (data: any) => {
    try {
      // TODO: Implement API call
      // const response = await fetch('/api/preorders/create', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });

      toast({
        title: "Pre-order created",
        description: "The pre-order has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create pre-order.",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      // TODO: Implement API call
      // const response = await fetch('/api/preorders/${id}/status', {
      //   method: 'PUT',
      //   body: JSON.stringify({ status }),
      // });

      toast({
        title: "Status updated",
        description: "Pre-order status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleInquirySubmit = async (data: InquiryFormData) => {
    try {
      // TODO: Implement API call
      const newInquiry: Inquiry = {
        id: `INQ-${Date.now()}`,
        brokerId: 'current-broker-id',
        productName: products.find(p => p.id === data.productId)?.name || '',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
      };

      setInquiries(prev => [...prev, newInquiry]);
      toast({
        title: "Inquiry Submitted",
        description: "Your inquiry has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry",
        variant: "destructive",
      });
    }
  };

  const handleInquiryStatusUpdate = async (id: string, status: InquiryStatus) => {
    try {
      setInquiries(prev =>
        prev.map(inquiry =>
          inquiry.id === id
            ? { ...inquiry, status, updatedAt: new Date() }
            : inquiry
        )
      );
      toast({
        title: "Status Updated",
        description: "Inquiry status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (ids: string[], action: 'approve' | 'reject' | 'combine') => {
    try {
      if (action === 'combine') {
        const selectedPreOrders = preOrders.filter(order => ids.includes(order.id));
        const totalAmount = selectedPreOrders.reduce((sum, order) => sum + order.remainingBalance, 0);
        const bulkDiscount = selectedPreOrders.length >= 3 ? 10 : 5; // Additional bulk discount

        // TODO: Implement API call for bulk order creation
        toast({
          title: "Bulk Order Created",
          description: `Combined ${ids.length} orders with ${bulkDiscount}% additional discount`,
        });
      } else {
        // Handle approve/reject
        const newStatus = action === 'approve' ? 'DEPOSIT_RECEIVED' : 'CANCELLED';
        // TODO: Implement bulk status update API call
        toast({
          title: `Orders ${action}ed`,
          description: `Successfully ${action}ed ${ids.length} orders`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} orders`,
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Broker Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your orders and payments</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Balance Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Balance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Amount Paid</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(amountPaid)}
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">Current Deficit</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {hasInsufficientFunds ? '-' : ''}{formatCurrency(Math.abs(currentDeficit))}
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Orders</span>
                </div>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-200">{orders.length}</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Month</span>
                </div>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-200">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MPESA Payment Button */}
        <div className="mb-8 text-center">
          <Button
            onClick={handleMPESAPayment}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            disabled={!paymentAmount}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Balance with MPESA
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Requires Supabase backend integration for STK Push
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="preorders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Pre-orders
            </TabsTrigger>
            <TabsTrigger value="inquiry" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Inquiry
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create Order Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Create Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="squareMeters">Square Meters</Label>
                    <Input
                      id="squareMeters"
                      type="number"
                      placeholder="Enter square meters"
                      value={squareMeters}
                      onChange={(e) => setSquareMeters(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount</Label>
                    <Select value={selectedDiscount} onValueChange={setSelectedDiscount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount" />
                      </SelectTrigger>
                      <SelectContent>
                        {discounts.map((discount) => (
                          <SelectItem key={discount.name} value={discount.value.toString()}>
                            {discount.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentOrder && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(currentOrder.subtotal)}</span>
                      </div>
                      {currentOrder.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({currentOrder.discount}%):</span>
                          <span>-{formatCurrency((currentOrder.subtotal * currentOrder.discount) / 100)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-green-600">{formatCurrency(currentOrder.total)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleCreateOrder}
                      className="flex-1"
                      disabled={!currentOrder}
                    >
                      Create Order
                    </Button>
                    <Button
                      onClick={handleResetOrder}
                      variant="destructive"
                      className="bg-red-400 hover:bg-red-500 text-white"
                      disabled={!currentOrder && orders.length === 0}
                    >
                      Reset Order
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentOrder && (
                    <>
                      <div className="space-y-2">
                        <Label>Order ID</Label>
                        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-700 dark:text-gray-300 p-2 rounded">
                          {currentOrder.id}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Date</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Payment ID</Label>
                        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-700 dark:text-gray-300 p-2 rounded">
                          PAY-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Subtotal</Label>
                        <div className="text-lg font-semibold">
                          {formatCurrency(currentOrder.subtotal)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Total</Label>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(currentOrder.total)}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="paymentAmount">Enter payment amount</Label>
                    <div className="flex gap-2">
                      <Input
                        id="paymentAmount"
                        type="number"
                        placeholder="Enter amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                      <Button onClick={handleSetPayment} variant="outline">
                        Set Payment
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Amount Paid</Label>
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(amountPaid)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Deficit/Surplus</Label>
                    <div className={`text-lg font-semibold ${hasInsufficientFunds ? 'text-red-600' : 'text-green-600'
                      }`}>
                      {hasInsufficientFunds ? 'Deficit: ' : 'Surplus: '}
                      {formatCurrency(Math.abs(currentDeficit))}
                    </div>
                  </div>

                  {hasInsufficientFunds && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        Insufficient funds. Invoice will be sent with deficit amount.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Orders List */}
            {orders.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="dark:text-white">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">#{index + 1}</Badge>
                          <div>
                            <div className="font-medium dark:text-white">{order.product}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {order.squareMeters}m² • {formatCurrency(order.pricePerM2)}/m²
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(order.total)}</div>
                          {order.discount > 0 && (
                            <div className="text-sm text-green-600">
                              {order.discount}% off
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="preorders" className="mt-6">
            <Card className="p-6">
              <div className="space-y-8">
                <PreOrderForm
                  products={products}
                  onSubmit={handlePreOrderSubmit}
                />
                <PreOrderList
                  preOrders={preOrders}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="inquiry" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InquiryForm
                products={products}
                onSubmit={handleInquirySubmit}
              />
              {inquiries.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InquiryList
                      inquiries={inquiries}
                      onStatusUpdate={handleInquiryStatusUpdate}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="space-y-8">
              {/* Profile Basics */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Phone</Label>
                      <Input id="whatsapp" placeholder="e.g. 07XXXXXXXX or +2547XXXXXXX" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="logo">Business Logo</Label>
                    <Input id="logo" type="file" accept="image/*" />
                  </div>

                  <div>
                    <Label>Service Regions</Label>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Nairobi', 'Mombasa', 'Nakuru', 'Eldoret', 'Kisumu', 'Thika'].map(r => (
                        <label key={r} className="flex items-center gap-2 text-sm">
                          <Checkbox />
                          <span>{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment (MPESA)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="mpesa">MPESA Payout Number</Label>
                  <Input id="mpesa" placeholder="e.g. 07XXXXXXXX or +2547XXXXXXX" />
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">WhatsApp Alerts</div>
                      <div className="text-sm text-muted-foreground">Notify on order status changes</div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Alerts</div>
                      <div className="text-sm text-muted-foreground">Backup notifications if WhatsApp fails</div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                    </div>
                    <Switch />
                  </div>

                  <div>
                    <div className="font-medium mb-2">Active Sessions</div>
                    <div className="rounded border p-3 text-sm text-muted-foreground">Device list placeholder</div>
                    <Button className="mt-3" variant="outline">Sign out all devices</Button>
                  </div>
                </CardContent>
              </Card>



              {/* Sales & Commission (read-only) */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales & Commission</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Commission Rate</div>
                    <div className="text-2xl font-bold">10%</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">This Month</div>
                    <div className="text-2xl font-bold">KES 0</div>
                  </div>
                  <div className="p-4 border rounded-lg md:col-span-1">
                    <div className="text-sm text-muted-foreground mb-2">Payout History</div>
                    <div className="text-sm text-muted-foreground">No payouts yet</div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Support</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a href="https://wa.me/254743375997" target="_blank" rel="noreferrer">Contact Admin</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="mailto:info@eastleighturfgrass.com">Email Support</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="#">FAQ</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Communication Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={() => handleSendWhatsApp('ORDER', { phone: '+254700000000' })}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            disabled={orders.length === 0}
          >
            <Send className="mr-2 h-5 w-5" />
            Send Order via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;