import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FarmerNavbar from '../../components/FarmerNavbar';

const FarmerOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5003/api/auth/order/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error('❌ Failed to fetch order:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = () => {
    if (!newStatus) {
      alert('Please select a status.');
      return;
    }

    setUpdating(true);

    fetch(`http://localhost:5003/api/auth/order/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(res => {
        alert(res.message);
        setOrder(prev => ({ ...prev, status: newStatus }));
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Status update failed.');
      })
      .finally(() => setUpdating(false));
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
      Delivered: 'bg-green-50 text-green-700 border-green-200',
      'Delivered (Confirmed)': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pending', icon: '⏳' },
    { value: 'Shipped', label: 'Shipped', icon: '🚚' },
    { value: 'Delivered', label: 'Delivered', icon: '📬' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FarmerNavbar />
        <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-white/20 rounded-lg w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse">
            <div className="flex gap-6">
              <div className="w-48 h-40 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FarmerNavbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Order not found</h3>
            <p className="text-sm text-gray-400">This order may have been removed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-green-100 hover:text-white text-sm mb-4 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Order Details</h1>
              <p className="text-green-100 text-sm">Order #{id?.slice(0, 8)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Order Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row gap-6">
            <img
              src={order.image}
              alt={order.name}
              className="w-48 h-40 object-cover rounded-xl border border-gray-100"
            />
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{order.name}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Buyer</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{order.buyerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Quantity</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{order.quantity} kg</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Total Amount</p>
                  <p className="text-sm font-bold text-green-600 mt-0.5">₹{order.total}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Ordered On</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              {(order.address || order.pincode) && (
                <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-blue-500 uppercase tracking-wide font-medium">Delivery Address</p>
                    <p className="text-sm text-gray-700 mt-0.5">{order.address}{order.pincode ? `, ${order.pincode}` : ''}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Confirmed Banner */}
          {order.status === 'Delivered (Confirmed)' && (
            <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
                <div>
                  <p className="font-semibold text-emerald-700">Order Delivered Successfully</p>
                  <p className="text-sm text-emerald-600">The buyer has confirmed delivery of this order</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Update Status Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Update Order Status</h3>
            <p className="text-sm text-gray-400">Change the status of this order to keep the buyer informed</p>
          </div>
          <div className="p-6">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
            >
              <option value="">Select new status...</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={updateStatus}
              disabled={updating || !newStatus}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Status
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerOrderDetailsPage;
