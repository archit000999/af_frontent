
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';

interface PrePaymentFormProps {
  onSuccess: (pendingPaymentId: string) => void;
}

const PrePaymentForm: React.FC<PrePaymentFormProps> = ({ onSuccess }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create a pending payment record
      const { data: paymentData, error } = await supabase
        .from('payments')
        .insert({
          user_email: formData.email,
          plan_type: 'concierge',
          plan_name: 'ApplyFirst Concierge Service',
          amount: 9900, // $99 in cents
          currency: 'usd',
          status: 'pending',
          stripe_session_id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating payment record:', error);
        throw error;
      }

      console.log('Created pending payment:', paymentData);
      
      toast({
        title: "Information Saved",
        description: "Redirecting to payment...",
      });

      // Pass the payment ID to parent component
      onSuccess(paymentData.id);
      
    } catch (error) {
      console.error('Error saving payment info:', error);
      toast({
        title: "Error",
        description: "Failed to save information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Information</CardTitle>
        <p className="text-sm text-gray-600">
          We'll save your information before redirecting to secure payment
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue to Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrePaymentForm;
