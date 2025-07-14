import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageCircle, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/components/SupabaseAuthProvider';
import AuthButton from '@/components/AuthButton';

const Support = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { isSubscribed } = useSubscription();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [stripeEmail, setStripeEmail] = useState('');

  const cancelReasons = [
    { value: 'too-expensive', label: 'Too expensive' },
    { value: 'not-finding-jobs', label: 'Not finding relevant jobs' },
    { value: 'found-job', label: 'Already found a job' },
    { value: 'technical-issues', label: 'Technical issues' },
    { value: 'switching-service', label: 'Switching to another service' },
    { value: 'other', label: 'Other reason' }
  ];

  const handleCancelSubscription = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not found. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedReason) {
      toast({
        title: "Missing Information",
        description: "Please select a reason for cancellation.",
        variant: "destructive"
      });
      return;
    }

    if (!stripeEmail.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please provide the email address used in Stripe.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Save cancellation request to Supabase
      const { error } = await supabase
        .from('cancellation_requests' as any)
        .insert([
          {
            user_id: user.id,
            user_email: user.email,
            stripe_email: stripeEmail.trim(),
            reason: selectedReason,
            additional_feedback: additionalFeedback.trim() || null
          }
        ]);

      if (error) {
        console.error('Error saving cancellation request:', error);
        toast({
          title: "Error",
          description: "Failed to submit cancellation request. Please try again or contact support directly.",
          variant: "destructive"
        });
        return;
      }

      // Success
      toast({
        title: "Cancellation Request Submitted",
        description: "We've received your cancellation request. Our team will process it within 24 hours and send you a confirmation email.",
      });

      // Close dialog and reset form
      setIsCancelDialogOpen(false);
      setSelectedReason('');
      setAdditionalFeedback('');
      setStripeEmail('');

    } catch (error) {
      console.error('Error submitting cancellation:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScheduleCall = () => {
    // Replace with your actual Calendly link
    window.open('https://calendly.com/vaasu_bhartia/startup-chat', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header - Same as Home page */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div onClick={()=>navigate("/home")} className="flex items-center space-x-2 text-purple-600 font-medium text-base">
              <button>ApplyFirst</button>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-base" onClick={() => navigate('/applications')}>
              <div className="w-6 h-6 flex items-center justify-center">
              </div>
              <button>Applications</button>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-base" onClick={() => navigate('/support')}>
              <div className="w-6 h-6 flex items-center justify-center">
              </div>
              <button>Support</button>
            </div>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-lg text-gray-600">Choose the option that best describes what you need help with</p>
          
          {/* Temporary debug info */}
         
        </div>

        <div className={`grid gap-8 ${isSubscribed ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
          {/* Cancel Subscription Card - Only show for subscribed users */}
          {isSubscribed && (
            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer" onClick={() => setIsCancelDialogOpen(true)}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Cancel Subscription</CardTitle>
                <CardDescription className="text-gray-600">
                  Need to cancel your subscription? We'd love to know why to help us improve.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCancelDialogOpen(true);
                  }}
                >
                  Cancel Subscription
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact Support Card */}
          <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer" onClick={handleScheduleCall}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Schedule a Call</CardTitle>
              <CardDescription className="text-gray-600">
                Have questions or need help? Schedule a call with our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleScheduleCall();
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Call
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Still need help?</h3>
            <p className="text-gray-600 mb-6">
              Check out our guides and FAQ section, or reach out to us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/faq')}
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                View FAQ
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/home')}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Subscription Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Cancel Subscription
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-gray-600">
              We're sorry to see you go! Before you cancel, could you help us understand why?
            </p>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                What's the main reason for cancelling? *
              </Label>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                {cancelReasons.map((reason) => (
                  <div key={reason.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.value} id={reason.value} />
                    <Label htmlFor={reason.value} className="text-sm text-gray-600">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Email address used in Stripe for payment *
              </Label>
              <Input
                type="email"
                placeholder="Enter the email you used for Stripe payment"
                value={stripeEmail}
                onChange={(e) => setStripeEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                This helps us locate your subscription in our payment system.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Additional feedback (Optional)
              </Label>
              <Textarea
                placeholder="Tell us more about your experience..."
                value={additionalFeedback}
                onChange={(e) => setAdditionalFeedback(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={isProcessing || !selectedReason || !stripeEmail.trim()}
              >
                {isProcessing ? 'Processing...' : 'Submit Cancellation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;
