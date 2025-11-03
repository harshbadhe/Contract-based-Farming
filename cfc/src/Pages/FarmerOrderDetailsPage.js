import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FarmerOrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5003/api/auth/order/${id}`)
      .then(res => res.json())
      .then(setOrder)
      .catch(err => console.error('❌ Failed to fetch order:', err));
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

  if (!order) return <p className="text-center mt-10">Loading order...</p>;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Order Details (Farmer View)</h2>

      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6">
        <img
          src={order.image}
          alt={order.name}
          className="w-40 h-36 object-cover rounded border"
        />
        <div className="space-y-2 flex-1">
          <p><strong>Crop:</strong> {order.name}</p>
          <p><strong>Buyer Email:</strong> {order.buyerEmail}</p>
          <p><strong>Quantity:</strong> {order.quantity} kg</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <p><strong>Address:</strong> {order.address}, {order.pincode}</p>
          <p><strong>Ordered On:</strong> {new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>
          <p><strong>Current Status:</strong> {order.status}</p>

          {/* Status Update */}
          <div className="mt-4">
            <label className="block mb-1 font-semibold">Update Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>

            <button
              onClick={updateStatus}
              disabled={updating}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>

            {order.status === 'Delivered (Confirmed)' && (
             <div className="mt-4 text-green-700 font-semibold text-lg">
            Order Delivered Successfully
         </div>
           )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default FarmerOrderDetailsPage;
