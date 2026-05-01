import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./components/pages/homepage";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import ForgotPassword from "./components/pages/ForgotPassword";
import FindSuppliers from "./components/pages/FindSupplier";
import BecomeSupplier from "./components/pages/BecomeSupplier";
import VendorDashboard from "./components/pages/VendorDashboard";
import SupplierDashboard from "./components/pages/SupplierDashboard";
import CreateOrder from "./components/pages/CreateOrder";
import AdminDashboard from "./components/pages/AdminDashboard";
import LiveChat from "./components/common/LiveChat";

const ProtectedRoute = ({ children, allowedUserTypes }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  if (allowedUserTypes && user && !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/find-suppliers" element={<ProtectedRoute><FindSuppliers /></ProtectedRoute>} />
          <Route path="/become-supplier" element={<ProtectedRoute><BecomeSupplier /></ProtectedRoute>} />
          <Route path="/vendor-dashboard" element={<ProtectedRoute allowedUserTypes={['vendor']}><VendorDashboard /></ProtectedRoute>} />
          <Route path="/supplier-dashboard" element={<ProtectedRoute allowedUserTypes={['supplier']}><SupplierDashboard /></ProtectedRoute>} />
          <Route path="/createorder" element={<ProtectedRoute allowedUserTypes={['vendor']}><CreateOrder /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedUserTypes={['admin']}><AdminDashboard /></ProtectedRoute>} />

          {/* Fallback (optional but recommended) */}
          <Route path="*" element={<h1 style={{ padding: 40 }}>404 Page Not Found</h1>} />
        </Routes>
        <LiveChat />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
