
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/MainSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Members from "./pages/Members";
import Items from "./pages/Items";
import Borrow from "./pages/Borrow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <MainSidebar />
            <main className="flex-1 p-4">
              <SidebarTrigger className="mb-4" />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/members" element={<Members />} />
                <Route path="/items" element={<Items />} />
                <Route path="/borrow" element={<Borrow />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
