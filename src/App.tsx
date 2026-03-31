import { lazy, Suspense, useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCredits } from '@/lib/credits';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CreditModal from '@/components/CreditModal';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const AppContent = () => {
  const [credits, setCredits] = useState(getCredits());
  const [showCreditModal, setShowCreditModal] = useState(false);
  const refreshCredits = useCallback(() => setCredits(getCredits()), []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar credits={credits} onOpenCredits={() => setShowCreditModal(true)} />
      <div className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
          <Routes>
            <Route path="/" element={<HomePage onOpenCredits={() => setShowCreditModal(true)} />} />
            <Route path="/:slug" element={<CategoryPage credits={credits} refreshCredits={refreshCredits} showCreditModal={showCreditModal} setShowCreditModal={setShowCreditModal} />} />
            <Route path="/guide/:slug" element={<GuidePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/om-oss" element={<AboutPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <CreditModal open={showCreditModal} onClose={() => setShowCreditModal(false)} onPurchase={refreshCredits} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
