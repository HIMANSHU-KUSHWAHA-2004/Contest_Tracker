import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Calendar from "./pages/Calendar/Calendar";
import Sidebar from "./pages/Sidebar/Sidebar";
import Footer from "./pages/Footer/Footer";
import AboutUs from "./pages/AboutUs/AboutUs";

// ✅ Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }}>
          <h2>Something went wrong!</h2>
          <p>Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ✅ Loading Component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "null" && token !== "";
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// ✅ App Wrapper Component
const AppWrapper = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const hideSidebarOn = ["/", "/register"];
  const isHidden = hideSidebarOn.includes(location.pathname);

  // ✅ Better authentication check with loading state
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const authStatus = token && token !== "undefined" && token !== "null" && token !== "";
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure localStorage is properly loaded
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // ✅ Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* ✅ Show sidebar and footer only on authenticated pages */}
      {!isHidden && isAuthenticated && <Sidebar />}
      
      <main style={{ minHeight: !isHidden ? 'calc(100vh - 120px)' : '100vh' }}>
        <Routes>
          {/* ✅ Public Routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
            } 
          />
          
          {/* ✅ Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutUs />
              </ProtectedRoute>
            }
          />
          
          {/* ✅ 404 Route */}
          <Route 
            path="*" 
            element={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
                flexDirection: 'column'
              }}>
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Go Home
                </button>
              </div>
            } 
          />
        </Routes>
      </main>
      
      {/* ✅ Footer only on authenticated pages */}
      {!isHidden && isAuthenticated && <Footer />}
    </>
  );
};

// ✅ Main App Component
const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppWrapper />
      </Router>
    </ErrorBoundary>
  );
};

export default App;