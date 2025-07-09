import React from "react";
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

const AppWrapper = () => {
  const location = useLocation();
  const hideSidebarOn = ["/", "/register"]; 
  const isHidden = hideSidebarOn.includes(location.pathname);

  const token = localStorage.getItem("token");
  const isAuthenticated = token !== null && token !== undefined && token !== '';

  console.log("Current path:", location.pathname);
  console.log("Token:", token);
  console.log("Is authenticated:", isAuthenticated);

  return (
    <>
      {!isHidden && isAuthenticated && <Sidebar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/calendar"
          element={isAuthenticated ? <Calendar /> : <Navigate to="/" replace />}
        />
        <Route
          path="/about"
          element={isAuthenticated ? <AboutUs /> : <Navigate to="/" replace />}
        />
        {/* Catch-all route for debugging */}
        <Route path="*" element={<div>404 - Page not found</div>} />
      </Routes>

      {!isHidden && <Footer />}
    </>
  );
};

// 🚀 Main App
const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;