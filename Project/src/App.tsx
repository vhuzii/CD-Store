import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CatalogPage from "@/pages/CatalogPage";
import AuthPage from "@/pages/AuthPage";
import CartPage from "@/pages/CartPage";
import SellPage from "@/pages/SellPage";
import SellerPage from "@/pages/SellerPage";
import MessagesPage from "@/pages/MessagesPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CDDetailPage from "@/pages/CDDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cd/:cdId" element={<CDDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/seller/:sellerId" element={<SellerPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
