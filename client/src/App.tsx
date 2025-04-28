import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('userId') !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/auth" />;
    }
    return children;
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
            <div>Dashboard Page (To be implemented)</div>
          </ProtectedRoute>
        } />
        
        {/* Redirect to landing for any undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;