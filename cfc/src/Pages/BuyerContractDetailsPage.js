import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams, useNavigate } from "react-router-dom";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contractconfig";

const BuyerContractDetailsPage = () => {
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

  if (!contractData) return <p className="text-center mt-10">Loading contract details...</p>;

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">Buyer Contract Details</h1>
        <button
          onClick={() => navigate(`/buyer/contract-agreement/${id}`, { state: { contractData } })}
          className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition"
        >
          View Agreement
        </button>
      </nav>

      {/* Contract Details */}
      <div className="max-w-3xl mx-auto py-8 px-4 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold text-green-700 mb-4">{contractData.cropName}</h2>
        <p><strong>Order ID:</strong> {contractData.orderId}</p>
        <p><strong>Acres:</strong> {contractData.acres}</p>
        <p><strong>Price:</strong> ₹{contractData.price}</p>
        <p><strong>Delivery Date:</strong> {contractData.deliveryDate}</p>
        <p><strong>Farmer Wallet:</strong> {contractData.farmerWallet}</p>
        <p><strong>Buyer Wallet:</strong> {contractData.buyerWallet}</p>
        <p><strong>Status:</strong> {contractData.status}</p>

        <div className="mt-6 flex gap-4">
          {contractData.status === "InProgress" && (
            <button
              onClick={() => updateStatus(3)} // Completed
              disabled={statusUpdating}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {statusUpdating ? "Updating..." : "Mark Completed"}
            </button>
          )}
        </div>

        {message && <p className="mt-4 text-green-700 font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default BuyerContractDetailsPage;
