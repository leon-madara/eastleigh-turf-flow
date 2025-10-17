import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import PendingApprovalBanner from "@/components/PendingApprovalBanner";
import Home from "./pages/Home";
import Products from "./pages/Products";
import OurWork from "./pages/OurWork";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DashboardRoute from "@/pages/DashboardRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import AdminPage from "@/pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="eastleigh-turf-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          {/* Pending approval banner (global) */}
          {/* Rendered inside provider so it can read auth state */}
          <PendingApprovalBannerWrapper />
          <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/our-work" element={<OurWork />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRoute /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

// Local wrapper component to use hook without changing file structure
import React from 'react'
import { useAuth } from '@/components/AuthProvider'
const PendingApprovalBannerWrapper = () => {
  const { pendingApproval, user, loading } = useAuth()
  const [dismissed, setDismissed] = React.useState<boolean>(() => {
    try { return sessionStorage.getItem('hide_pending_banner') === '1' } catch { return false }
  })
  if (loading) return null
  if (user || !pendingApproval || dismissed) return null
  return <PendingApprovalBanner onDismiss={() => { try { sessionStorage.setItem('hide_pending_banner','1') } catch {} setDismissed(true) }} />
}
