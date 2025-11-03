import React, { useEffect, useState } from 'react';

const FarmerListingsPage = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5003/api/auth/my-listings')
      .then((res) => res.json())
      .then((data) => {
        setListings(data || []);
      })
      .catch((err) => {
        console.error('Error fetching listings:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navigation */}
      <nav className="bg-green-700 text-white px-6 py-4">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo */}
    <h1 className="text-xl font-bold">Farmafriend</h1>

    {/* Navigation Links */}
    <ul className="hidden md:flex gap-16 font-medium">
      <li><a href="/farmer" className="hover:underline">Home</a></li>
      <li><a href="/farmer/sell-produces" className="hover:underline">Sell Produces</a></li>
      <li><a href="/farmer/going-to-harvest" className="hover:underline">Harvest Poduces</a></li>
      
      <li><a href="/farmer/problems" className="hover:underline">Problems</a></li>
      <li><a href="/farmer/mylistings" className="hover:underline">My Listings</a></li>
      <li><a href="/farmer/my-orders" className="hover:underline">My Orders</a></li>
      
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

      {/* Listings */}
      <div className="max-w-6xl mx-auto py-10 px-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {listings.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">No listings found.</p>
        ) : (
          listings.map((item, index) => (
            <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
              {item.images && item.images[0] && (
                <img src={item.images[0]} alt={item.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-green-700 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity} kg</p>
                <p className="text-sm text-gray-600">Price: ₹{item.price} / unit</p>
                {item.harvestDate && (
                  <p className="text-sm text-yellow-600 mt-1">Harvest Date: {item.harvestDate}</p>
                )}
                {item.description && (
                  <p className="text-sm mt-2 text-gray-700">{item.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FarmerListingsPage;
