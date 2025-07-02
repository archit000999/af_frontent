import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplicationForm = ({ open, onOpenChange }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    linkedinUrl: "",
    isInUS: "",
    careerTrack: "",
    isCurrentlyEmployed: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          linkedin_url: formData.linkedinUrl,
          is_in_us: formData.isInUS,
          career_track: formData.careerTrack,
          is_currently_employed: formData.isCurrentlyEmployed,
        });

      if (error) {
        toast.error("Failed to submit application. Please try again.");
        console.error("Error submitting application:", error);
      } else {
        toast.success("Application submitted successfully!");
        onOpenChange(false);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          linkedinUrl: "",
          isInUS: "",
          careerTrack: "",
          isCurrentlyEmployed: "",
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-foreground">
            Application Form
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            It will only take a couple of minutes to fill out this form!
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email<span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mb-1">
              (Kindly utilize your personal email address instead of your university or workplace email when filling out the Application)
            </p>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number<span className="text-destructive">*</span>
            </Label>
            <Input
              id="phoneNumber"
              placeholder="+1 (xxx)-xxx-xxxx"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="linkedinUrl" className="text-sm font-medium">
              LinkedIn URL<span className="text-destructive">*</span>
            </Label>
            <Input
              id="linkedinUrl"
              placeholder="www.linkedin.com/in/xxxxxxxxx/"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              Are you currently physically present in the US?<span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.isInUS}
              onValueChange={(value) => setFormData({ ...formData, isInUS: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="us-yes" />
                <Label htmlFor="us-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="us-no" />
                <Label htmlFor="us-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium">
              Choose a career track<span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.careerTrack}
              onValueChange={(value) => setFormData({ ...formData, careerTrack: value })}
              className="mt-2 grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="software-engineering" id="software-engineering" />
                <Label htmlFor="software-engineering">Software Engineering</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="product-management" id="product-management" />
                <Label htmlFor="product-management">Product Management</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="data-science" id="data-science" />
                <Label htmlFor="data-science">Data Science</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="salesforce-consultant" id="salesforce-consultant" />
                <Label htmlFor="salesforce-consultant">Salesforce Consultant</Label>
              </div>
              <div className="flex items-center space-x-2 col-span-2">
                <RadioGroupItem value="sales-marketing-support" id="sales-marketing-support" />
                <Label htmlFor="sales-marketing-support">Sales, Marketing, Customer Support</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium">
              Are you currently employed?<span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.isCurrentlyEmployed}
              onValueChange={(value) => setFormData({ ...formData, isCurrentlyEmployed: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="employed-yes" />
                <Label htmlFor="employed-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="employed-no" />
                <Label htmlFor="employed-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;