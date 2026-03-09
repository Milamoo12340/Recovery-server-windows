import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import { Dashboard } from "@/pages/dashboard";
import { ItemDetail } from "@/pages/item-detail";
import { ChatPage } from "@/pages/chat-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/item/:id" component={ItemDetail} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/chat/:id" component={ChatPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
