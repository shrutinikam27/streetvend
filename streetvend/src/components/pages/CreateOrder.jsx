import React, { useState } from 'react';
import { FaPlus, FaMinus, FaSearch, FaTrash, FaArrowLeft, FaChevronDown, FaTruck, FaCalendarAlt } from 'react-icons/fa';

const CreateOrderPage = () => {
    // State for form fields
    const [vendor, setVendor] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('pending');

    // State for order items
    const [items, setItems] = useState([
        { id: 1, product: '', quantity: 1, price: 0, total: 0 },
    ]);

    // Mock products data
    const products = [
        { id: 1, name: 'Potatoes (1kg)', price: 25 },
        { id: 2, name: 'Onions (1kg)', price: 30 },
        { id: 3, name: 'Cooking Oil (1L)', price: 180 },
        { id: 4, name: 'Wheat Flour (5kg)', price: 220 },
        { id: 5, name: 'Sugar (1kg)', price: 45 },
        { id: 6, name: 'Paneer (250g)', price: 80 },
        { id: 7, name: 'Tomatoes (1kg)', price: 40 },
        { id: 8, name: 'Green Chilies (100g)', price: 20 },
    ];

    // Mock vendors data
    const vendors = [
        { id: 1, name: 'Rajesh Kumar', location: 'Mumbai' },
        { id: 2, name: 'Priya Foods', location: 'Delhi' },
        { id: 3, name: 'Mumbai Chaat Corner', location: 'Mumbai' },
        { id: 4, name: 'Delhi Street Foods', location: 'Delhi' },
        { id: 5, name: 'Chennai Snacks', location: 'Chennai' },
    ];

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    // Handle adding a new item
    const addItem = () => {
        setItems([
            ...items,
            { id: items.length + 1, product: '', quantity: 1, price: 0, total: 0 }
        ]);
    };

    // Handle removing an item
    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    // Handle product selection
    const handleProductChange = (id, value) => {
        const selectedProduct = products.find(p => p.name === value);
        const newItems = items.map(item => {
            if (item.id === id) {
                const price = selectedProduct ? selectedProduct.price : 0;
                return {
                    ...item,
                    product: value,
                    price: price,
                    total: price * item.quantity
                };
            }
            return item;
        });
        setItems(newItems);
    };

    // Handle quantity change
    const handleQuantityChange = (id, value) => {
        const quantity = parseInt(value) || 0;
        const newItems = items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: quantity,
                    total: item.price * quantity
                };
            }
            return item;
        });
        setItems(newItems);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare order data
        const orderData = {
            vendor,
            orderDate,
            deliveryDate,
            notes,
            status,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                total: item.total
            })),
            totalAmount
        };

        try {
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                alert(`Order created successfully!\nTotal Amount: ₹${totalAmount.toLocaleString()}`);
                // Reset form after submission
                setItems([{ id: 1, product: '', quantity: 1, price: 0, total: 0 }]);
                setVendor('');
                setOrderDate('');
                setDeliveryDate('');
                setNotes('');
                setStatus('pending');
            } else {
                const errorData = await response.json();
                alert(`Failed to create order: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            alert(`Error creating order: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white p-6 shadow-lg">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                            <FaArrowLeft className="text-white" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Create New Order</h1>
                            <p className="text-orange-200">Fill in the details to create a new order</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <span className="text-orange-600 font-bold">SP</span>
                        </div>
                        <span className="font-medium">Agro Products Ltd.</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <form onSubmit={handleSubmit}>
                                {/* Vendor Selection */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2">Select Vendor</label>
                                    <div className="relative">
                                        <select
                                            value={vendor}
                                            onChange={(e) => setVendor(e.target.value)}
                                            className="w-full pl-3 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                            required
                                        >
                                            <option value="">Select a vendor</option>
                                            {vendors.map(v => (
                                                <option key={v.id} value={v.name}>
                                                    {v.name} ({v.location})
                                                </option>
                                            ))}
                                        </select>
                                        <FaChevronDown className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Order Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={orderDate}
                                                onChange={(e) => setOrderDate(e.target.value)}
                                                className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                required
                                            />
                                            <FaCalendarAlt className="absolute left-3 top-4 text-gray-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Delivery Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={deliveryDate}
                                                onChange={(e) => setDeliveryDate(e.target.value)}
                                                className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                required
                                            />
                                            <FaTruck className="absolute left-3 top-4 text-gray-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            <FaPlus /> Add Item
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-3 px-4 text-left text-gray-500 font-medium">Product</th>
                                                    <th className="py-3 px-4 text-left text-gray-500 font-medium">Quantity</th>
                                                    <th className="py-3 px-4 text-left text-gray-500 font-medium">Price per Unit</th>
                                                    <th className="py-3 px-4 text-left text-gray-500 font-medium">Total</th>
                                                    <th className="py-3 px-4 text-left text-gray-500 font-medium">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map(item => (
                                                    <tr key={item.id} className="border-b">
                                                        <td className="py-4 px-4">
                                                            <div className="relative">
                                                                <select
                                                                    value={item.product}
                                                                    onChange={(e) => handleProductChange(item.id, e.target.value)}
                                                                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                                                    required
                                                                >
                                                                    <option value="">Select a product</option>
                                                                    {products.map(p => (
                                                                        <option key={p.id} value={p.name}>
                                                                            {p.name} (₹{p.price}/unit)
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <FaChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                                                    className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                >
                                                                    <FaMinus className="text-xs" />
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                                    className="w-16 text-center py-2 border-0 focus:ring-0"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                    className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                >
                                                                    <FaPlus className="text-xs" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center">
                                                                <span className="text-gray-600">₹</span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={item.price}
                                                                    onChange={(e) => {
                                                                        const price = parseFloat(e.target.value) || 0;
                                                                        const newItems = items.map(i => {
                                                                            if (i.id === item.id) {
                                                                                return {
                                                                                    ...i,
                                                                                    price: price,
                                                                                    total: price * i.quantity
                                                                                };
                                                                            }
                                                                            return i;
                                                                        });
                                                                        setItems(newItems);
                                                                    }}
                                                                    className="w-24 pl-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                    required
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 font-medium">
                                                            ₹{item.total.toLocaleString()}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-2 text-red-500 hover:text-red-700"
                                                                disabled={items.length <= 1}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2">Order Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        rows="3"
                                        placeholder="Any special instructions for this order..."
                                    ></textarea>
                                </div>

                                {/* Status Selection */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2">Order Status</label>
                                    <div className="relative">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full pl-3 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                            required
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <FaChevronDown className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
                                    >
                                        Create Order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">Order Summary</h2>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-700">Items ({items.length})</h3>
                                    <span className="text-gray-500">Amount</span>
                                </div>

                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <div>
                                                <p className="font-medium">{item.product || "Product not selected"}</p>
                                                <p className="text-gray-500">{item.quantity} × ₹{item.price.toLocaleString()}</p>
                                            </div>
                                            <span className="font-medium">₹{item.total.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 border-t border-b border-gray-200 py-4 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-medium">₹250.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (5%)</span>
                                    <span className="font-medium">₹{(totalAmount * 0.05).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                <span className="text-2xl font-bold text-orange-600">
                                    ₹{(totalAmount + 250 + totalAmount * 0.05).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </span>
                            </div>

                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                                <h4 className="font-semibold text-orange-700 mb-2">Order Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vendor:</span>
                                        <span className="font-medium">{vendor || "Not selected"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Date:</span>
                                        <span className="font-medium">{orderDate || "Not selected"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Date:</span>
                                        <span className="font-medium">{deliveryDate || "Not selected"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium capitalize">{status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderPage;
