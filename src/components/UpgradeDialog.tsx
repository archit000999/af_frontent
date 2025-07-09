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
  message = "You need a Premium or Elite plan to activate Copilot",
  buttonText = "View Plans ↗"
}) => {
  const navigate = useNavigate();

  const handleViewPlans = () => {
    navigate('/payment');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
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
