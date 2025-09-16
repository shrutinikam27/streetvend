import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './components/pages/homepage.jsx'
import FindSuppliers from './components/pages/FindSupplier.jsx';
import BecomeSupplier from './components/pages/BecomeSupplier.jsx';
import VendorDashboard from './components/pages/VendorDashboard.jsx';
import SupplierDashboard from './components/pages/SupplierDashboard.jsx';
import CreateOrderPage from './components/pages/CreateOrder.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/find-suppliers" element={<FindSuppliers />} />
        <Route path="/become-supplier" element={<BecomeSupplier />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        <Route path="/create-order" element={<CreateOrderPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
