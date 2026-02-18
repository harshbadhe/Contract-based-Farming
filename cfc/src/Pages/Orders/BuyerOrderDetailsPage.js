import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';

const BuyerOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5003/api/auth/order/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirmDelivery = () => {
    setConfirming(true);
    fetch(`http://localhost:5003/api/auth/order/${id}/confirm`, {
      method: 'PATCH',
    })
      .then(res => res.json())
      .then(res => {
        alert(res.message);
        setOrder(prev => ({ ...prev, status: 'Delivered (Confirmed)' }));
      })
      .catch(err => {
        console.error('Confirm failed:', err);
        alert('Failed to confirm delivery.');
      })
      .finally(() => setConfirming(false));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
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
        <BuyerNavbar />
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
      <BuyerNavbar />

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Order Content */}
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
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Farmer</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{order.farmerEmail}</p>
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
            </div>
          </div>

          {/* Delivery Confirmation */}
          {order.status === 'Delivered' && (
            <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📬</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Order has been delivered!</p>
                    <p className="text-sm text-gray-500">Have you received the order? Please confirm delivery.</p>
                  </div>
                </div>
                <button
                  onClick={handleConfirmDelivery}
                  disabled={confirming}
                  className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {confirming ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Confirming...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirm Delivery
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {order.status === 'Delivered (Confirmed)' && (
            <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
                <div>
                  <p className="font-semibold text-emerald-700">Order Delivered Successfully</p>
                  <p className="text-sm text-emerald-600">You have confirmed the delivery of this order</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOrderDetailsPage;
