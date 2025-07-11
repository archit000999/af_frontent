import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  buttonText?: string;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ 
  isOpen, 
  onClose, 
  message = "Upgrade plan to activate ApplyFirst Concierge service",
  buttonText = "Upgrade"
}) => {
  

  const handleViewPlans = () => {
    window.open('https://buy.stripe.com/aFa9AT3id2hkbsxatW8ww02', '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {message}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleViewPlans}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-medium"
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
