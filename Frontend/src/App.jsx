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

// 🔄 Wrapper component to show Sidebar and Footer conditionally
const AppWrapper = () => {
  const location = useLocation();
  const hideSidebarOn = ["/", "/register"]; // Pages without sidebar/footer
  const isHidden = hideSidebarOn.includes(location.pathname);

  const isAuthenticated = localStorage.getItem("token");

  return (
    <>
      {!isHidden && isAuthenticated && <Sidebar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/calendar"
          element={isAuthenticated ? <Calendar /> : <Navigate to="/" />}
        />
        <Route
          path="/about"
          element={isAuthenticated ? <AboutUs /> : <Navigate to="/" />}
        />
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
