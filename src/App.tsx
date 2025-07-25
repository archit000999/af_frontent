import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";
import Index from "./pages/Index";
import Home from "./pages/Home";

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

const queryClient = new QueryClient();

// Navigation controller to prevent redirect loops
const NavigationController = ({ children }: { children: React.ReactNode }) => {

  const navigate = useNavigate();
  const location = useLocation();
  return <>{children}</>;
};

// Main App routes component
const AppRoutes = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Routes>
      <Route path="/" element={<Index />} />
      {/* <Route path="/auth" element={<Auth />} /> */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/how-copilot-works" element={<HowCopilotWorks />} />
      <Route path="/how-to-train-copilot" element={<HowToTrainCopilot />} />
      <Route path="/how-to-apply-external" element={<HowToApplyExternal />} />
      <Route path="/faq" element={<FAQ />} />
      
      {/* Protected Routes - Require Authentication */}
      <Route path="/home" element={<Home />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/support" element={<Support />} />
      <Route path="/copilot-setup" element={<CopilotSetup />} />
      <Route path="/copilot-filters" element={<CopilotFilters />} />
      <Route path="/copilot-screening" element={<CopilotScreening />} />
      <Route path="/copilot-final-step" element={<CopilotFinalStep />} />
      <Route path="/copilot-preview" element={<CopilotPreview />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavigationController>
            <AppRoutes />
          </NavigationController>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
