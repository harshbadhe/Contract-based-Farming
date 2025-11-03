import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../contractconfig';

const BuyerMyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [finalContracts, setFinalContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, contractsRes, finalRes] = await Promise.all([
          fetch(`http://localhost:5003/api/auth/orders/${email}`),
          fetch(`http://localhost:5003/api/auth/contract-requests-by-buyer/${email}`),
          fetch(`http://localhost:5003/api/auth/final-contracts-for-buyer/${email}`)
        ]);

        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        if (!contractsRes.ok) throw new Error('Failed to fetch contract requests');
        if (!finalRes.ok) throw new Error('Failed to fetch final contracts');

        const ordersData = await ordersRes.json();
        const contractsData = await contractsRes.json();
        const finalData = await finalRes.json();

        setOrders(Array.isArray(ordersData) ? ordersData.filter(o => o.status !== 'Rejected') : []);
        setContracts(Array.isArray(contractsData) ? contractsData.filter(c => c.status !== 'Rejected') : []);
        setFinalContracts(Array.isArray(finalData) ? finalData : []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  // ✅ Approve (store contract on blockchain)
  const handleApprove = async (req) => {
    try {
      setProcessing(req.id);
      if (!window.ethereum) throw new Error('MetaMask not found');
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const buyerWallet = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // ✅ call smart contract (no BigInt here)
      const tx = await contract.createContract(
        req.orderId,
        req.farmerWallet,
        buyerWallet,
        req.cropName,
        Number(req.price),
        Number(req.acres),
        req.deliveryDate
      );

      await tx.wait();
      alert('✅ Final Contract stored successfully on blockchain!');

      // Delete final contract from Firebase (no longer needed)
      await fetch(`http://localhost:5003/api/auth/final-contract/${req.id}/delete`, {
        method: 'DELETE',
      });

      setFinalContracts(prev => prev.filter(fc => fc.id !== req.id));
    } catch (err) {
      console.error(err);
      alert('❌ Error: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Reject
  const handleReject = async (id) => {
    if (!window.confirm('Reject this contract proposal?')) return;
    await fetch(`http://localhost:5003/api/auth/final-contract/${id}/delete`, {
      method: 'DELETE',
    });
    setFinalContracts(prev => prev.filter(fc => fc.id !== id));
  };

  if (loading) return <p className="text-center mt-10">Loading your orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Farmafriend</h1>
          <ul className="hidden md:flex gap-16 font-medium">
            <li><a href="/buyer" className="hover:underline">Home</a></li>
            <li><a href="/buyer/buy-produces" className="hover:underline">Buy Produces</a></li>
            <li><a href="/buyer/give-contract" className="hover:underline">Give Contract</a></li>
            <li><a href="/buyer/my-orders" className="hover:underline">My Orders</a></li>
            <li><a href="/buyer/problems" className="hover:underline">Problems</a></li>
            <li><a href="/buyer/cart" className="hover:underline">Cart</a></li>
          </ul>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8">
        {/* 🟩 Final Contract Requests */}
        <h2 className="text-2xl font-bold mb-6 text-green-700">Final Contract Requests</h2>
        {finalContracts.length === 0 ? (
          <p className="text-gray-600 mb-6">No final contract proposals yet.</p>
        ) : (
          <div className="space-y-4 mb-10">
            {finalContracts.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition"
              >
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-green-700">{req.cropName}</h3>
                  <p><strong>Farmer:</strong> {req.farmerEmail}</p>
                  <p><strong>Price:</strong> ₹{req.price}</p>
                  <p><strong>Acres:</strong> {req.acres}</p>
                  <p><strong>Delivery Date:</strong> {req.deliveryDate}</p>
                  <p><strong>Status:</strong> Pending Approval</p>
                </div>
                <div className="flex gap-3 mt-3 md:mt-0">
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={processing === req.id}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    {processing === req.id ? 'Processing...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🧾 My Contract Requests (unchanged) */}
        <h2 className="text-2xl font-bold mb-6 text-green-700">My Contract Requests</h2>
        {contracts.length === 0 ? (
          <p className="text-gray-600 mb-6">No contract requests found.</p>
        ) : (
          <div className="space-y-4 mb-10">
            {contracts.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate(`/buyer/contract-details/${req.id}`)}
              >
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-green-700">{req.crop}</h3>
                  <p><strong>Farmer:</strong> {req.farmerEmail}</p>
                  <p><strong>Acres:</strong> {req.acres}</p>
                  <p><strong>Expected Price:</strong> ₹{req.expectedPrice}</p>
                  <p><strong>Status:</strong> {req.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🛒 My Orders (unchanged) */}
        <h2 className="text-2xl font-bold mb-6 text-green-700">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found for your account.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-4 flex gap-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate(`/buyer/order-details/${order.id}`)}
              >
                <img
                  src={order.image}
                  alt={order.name}
                  className="w-32 h-28 object-cover rounded border"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-green-700">{order.name}</h3>
                  <p><strong>Quantity:</strong> {order.quantity} kg</p>
                  <p><strong>Total:</strong> ₹{order.total}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Farmer:</strong> {order.farmerEmail}</p>
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

export default BuyerMyOrdersPage;
