// FarmerContractDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatBox from './ChatBox';

const FarmerContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserEmail = localStorage.getItem('email');

  const fetchContract = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5003/api/auth/contract-request/${id}`);
      if (!res.ok) throw new Error('Failed to fetch contract request');
      const data = await res.json();
      setContract(data);
    } catch (err) {
      setError(err.message || 'Error fetching contract');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
    // eslint-disable-next-line
  }, [id]);

  const doNegotiationAction = async (action) => {
    if (!contract) return;
    setActionLoading(true);
    try {
      const body = { role: 'farmer', action: action === 'done' ? 'done' : 'not_done' };
      const res = await fetch(`http://localhost:5003/api/auth/contract-request/${id}/negotiation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Action failed');
      // after action, refetch contract to update UI
      await fetchContract();
    } catch (err) {
      console.error(err);
      alert('Failed to update negotiation: ' + (err.message || err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading contract details...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!contract) return <p className="text-center mt-10">Contract not found.</p>;

  const farmerHasDone = !!contract.farmerNegotiation;
  const buyerHasDone = !!contract.buyerNegotiation;
  const overallStatus = contract.status || 'Pending';

  return (
    <div className="p-6 bg-green-50 min-h-screen max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Contract Details (Farmer View)</h2>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p><strong>Crop:</strong> {contract.crop}</p>
        <p><strong>Buyer Name:</strong> {contract.buyerName}</p>
        <p><strong>Buyer Email:</strong> {contract.buyerEmail}</p>
        <p><strong>Acres:</strong> {contract.acres}</p>
        <p><strong>Expected Price:</strong> ₹{contract.expectedPrice}</p>
        <p><strong>Status:</strong> {overallStatus}</p>
        <p><strong>Requested On:</strong> {contract.createdAt ? new Date(contract.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
      </div>

      <ChatBox
        currentUserEmail={currentUserEmail}
        otherUserEmail={contract.buyerEmail}
        contractId={contract.id}
      />

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => doNegotiationAction('done')}
          disabled={actionLoading || overallStatus === 'Cancelled' || farmerHasDone}
          className={`px-4 py-2 rounded-lg text-white ${farmerHasDone ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {farmerHasDone ? 'You marked Done' : (actionLoading ? 'Processing...' : 'Negotiation Done')}
        </button>

        <button
          onClick={() => {
            if (!window.confirm('Are you sure you want to mark negotiation as Not Done? This will cancel the request.')) return;
            doNegotiationAction('not_done');
          }}
          disabled={actionLoading || overallStatus === 'Cancelled'}
          className={`px-4 py-2 rounded-lg text-white ${overallStatus === 'Cancelled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {actionLoading ? 'Processing...' : 'Not Done'}
        </button>
      </div>

     {contract.status === "Negotiation Done" && (
  <div className="mt-6 text-center">
    <button
      onClick={() =>
        navigate('/create-final-contract', { state: { contract } })
      }
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      Create Final Contract
    </button>
  </div>
)}

      {overallStatus === 'Cancelled' && (
        <p className="text-red-600 mt-3 text-center font-semibold">Negotiation has been cancelled.</p>
      )}
    </div>
  );
};

export default FarmerContractDetails;
