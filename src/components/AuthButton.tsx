import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const AuthButton = () => {
  return <div className="flex items-center gap-4">
    <SignedOut>
      <SignInButton mode="modal" forceRedirectUrl="/home">
        <Button variant="outline" className="border-blue-400/30 bg-blue-500/20 text-blue-600">Login</Button>
      </SignInButton>
    </SignedOut>
      <SignedIn>
        <UserButton appearance={{
        elements: {
          avatarBox: "w-10 h-10"
        }
      }} />
      </SignedIn>
    </div>;
};
export default AuthButton;