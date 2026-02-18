import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../contractconfig";
import { useNavigate } from "react-router-dom";
import BuyerNavbar from '../../components/BuyerNavbar';

const statusColors = {
  Created: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Accepted: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  InProgress: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

const BuyerFinalContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadContracts = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not detected");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const ids = await contract.getUserContracts(userAddress);
        const fetched = [];
        for (let id of ids) {
          const data = await contract.getContract(Number(id));
          fetched.push({
            id: Number(id),
            orderId: data.orderId,
            cropName: data.cropName,
            price: ethers.formatUnits(data.price.toString(), "wei"),
            acres: data.acres.toString(),
            deliveryDate: data.deliveryDate,
            status: ["Created", "Accepted", "InProgress", "Completed", "Cancelled"][Number(data.status)],
            farmerWallet: data.farmerWallet,
            buyerWallet: data.buyerWallet
          });
        }
        setContracts(fetched);
      } catch (err) {
        console.error("Load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadContracts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📜</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Contracts</h1>
              <p className="text-green-100 text-sm">Blockchain-verified smart contracts for your purchases</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100 py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{contracts.length}</span> contracts on blockchain
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Blockchain Secured
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Connecting to blockchain...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">Connection Error</h3>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No contracts found</h3>
            <p className="text-gray-400 text-sm">Your blockchain contracts will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contracts.map((c) => {
              const sc = statusColors[c.status] || statusColors.Created;
              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/buyer/contract/${c.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">{c.cropName}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Order: {c.orderId}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                        {c.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-green-50 rounded-xl px-3 py-2.5 text-center">
                        <p className="text-xs text-gray-500 mb-0.5">Price</p>
                        <p className="text-sm font-bold text-green-800">₹{c.price}</p>
                      </div>
                      <div className="bg-orange-50 rounded-xl px-3 py-2.5 text-center">
                        <p className="text-xs text-gray-500 mb-0.5">Land</p>
                        <p className="text-sm font-bold text-orange-700">{c.acres} acres</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl px-3 py-2.5 text-center">
                        <p className="text-xs text-gray-500 mb-0.5">Delivery</p>
                        <p className="text-sm font-bold text-blue-700">{c.deliveryDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="truncate">Farmer: {c.farmerWallet}</span>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      On-chain verified
                    </div>
                    <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                      View Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerFinalContractsPage;
