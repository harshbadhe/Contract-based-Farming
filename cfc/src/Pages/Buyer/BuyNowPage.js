import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';

const BuyNowPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [produce, setProduce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    pincode: '',
    quantity: '',
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem('email') || '';
    setForm(prev => ({ ...prev, email: storedEmail }));

    setLoading(true);
    fetch(`http://localhost:5003/api/auth/details/${name}`)
      .then(res => res.json())
      .then(data => setProduce(data))
      .catch(err => console.error('Failed to fetch:', err))
      .finally(() => setLoading(false));
  }, [name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { fullName, email, address, pincode, quantity } = form;

    try {
      const res = await fetch('http://localhost:5003/api/auth/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: produce.name,
          buyerEmail: email,
          fullName,
          address,
          pincode,
          quantity,
          pricePer10kg: produce.price,
          image: produce.images[0],
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Order placed successfully!');
        navigate('/buyer/my-orders');
      } else {
        alert('Failed: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const qty = Number(form.quantity || 0);
  const price = produce ? (qty / 10) * produce.price : 0;
  const transport = (qty / 10) * 50;
  const total = price + transport;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
        <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="h-8 bg-white/20 rounded-lg w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse space-y-6">
            <div className="flex gap-6">
              <div className="w-40 h-32 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!produce) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Produce not found</h3>
            <p className="text-sm text-gray-400">This listing may have been removed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-green-100 hover:text-white text-sm mb-4 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛍️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Buy Produce</h1>
              <p className="text-green-100 text-sm">Complete your order for {produce.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Product Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 flex gap-5">
            {produce.images && produce.images[0] && (
              <img
                src={produce.images[0]}
                alt={produce.name}
                className="w-36 h-28 object-cover rounded-xl border border-gray-100"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{produce.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
                  ₹{produce.price} per 10kg
                </span>
                {produce.category && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium">
                    {produce.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Delivery Details</h2>
            <p className="text-sm text-gray-400">Fill in your delivery information</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Address & Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="House no, street, city"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="e.g., 411001"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g., 50"
                value={form.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="mx-6 mb-6 bg-gray-50 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal ({qty} kg × ₹{produce.price}/10kg)</span>
              <span className="font-medium text-gray-700">₹{price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transport charges</span>
              <span className="font-medium text-gray-700">₹{transport.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-green-600">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mx-6 mb-4 flex items-center gap-2 bg-blue-50 rounded-xl p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">Payment method: <span className="font-semibold">Cash on Delivery</span></p>
          </div>

          {/* Submit */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting || qty <= 0}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Placing Order...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Place Order — ₹{total.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyNowPage;
