import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import UserProfileSync from "./components/UserProfileSync";
import { SupabaseAuthProvider } from "./components/SupabaseAuthProvider";
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

// Simplified navigation - remove the redirect loops that cause infinite recursion
const NavigationController = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* <UserProfileSync /> */}
        <BrowserRouter>
          <SupabaseAuthProvider>
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
          </SupabaseAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
