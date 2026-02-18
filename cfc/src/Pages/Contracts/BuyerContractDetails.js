// BuyerContractDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatBox from '../Chat/ChatBox';
import BuyerNavbar from '../../components/BuyerNavbar';

const BuyerContractDetails = () => {
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
      const body = { role: 'buyer', action: action === 'done' ? 'done' : 'not_done' };
      const res = await fetch(`http://localhost:5003/api/auth/contract-request/${id}/negotiation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Action failed');
      await fetchContract();
    } catch (err) {
      console.error(err);
      alert('Failed to update negotiation: ' + (err.message || err));
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Negotiation Done': 'bg-green-50 text-green-700 border-green-200',
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
            <div className="h-8 bg-white/20 rounded-lg w-56 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-64 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Error</h3>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  const buyerHasDone = !!contract.buyerNegotiation;
  const farmerHasDone = !!contract.farmerNegotiation;
  const overallStatus = contract.status || 'Pending';

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
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Contract Negotiation</h1>
              <p className="text-green-100 text-sm">Negotiate terms with the farmer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Contract Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{contract.crop}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(overallStatus)}`}>
                {overallStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Farmer</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">{contract.farmerEmail}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Acres</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{contract.acres}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Expected Price</p>
                <p className="text-sm font-bold text-green-600 mt-0.5">₹{contract.expectedPrice}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Requested On</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">
                  {contract.createdAt ? new Date(contract.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Negotiation Status Bar */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${buyerHasDone ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-xs font-medium text-gray-600">You {buyerHasDone ? '(Done)' : '(Pending)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${farmerHasDone ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-xs font-medium text-gray-600">Farmer {farmerHasDone ? '(Done)' : '(Pending)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">💬 Negotiation Chat</h3>
            <p className="text-sm text-gray-400">Discuss terms and finalize details with the farmer</p>
          </div>
          <div className="p-4">
            <ChatBox
              currentUserEmail={currentUserEmail}
              otherUserEmail={contract.farmerEmail}
              contractId={contract.id}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Negotiation Actions</h3>

          {overallStatus === 'Cancelled' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">❌</span>
              </div>
              <div>
                <p className="font-semibold text-red-700">Negotiation Cancelled</p>
                <p className="text-sm text-red-600">This contract request has been cancelled</p>
              </div>
            </div>
          )}

          {overallStatus === 'Negotiation Done' && farmerHasDone && buyerHasDone && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">✅</span>
              </div>
              <div>
                <p className="font-semibold text-emerald-700">Negotiation Complete</p>
                <p className="text-sm text-emerald-600">Both parties completed. Waiting for farmer's final contract.</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => doNegotiationAction('done')}
              disabled={actionLoading || overallStatus === 'Cancelled' || buyerHasDone}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${buyerHasDone
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                }`}
            >
              {actionLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {buyerHasDone ? 'You marked Done' : 'Negotiation Done'}
            </button>

            <button
              onClick={() => {
                if (!window.confirm('Are you sure you want to cancel this negotiation?')) return;
                doNegotiationAction('not_done');
              }}
              disabled={actionLoading || overallStatus === 'Cancelled'}
              className="px-5 py-2.5 rounded-xl font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {actionLoading ? 'Processing...' : 'Not Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerContractDetails;
