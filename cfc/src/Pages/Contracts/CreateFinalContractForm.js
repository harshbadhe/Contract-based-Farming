import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";

const CreateFinalContractForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contractData = location.state?.contract;

  const [formData, setFormData] = useState({
    orderId: `CST${Math.floor(1000000 + Math.random() * 9000000)}`,
    cropName: contractData?.crop || "",
    price: contractData?.expectedPrice || "",
    acres: contractData?.acres || "",
    deliveryDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("⏳ Sending final contract proposal...");

    try {
      if (!window.ethereum) throw new Error("MetaMask not detected");

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const farmerWallet = await signer.getAddress();

      const farmerEmail = localStorage.getItem("email");

      const res = await fetch("http://localhost:5003/api/auth/final-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: formData.orderId,
          intentId: contractData?.intentId || "",
          buyerEmail: contractData?.buyerEmail,
          farmerEmail,
          farmerWallet,
          cropName: formData.cropName,
          price: formData.price,
          acres: formData.acres,
          deliveryDate: formData.deliveryDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send request");

      setMessage("✅ Final contract proposal sent to buyer!");
      setTimeout(() => navigate("/farmer/my-orders"), 2000);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Create Final Contract Proposal</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="orderId" value={formData.orderId} readOnly className="border rounded w-full p-2 bg-gray-100" />
        <input type="text" name="cropName" value={formData.cropName} onChange={handleChange} placeholder="Crop Name" className="border rounded w-full p-2" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" className="border rounded w-full p-2" />
        <input type="number" name="acres" value={formData.acres} onChange={handleChange} placeholder="Acres" className="border rounded w-full p-2" />
        <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="border rounded w-full p-2" />
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          {loading ? "Sending..." : "Send to Buyer"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700 font-semibold">{message}</p>}
    </div>
  );
};

export default CreateFinalContractForm;
