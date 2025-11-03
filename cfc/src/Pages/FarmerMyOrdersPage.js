import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FarmerMyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
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

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navigation */}
      <nav className="bg-green-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Farmafriend</h1>
          <ul className="hidden md:flex gap-16 font-medium">
            <li><a href="/farmer" className="hover:underline">Home</a></li>
            <li><a href="/farmer/sell-produces" className="hover:underline">Sell Produces</a></li>
            <li><a href="/farmer/going-to-harvest" className="hover:underline">Harvest Produces</a></li>
            <li><a href="/farmer/problems" className="hover:underline">Problems</a></li>
            <li><a href="/farmer/mylistings" className="hover:underline">My Listings</a></li>
            <li><a href="/farmer/my-orders" className="hover:underline">My Orders</a></li>
            
          </ul>
          <div className="cursor-pointer md:block">
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Contract Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600 mb-6">No contract requests found.</p>
        ) : (
          <div className="space-y-4 mb-10">
            {requests.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate(`/farmer/contract-details/${req.id}`)}
              >
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-green-700">{req.crop}</h3>
                  <p><strong>Buyer:</strong> {req.buyerName} ({req.buyerEmail})</p>
                  <p><strong>Acres:</strong> {req.acres}</p>
                  <p><strong>Expected Price:</strong> ₹{req.expectedPrice}</p>
                  <p><strong>Status:</strong> {req.status}</p>
                  {req.status === 'Pending' && (
                    <div className="flex gap-4 mt-2">
                      <button
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                        disabled={updatingId === req.id}
                        onClick={e => {
                          e.stopPropagation();
                          handleRequestStatus(req.id, 'Accepted');
                        }}
                      >
                        {updatingId === req.id ? 'Processing...' : 'Accept'}
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                        disabled={updatingId === req.id}
                        onClick={e => {
                          e.stopPropagation();
                          handleRequestStatus(req.id, 'Rejected');
                        }}
                      >
                        {updatingId === req.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-green-700">Orders Received</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found for your crops.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-4 flex gap-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate(`/farmer/order-details/${order.id}`)}
              >
                <img
                  src={order.image}
                  alt={order.name}
                  className="w-32 h-28 object-cover rounded border"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-green-700">{order.name}</h3>
                  <p><strong>Ordered by:</strong> {order.buyerEmail}</p>
                  <p><strong>Quantity:</strong> {order.quantity} kg</p>
                  <p><strong>Total:</strong> ₹{order.total}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Ordered on:</strong> {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerMyOrdersPage;
