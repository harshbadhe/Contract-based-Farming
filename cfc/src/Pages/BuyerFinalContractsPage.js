import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contractconfig";

const BuyerFinalContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const email = localStorage.getItem("email");

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

  if (loading) return <p className="text-center mt-10">Loading blockchain contracts...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-700 text-white px-6 py-4">
        <h1 className="text-xl font-bold">Buyer Contracts</h1>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-green-700">
          Final Blockchain Contracts (Buyer)
        </h2>
        {contracts.length === 0 ? (
          <p className="text-gray-600">No blockchain contracts found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {contracts.map(c => (
              <div
                key={c.id}
                className="bg-white p-4 shadow rounded-xl border hover:shadow-lg transition"
              >
                <h3 className="text-green-700 font-bold mb-2">{c.cropName}</h3>
                <p><strong>Order ID:</strong> {c.orderId}</p>
                <p><strong>Price:</strong> ₹{c.price}</p>
                <p><strong>Acres:</strong> {c.acres}</p>
                <p><strong>Delivery Date:</strong> {c.deliveryDate}</p>
                <p><strong>Status:</strong> {c.status}</p>
                <p><strong>Farmer Wallet:</strong> {c.farmerWallet}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerFinalContractsPage;
