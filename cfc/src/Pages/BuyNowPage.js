import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BuyNowPage = () => {
  const { name } = useParams(); // crop name
  const navigate = useNavigate();
  const [produce, setProduce] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    pincode: '',
    quantity: '',
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem('email') || '';
    setForm(prev => ({ ...prev, email: storedEmail }));

    fetch(`http://localhost:5003/api/auth/details/${name}`)
      .then(res => res.json())
      .then(data => setProduce(data))
      .catch(err => console.error('Failed to fetch:', err));
  }, [name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, address, pincode, quantity } = form;

    try {
      const res = await fetch('http://localhost:5003/api/auth/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: produce.name,
          buyerEmail: email,
          fullName,
          address,
          pincode,
          quantity,
          pricePer10kg: produce.price,
          image: produce.images[0],
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Order placed successfully!');
        navigate('/buyer/my-orders'); // or wherever you redirect
      } else {
        alert('Failed: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  if (!produce) return <p className="text-center mt-10">Loading...</p>;

  const qty = Number(form.quantity || 0);
  const price = (qty / 10) * produce.price;
  const transport = (qty / 10) * 50;
  const total = price + transport;

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Buy Produce</h1>

        <p className="text-gray-700"><strong>Crop:</strong> {produce.name}</p>
        <p className="text-gray-700"><strong>Price:</strong> ₹{produce.price} per 10kg</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Your Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />

          <input
            type="text"
            name="address"
            placeholder="Delivery Address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity in kg"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <div className="text-gray-700 space-y-1">
            <p>Subtotal: ₹{price}</p>
            <p>Transport: ₹{transport}</p>
            <p><strong>Total: ₹{total}</strong></p>
          </div>

          <p className="text-sm text-gray-500">Payment: <strong>Cash on Delivery</strong></p>

          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800 transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyNowPage;
