import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const Auth = () => {
  const navigate = useNavigate();

  // Redirect authenticated users to home dashboard
  useEffect(() => {
    const checkAuth = () => {
      // This will be handled by Clerk's built-in redirect logic
    };
    checkAuth();
  }, [navigate]);
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <SignedOut>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to ApplyFirst</h1>
              <p className="text-slate-300">Sign in to start landing more interviews</p>
            </div>
            
            <div className="space-y-4">
              <SignInButton mode="modal" forceRedirectUrl="/home">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold">
                  Sign In
                </Button>
              </SignInButton>
              
              <SignUpButton mode="modal" forceRedirectUrl="/home" className="text-blue-600">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-3 text-lg font-semibold">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Welcome back!</h1>
            <p className="text-slate-300 mb-6">You're successfully signed in.</p>
            <UserButton appearance={{
            elements: {
              avatarBox: "w-12 h-12"
            }
          }} />
            <div className="mt-6">
              <Button onClick={() => navigate('/home')} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>;
};
export default Auth;