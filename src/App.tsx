import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { TextEditorProvider, useTextEditor } from '@/context/TextEditorContext';
import { supabase } from '@/integrations/supabase/client';

const HomePage = lazy(() => import('./pages/HomePage'));
const ArendenPage = lazy(() => import('./pages/ArendenPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const GuidesOverviewPage = lazy(() => import('./pages/GuidesOverviewPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const AdminToolbar = () => {
  const { isAdmin } = useTextEditor();
  if (!isAdmin) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#1B4F8A',
      color: 'white',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 13,
      fontWeight: 500,
    }}>
      <span>Adminläge aktivt — klicka på pennikonen för att redigera valfri text</span>
      <button
        onClick={async () => { await supabase.auth.signOut(); }}
        style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: 13 }}
      >
        Logga ut
      </button>
    </div>
  );
};

const AppContent = () => {
  const { isAdmin } = useTextEditor();
  return (
    <div className="min-h-screen bg-background flex flex-col" style={isAdmin ? { paddingTop: 40 } : undefined}>
      <AdminToolbar />
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/:slug" element={<CategoryPage />} />
            <Route path="/guide/:slug" element={<GuidePage />} />
            <Route path="/guider" element={<GuidesOverviewPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/priser" element={<PricingPage />} />
            <Route path="/om-oss" element={<AboutPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
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
          <ScrollToTop />
          <TextEditorProvider>
            <AppContent />
          </TextEditorProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
