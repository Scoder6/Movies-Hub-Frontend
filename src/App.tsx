import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import Home from "./pages/Home"
import MovieDetails from "./pages/MovieDetails"
import RecommendMovie from "./pages/RecommendMovie"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Admin from "./pages/Admin"
import NotFound from "./pages/NotFound"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route 
                  path="/suggest" 
                  element={
                    <ProtectedRoute>
                      <RecommendMovie />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/auth/login" 
                  element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
                />
                <Route 
                  path="/auth/signup" 
                  element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App
