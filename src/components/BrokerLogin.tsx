import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrokerLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const BrokerLogin = ({ isOpen, onClose, onLogin }: BrokerLoginProps) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      if (credentials.username === 'BROKER' && credentials.password === '123') {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to broker dashboard.",
        });
        onLogin();
        onClose();
        setCredentials({ username: '', password: '' });
      } else {
        setError('Invalid credentials. Use username: BROKER, password: 123');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setCredentials({ username: '', password: '' });
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden broker-login-modal">
        <div className="broker-login-header">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5" />
              <span>Broker Login</span>
            </DialogTitle>
          </DialogHeader>
        </div>

        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
                <p><strong>Demo Credentials:</strong></p>
                <p>Username: BROKER</p>
                <p>Password: 123</p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !credentials.username || !credentials.password}
                  className="flex-1"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BrokerLogin;