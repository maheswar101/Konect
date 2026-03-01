import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Welcome from "./pages/Welcome";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Notifications from "./pages/Notifications";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

// Component to handle home route based on auth status
const HomeRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Index /> : <Welcome />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
              <Route path="/communities" element={<ProtectedRoute><Communities /></ProtectedRoute>} />
              <Route path="/community/:id" element={<ProtectedRoute><CommunityDetail /></ProtectedRoute>} />
              <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
