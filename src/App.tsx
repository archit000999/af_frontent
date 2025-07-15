import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import UserProfileSync from "./components/UserProfileSync";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";
import { useSupabaseAuth } from "./components/SupabaseAuthProvider";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Applications from "./pages/Applications";
import Support from "./pages/Support";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import HowCopilotWorks from "./pages/HowCopilotWorks";
import HowToTrainCopilot from "./pages/HowToTrainCopilot";
import HowToApplyExternal from "./pages/HowToApplyExternal";
import FAQ from "./pages/FAQ";
import CopilotSetup from "./components/CopilotSetup";
import CopilotFilters from "./components/CopilotFilters";
import CopilotScreening from "./components/CopilotScreening";
import CopilotFinalStep from "./components/CopilotFinalStep";
import CopilotPreview from "./components/CopilotPreview";
import Payment from "./components/Payment";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Navigation controller to prevent redirect loops
const NavigationController = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run navigation logic when loading is complete
    if (loading) return;

    const currentPath = location.pathname;
    const isPublicRoute = ['/', '/auth', '/privacy-policy', '/terms-of-service', '/how-copilot-works', '/how-to-train-copilot', '/how-to-apply-external', '/faq'].includes(currentPath);
    
    // If user is authenticated and on a public route, redirect to home
    if (user && (currentPath === '/' || currentPath === '/auth')) {
      console.log('Authenticated user on public route, redirecting to /home');
      navigate('/home', { replace: true });
      return;
    }

    // If user is not authenticated and on a protected route, redirect to home
    if (!user && !isPublicRoute) {
      console.log('Unauthenticated user on protected route, redirecting to /');
      navigate('/', { replace: true });
      return;
    }
  }, [user, loading, location.pathname, navigate]);

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProfileSync />
        <BrowserRouter>
          <NavigationController>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/how-copilot-works" element={<HowCopilotWorks />} />
                <Route path="/how-to-train-copilot" element={<HowToTrainCopilot />} />
                <Route path="/how-to-apply-external" element={<HowToApplyExternal />} />
                <Route path="/faq" element={<FAQ />} />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="/copilot-setup" element={<ProtectedRoute><CopilotSetup /></ProtectedRoute>} />
                <Route path="/copilot-filters" element={<ProtectedRoute><CopilotFilters /></ProtectedRoute>} />
                <Route path="/copilot-screening" element={<ProtectedRoute><CopilotScreening /></ProtectedRoute>} />
                <Route path="/copilot-final-step" element={<ProtectedRoute><CopilotFinalStep /></ProtectedRoute>} />
                <Route path="/copilot-preview" element={<ProtectedRoute><CopilotPreview /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </NavigationController>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
