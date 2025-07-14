import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/components/SupabaseAuthProvider';
import { AuthForm } from '@/components/AuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  // Redirect authenticated users to home dashboard
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to ApplyFirst</h1>
            <p className="text-white/80">Your AI-powered job application assistant</p>
          </div>
          
          <AuthForm />
          
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">Join thousands of job seekers using AI to land their dream job</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
