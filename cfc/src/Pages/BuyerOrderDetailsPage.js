import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BuyerOrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5003/api/auth/order/${id}`)
      .then(res => res.json())
      .then(setOrder)
      .catch(err => console.error('Fetch error:', err));
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

  if (!order) return <p className="text-center mt-10">Loading order...</p>;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Order Details (Buyer View)</h2>
      <div className="bg-white rounded-lg shadow p-6 flex gap-6 flex-col md:flex-row">
        <img
          src={order.image}
          alt={order.name}
          className="w-40 h-36 object-cover rounded border"
        />
        <div className="space-y-2">
          <p><strong>Crop:</strong> {order.name}</p>
          <p><strong>Farmer:</strong> {order.farmerEmail}</p>
          <p><strong>Quantity:</strong> {order.quantity} kg</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Ordered on:</strong> {new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>

          {order.status === 'Delivered' && (
            <div className="mt-4">
              <p className="mb-2 font-medium text-gray-800">Order received?</p>
              <button
                onClick={handleConfirmDelivery}
                disabled={confirming}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {confirming ? 'Confirming...' : '✅ Confirm Delivery'}
              </button>
            </div>
          )}

          {order.status === 'Delivered (Confirmed)' && (
            <div className="mt-4 text-green-700 font-semibold text-lg">
              ✅ Order Delivered Successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOrderDetailsPage;
