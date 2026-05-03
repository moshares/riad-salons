import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { lazy, Suspense } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { QuoteSimulator } from "@/components/sections/QuoteSimulator";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

const AdminPage = lazy(() => import("@/pages/admin/index"));

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Gallery />
        <About />
        <Testimonials />
        <QuoteSimulator />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-stone-950">
            <div className="w-8 h-8 rounded-full border-4 border-amber-700 border-t-transparent animate-spin" />
          </div>
        }>
          <AdminPage />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
