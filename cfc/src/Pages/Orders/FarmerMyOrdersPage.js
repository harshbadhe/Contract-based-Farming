import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerNavbar from '../../components/FarmerNavbar';

const FarmerMyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, requestsRes] = await Promise.all([
          fetch(`http://localhost:5003/api/auth/farmer-orders-by-email/${email}`),
          fetch(`http://localhost:5003/api/auth/contract-requests/${email}`)
        ]);

        if (!ordersRes.ok) throw new Error('Failed to fetch farmer orders');
        if (!requestsRes.ok) throw new Error('Failed to fetch contract requests');

        const ordersData = await ordersRes.json();
        const requestsData = await requestsRes.json();

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setRequests(Array.isArray(requestsData) ? requestsData.filter(r => r.status !== 'Rejected') : []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const handleRequestStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:5003/api/auth/contract-request/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        if (status === 'Rejected') {
          setRequests(prev => prev.filter(req => req.id !== id));
        } else if (status === 'Accepted') {
          setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Accepted' } : req));
        }
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Failed to update status.');
    }
    setUpdatingId(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
      Accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      Processing: 'bg-blue-50 text-blue-700 border border-blue-200',
      Delivered: 'bg-green-50 text-green-700 border border-green-200',
      Cancelled: 'bg-red-50 text-red-700 border border-red-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const tabs = [
    { id: 'orders', label: 'Orders Received', count: orders.length, icon: '📦' },
    { id: 'requests', label: 'Contract Requests', count: requests.length, icon: '📋' },
  ];

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-20 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-1/4"></div>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ icon, title, subtitle }) => (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FarmerNavbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Something went wrong</h3>
            <p className="text-sm text-gray-400">{error}</p>
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
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Orders & Requests</h1>
              <p className="text-green-100 text-sm">Manage incoming orders and contract requests from buyers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            {/* Orders Received Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <EmptyState icon="📦" title="No orders received" subtitle="Orders from buyers will appear here" />
                ) : (
                  orders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                      onClick={() => navigate(`/farmer/order/${order.id}`)}
                    >
                      <div className="p-5 flex gap-5">
                        <img
                          src={order.image}
                          alt={order.name}
                          className="w-28 h-24 object-cover rounded-xl border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{order.name}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                            <p className="text-gray-500">
                              <span className="text-gray-400">Buyer:</span>{' '}
                              <span className="font-medium text-gray-700">{order.buyerEmail}</span>
                            </p>
                            <p className="text-gray-500">
                              <span className="text-gray-400">Qty:</span>{' '}
                              <span className="font-medium text-gray-700">{order.quantity} kg</span>
                            </p>
                            <p className="text-gray-500">
                              <span className="text-gray-400">Total:</span>{' '}
                              <span className="font-semibold text-green-600">₹{order.total}</span>
                            </p>
                            <p className="text-gray-500">
                              <span className="text-gray-400">Ordered:</span>{' '}
                              <span className="font-medium text-gray-700">
                                {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Contract Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <EmptyState icon="📋" title="No contract requests" subtitle="Contract requests from buyers will appear here" />
                ) : (
                  requests.map(req => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => navigate(`/farmer/contract-details/${req.id}`)}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                              <span className="text-lg">🌾</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{req.crop}</h3>
                              <p className="text-sm text-gray-400">From {req.buyerName || req.buyerEmail}</p>
                            </div>
                          </div>
                          {getStatusBadge(req.status)}
                        </div>
                        <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-3 mb-4">
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Buyer</p>
                            <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">{req.buyerEmail}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Acres</p>
                            <p className="text-sm font-medium text-gray-700 mt-0.5">{req.acres}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Expected Price</p>
                            <p className="text-sm font-semibold text-green-600 mt-0.5">₹{req.expectedPrice}</p>
                          </div>
                        </div>
                        {req.status === 'Pending' && (
                          <div className="flex gap-3 justify-end">
                            <button
                              className="px-5 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all flex items-center gap-1.5"
                              disabled={updatingId === req.id}
                              onClick={e => {
                                e.stopPropagation();
                                handleRequestStatus(req.id, 'Rejected');
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {updatingId === req.id ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
                              disabled={updatingId === req.id}
                              onClick={e => {
                                e.stopPropagation();
                                handleRequestStatus(req.id, 'Accepted');
                              }}
                            >
                              {updatingId === req.id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Accept
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FarmerMyOrdersPage;
