import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import CartSheet from "./components/CartSheet";
import { Loader2 } from "lucide-react";

// Lazy-load non-home routes — slashes initial bundle size
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Supplier = lazy(() => import("./pages/Supplier"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Invoice = lazy(() => import("./pages/Invoice"));
const Receipt = lazy(() => import("./pages/Receipt"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <CartSheet />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/invoice/:orderNumber" element={<Invoice />} />
              <Route path="/receipt/:orderNumber" element={<Receipt />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
