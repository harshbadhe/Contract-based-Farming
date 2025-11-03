// src/pages/BuyProducesPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BuyProducesPage = () => {
  const [produces, setProduces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5003/api/auth/buy-produces')
      .then(res => res.json())
      .then(data => setProduces(data))
      .catch(err => console.error('Error fetching produce:', err));
  }, []);

  const filtered = produces.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
     <div className="min-h-screen bg-green-50">
      {/* Navigation */}
      <nav className="bg-green-700 text-white px-6 py-4">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo */}
    <h1 className="text-xl font-bold">Farmafriend</h1>

    {/* Navigation Links */}
    <ul className="hidden md:flex gap-16 font-medium">
      <li><a href="/buyer" className="hover:underline">Home</a></li>
      <li><a href="/buyer/buy-produces" className="hover:underline">Buy Produces</a></li>
      
      <li><a href="/buyer/give-contract" className="hover:underline">Give Contract</a></li>
      <li><a href="/buyer/my-orders" className="hover:underline">My Orders</a></li>
      <li><a href="/buyer/problems" className="hover:underline">Problems</a></li>
      <li><a href="/buyer/cart" className="hover:underline">Cart</a></li>
    </ul>

    {/* Hamburger Menu for Profile (Right corner) */}
    <div className="cursor-pointer md:block">
      <div className="space-y-1">
        <div className="w-6 h-0.5 bg-white"></div>
        <div className="w-6 h-0.5 bg-white"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </div>
    </div>
  </div>
</nav>


      {/* Search */}
      <div className="max-w-4xl mx-auto py-6 flex items-center justify-between gap-4 px-4">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-green-700 text-white px-4 py-2 rounded">🔍 Filter</button>
      </div>

      {/* Produce Listings */}
      <div className="max-w-6xl mx-auto px-4 space-y-6 pb-12">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No items found.</p>
        ) : (
          filtered.map((item, idx) => (
            <Link to={`/buyer/details/${encodeURIComponent(item.name)}`} key={idx}>
              <div className="bg-white shadow rounded-lg flex overflow-hidden hover:scale-[1.01] transition">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-48 h-48 object-cover"
                />
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-black-700 mb-2">{item.name}</h2>
                    <p className="text-sm text-gray-600">{item.description}</p>

                    <p className="text-green-700 font-bold text-lg mt-2">Total Quantity: {item.quantity} kg </p>
                  </div>
                  <p className="text-green-700 font-bold text-lg mt-2">₹{item.price} / 10 kg</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BuyProducesPage;
