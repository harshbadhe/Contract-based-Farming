import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../contractconfig";
import FarmerNavbar from '../../components/FarmerNavbar';

const statusConfig = {
  Created: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Created' },
  Accepted: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Accepted' },
  InProgress: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'In Progress' },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' },
};

const statusSteps = ['Created', 'Accepted', 'InProgress', 'Completed'];

const FarmerContractDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractData, setContractData] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchContract = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not detected");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const data = await contract.getContract(id);
        setContractData({
          id,
          orderId: data.orderId,
          cropName: data.cropName,
          price: ethers.formatUnits(data.price.toString(), "wei"),
          acres: data.acres.toString(),
          deliveryDate: data.deliveryDate,
          status: ["Created", "Accepted", "InProgress", "Completed", "Cancelled"][Number(data.status)],
          farmerWallet: data.farmerWallet,
          buyerWallet: data.buyerWallet,
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load contract");
      }
    };
    fetchContract();
  }, [id]);

  const updateStatus = async (newStatusIndex) => {
    try {
      setStatusUpdating(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.updateStatus(id, newStatusIndex);
      await tx.wait();
      setContractData((prev) => ({
        ...prev,
        status: ["Created", "Accepted", "InProgress", "Completed", "Cancelled"][newStatusIndex],
      }));
      setMessage("✅ Status updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!contractData) return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNavbar />
      <div className="flex flex-col items-center py-20">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm">Loading contract from blockchain...</p>
      </div>
    </div>
  );

  const sc = statusConfig[contractData.status] || statusConfig.Created;
  const currentStepIdx = statusSteps.indexOf(contractData.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNavbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/farmer/final-contracts" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            My Contracts
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{contractData.cropName}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Contract Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{contractData.cropName}</h1>
                <p className="text-green-100 text-sm mt-1">Contract #{contractData.id} • Order: {contractData.orderId}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-sm ${sc.text}`}>
                <span className={`w-2 h-2 rounded-full ${sc.dot}`}></span>
                {sc.label}
              </span>
            </div>
          </div>

          {/* Progress Tracker */}
          {contractData.status !== 'Cancelled' && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, idx) => {
                  const isActive = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${isActive
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                          {isActive ? '✓' : idx + 1}
                        </div>
                        <span className={`text-xs font-medium ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                          {statusConfig[step].label}
                        </span>
                      </div>
                      {idx < statusSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 rounded ${idx < currentStepIdx ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Price</p>
                <p className="text-lg font-bold text-green-800">₹{contractData.price}</p>
              </div>
              <div className="bg-orange-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Land Area</p>
                <p className="text-lg font-bold text-orange-700">{contractData.acres} acres</p>
              </div>
              <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
                <p className="text-lg font-bold text-blue-700">{contractData.deliveryDate}</p>
              </div>
              <div className="bg-purple-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Contract ID</p>
                <p className="text-lg font-bold text-purple-700">#{contractData.id}</p>
              </div>
            </div>

            {/* Wallet Addresses */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🌾</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Farmer Wallet</p>
                  <p className="text-sm font-mono text-gray-700 truncate">{contractData.farmerWallet}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🛒</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Buyer Wallet</p>
                  <p className="text-sm font-mono text-gray-700 truncate">{contractData.buyerWallet}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contract Actions</h3>

          <div className="flex flex-wrap gap-3">
            {contractData.status === "Created" && (
              <button
                onClick={() => updateStatus(1)}
                disabled={statusUpdating}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {statusUpdating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                ✓ Accept Contract
              </button>
            )}

            {contractData.status === "Accepted" && (
              <button
                onClick={() => updateStatus(2)}
                disabled={statusUpdating}
                className="bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-yellow-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {statusUpdating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                🔄 Mark In Progress
              </button>
            )}

            {contractData.status === "InProgress" && (
              <>
                <button
                  onClick={() => updateStatus(3)}
                  disabled={statusUpdating}
                  className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {statusUpdating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  ✓ Mark Completed
                </button>
                <button
                  onClick={() => updateStatus(4)}
                  disabled={statusUpdating}
                  className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-medium hover:bg-red-100 transition border border-red-200 disabled:opacity-50"
                >
                  Cancel Contract
                </button>
              </>
            )}

            <button
              onClick={() => navigate(`/farmer/contract-agreement/${id}`)}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition flex items-center gap-2"
            >
              📄 View Agreement
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerContractDetailsPage;
