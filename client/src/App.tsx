import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useEffect } from "react";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import useAuthStore from "@/store/useAuthStore";
import Dashboard from "./pages/Dashboard";

// Create a type for protected route props
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  // Protected route component
  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirect to landing for any undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;