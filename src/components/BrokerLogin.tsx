import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { requestPhoneOtp, confirmOtp, auth } from '@/lib/firebaseClient';
import { apiJson } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/components/AuthProvider';

interface BrokerLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void; // optional now; AuthProvider manages state
}

const BrokerLogin = ({ isOpen, onClose, onLogin }: BrokerLoginProps) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'done'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);
  const { toast } = useToast();
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const e164Phone = useMemo(() => normalizeKenyaPhoneToE164(phone), [phone]);

  function normalizeKenyaPhoneToE164(input: string) {
    let p = input.replace(/\s|-/g, '');
    if (p.startsWith('+')) return p; // assume already E.164
    if (p.startsWith('0')) return `+254${p.slice(1)}`;
    if (p.startsWith('254')) return `+${p}`;
    return p;
  }

  const validPhone = useMemo(() => {
    const digits = e164Phone.replace(/\D/g, '');
    return /^2547\d{8}$/.test(digits); // Kenyan mobile starting with 7x
  }, [e164Phone]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Ensure reCAPTCHA container exists
      const el = document.getElementById('recaptcha-container');
      if (!el) {
        const div = document.createElement('div');
        div.id = 'recaptcha-container';
        div.style.position = 'fixed';
        div.style.bottom = '0';
        div.style.right = '0';
        div.style.opacity = '0';
        document.body.appendChild(div);
      }
      const result = await requestPhoneOtp(e164Phone);
      setConfirmation(result);
      setStep('otp');
      toast({ title: 'Code sent', description: `SMS code sent to ${e164Phone}` });
    } catch (err: any) {
      setError(err?.message || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmation) return;
    setIsLoading(true);
    setError('');
    try {
      const cred = await confirmOtp(confirmation, otp);
      const idToken = await cred.user.getIdToken();
      const res = await apiJson<{ user: { status?: 'PENDING' | 'ACTIVE' | 'BLOCKED' } }>('/api/auth/sessionLogin', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      });
      // Clear Firebase client state to rely on backend session only
      await auth.signOut();
      // Refresh to set user or pending flag
      await refresh();
      // Only allow dashboard for ACTIVE users
      if (res?.user?.status === 'ACTIVE') {
        setStep('done');
        toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
        onLogin?.();
        onClose();
        navigate('/dashboard');
      } else {
        toast({ title: 'Pending Approval', description: 'Your account is awaiting admin approval.' });
      }
      setPhone('');
      setOtp('');
      setConfirmation(null);
    } catch (err: any) {
      setError(err?.message || 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPhone('');
    setOtp('');
    setError('');
    setConfirmation(null);
    setStep('phone');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden broker-login-modal">
        <div className="broker-login-header">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center space-x-2 text-white">
              <Phone className="w-5 h-5" />
              <span>Broker Login</span>
            </DialogTitle>
          </DialogHeader>
        </div>

        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            {step === 'phone' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 07xx xxx xxx"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Kenyan mobile numbers are supported.</p>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
                  <Button type="submit" disabled={isLoading || !validPhone} className="flex-1">
                    {isLoading ? 'Sending...' : 'Send Code'}
                  </Button>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter Code</Label>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[0,1,2,3,4,5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-xs text-muted-foreground">We sent an SMS code to {e164Phone}</p>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={() => setStep('phone')} className="flex-1">Back</Button>
                  <Button type="submit" disabled={isLoading || otp.length !== 6} className="flex-1">
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </form>
            )}

            {step === 'done' && (
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Logged in</span>
                </div>
                <Button onClick={handleClose} className="w-full">Close</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invisible reCAPTCHA host */}
        <div id="recaptcha-container" />
      </DialogContent>
    </Dialog>
  );
};

export default BrokerLogin;
