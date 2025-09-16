import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/pages/homepage.jsx';
import FindSuppliers from './components/pages/FindSupplier.jsx';
import BecomeSupplier from './components/pages/BecomeSupplier.jsx';
import VendorDashboard from './components/pages/VendorDashboard.jsx';
import SupplierDashboard from './components/pages/SupplierDashboard.jsx';
import CreateOrder from './components/pages/CreateOrder.jsx';

function App() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/');
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setItems(data.items || []);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/find-suppliers" element={<FindSuppliers />} />
                <Route path="/become-supplier" element={<BecomeSupplier />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
                <Route path="/createorder" element={<CreateOrder />} />

                {/* Dynamic product routes */}
                {items.map((item, index) => (
                    <Route
                        key={index}
                        path={`/item/${item._id}`}
                        element={<div>{item.name}</div>}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
