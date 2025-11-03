import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const BuyerRequestForm = () => {
  const { harvestId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const farmerEmail = searchParams.get('farmerEmail');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [acres, setAcres] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const email = localStorage.getItem('email');

  useEffect(() => {
    // Check if farmer has accepted the request
    fetch(`http://localhost:5003/api/auth/contracts/status/${harvestId}?email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.isAccepted) {
          setIsAccepted(true);
        }
      });
  }, [harvestId, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      buyerEmail: email,
      buyerName: name,
      message,
      farmerEmail,
      harvestId,
      acres,
      finalPrice
    };

    const res = await fetch('http://localhost:5003/api/auth/contract-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    alert(result.message);
  };

  return (
    <div className="p-6 bg-white max-w-xl mx-auto rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-green-700">Send Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          value={email}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />

        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Acres (only after accepted)"
          value={acres}
          onChange={e => setAcres(e.target.value)}
          disabled={!isAccepted}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Final Price"
          value={finalPrice}
          onChange={e => setFinalPrice(e.target.value)}
          disabled={!isAccepted}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800"
        >
          {isAccepted ? 'Finalize Contract' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};

export default BuyerRequestForm;
