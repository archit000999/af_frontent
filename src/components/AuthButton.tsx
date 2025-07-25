import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from './AuthForm';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, User, Settings, User2Icon } from 'lucide-react';

interface AuthButtonProps {
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ className }) => {
  const { user, logout, isLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSignOut = async () => {
    logout();
    window.location.href = "/"; // Redirect to home after sign out
  };

  if (isLoading) {
    return (
      <Button variant="ghost" disabled className={className}>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`relative h-8 w-8 rounded-full ${className || ''}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={''} alt={user.email || ''} />
              <AvatarFallback>
                {user.profile?.firstName && user.profile?.lastName
                  ? `${user.profile.firstName.charAt(0)}${user.profile.lastName.charAt(0)}`.toUpperCase()
                  : user.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.email && (
                <p className="text-sm flex font-medium leading-none p-2">
                 
                  {user.email}</p>
              )}
              <p className="text-xs leading-none text-muted-foreground">
                {user.profile?.firstName && user.profile?.lastName 
                  ? `${user.profile.firstName} ${user.profile.lastName}` 
                  : user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogTrigger asChild>
        <Button className={`border-blue-300 hover:bg-blue-400 bg-blue-500 hover:text-white text-white ${className || ''}`}>
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>
        <AuthForm onSuccess={() => setShowAuthDialog(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AuthButton;