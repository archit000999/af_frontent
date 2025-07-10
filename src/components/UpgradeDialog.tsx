import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  buttonText?: string;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ 
  isOpen, 
  onClose, 
  message = "You need a Premium or Elite plan to activate ApplyFirst",
  buttonText = "Upgrade to Elite"
}) => {
  const navigate = useNavigate();

  const handleViewPlans = () => {
    window.open('https://buy.stripe.com/4gMaEX8Cxg8afIN59C8ww00', '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute p-1 right-0 top-0 rounded-sm opacity-70 
           
            ">
            
          </button>
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
