import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AuthButton = () => {
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <Link to="/auth">
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
            Sign In
          </Button>
        </Link>
        <Link to="/auth">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
            Sign Up
          </Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            }
          }}
        />
      </SignedIn>
    </div>
  );
};

export default AuthButton;