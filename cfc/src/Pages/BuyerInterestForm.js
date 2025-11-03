import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const BuyerInterestForm = () => {
  const { intentId } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const farmerEmail = new URLSearchParams(search).get('farmerEmail');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    crop: '',
    expectedPrice: '',
    acres: '',
  });

  useEffect(() => {
    const email = localStorage.getItem('email');
    setFormData(prev => ({ ...prev, email }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      intentId,
      buyerName: formData.name,
      buyerEmail: formData.email,
      crop: formData.crop,
      expectedPrice: formData.expectedPrice,
      acres: formData.acres,
      farmerEmail, // ✅ attached
    };

    try {
      const res = await fetch('http://localhost:5003/api/auth/contract-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Request sent successfully!');
        navigate('/buyer/my-orders');
      } else {
        alert('Failed to send request: ' + result.error);
      }
    } catch (err) {
      console.error('❌ Error sending request:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full space-y-5"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-4">Send Contract Request</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Full Name"
          value={formData.name}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />

        <input
          type="text"
          name="crop"
          placeholder="Crop you want"
          value={formData.crop}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="expectedPrice"
          placeholder="Expected Price"
          value={formData.expectedPrice}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="acres"
          placeholder="Acres of land"
          value={formData.acres}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Send Request
        </button>
      </form>
    </div>
  );
};

export default BuyerInterestForm;
