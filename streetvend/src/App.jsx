import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./components/pages/Homepage";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import FindSuppliers from "./components/pages/FindSupplier";
import BecomeSupplier from "./components/pages/BecomeSupplier";
import VendorDashboard from "./components/pages/VendorDashboard";
import SupplierDashboard from "./components/pages/SupplierDashboard";
import CreateOrder from "./components/pages/CreateOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-suppliers" element={<FindSuppliers />} />
        <Route path="/become-supplier" element={<BecomeSupplier />} />

        {/* Dashboard Routes */}
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />

        {/* Orders */}
        <Route path="/createorder" element={<CreateOrder />} />

        {/* Fallback (optional but recommended) */}
        <Route path="*" element={<h1 style={{ padding: 40 }}>404 Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
