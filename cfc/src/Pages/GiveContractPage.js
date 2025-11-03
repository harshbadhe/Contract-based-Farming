import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GiveContractPage = () => {
  const [data, setData] = useState([]);
  const [ratings, setRatings] = useState({}); // { intentId: { average, count } }
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5003/api/auth/harvest-intents')
      .then(res => res.json())
      .then(async (result) => {
        const reversed = result.reverse();
        setData(reversed);

        // Fetch ratings for each intent
        const ratingsData = {};
        await Promise.all(
          reversed.map(async (item) => {
            try {
              const res = await fetch(`http://localhost:5003/api/auth/harvest/ratings/${item.id}`);
              const ratingInfo = await res.json();
              ratingsData[item.id] = ratingInfo;
            } catch (err) {
              console.error('Error fetching rating for', item.id, err);
              ratingsData[item.id] = { average: 0, count: 0 };
            }
          })
        );
        setRatings(ratingsData);
      })
      .catch(err => console.error('❌ Error fetching harvest data:', err));
  }, []);

  // Helper to render stars for average rating
  const renderStars = (average) => {
    const avg = Math.round(average);
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < avg ? '#FFD700' : '#ccc', fontSize: 18 }}>
        ★
      </span>
    ));
  };

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

 
      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Available Harvest Listings</h2>

        {data.length === 0 ? (
          <p className="text-center text-gray-600">No harvest listings available.</p>
        ) : (
          <div className="space-y-6">
            {data.map((item, index) => {
              const rating = ratings[item.id] || { average: 0, count: 0 };
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow flex items-start p-4 gap-6 cursor-pointer hover:bg-green-50 transition"
                  onClick={() => navigate(`/buyer/give-contract/${item.id}`)}
                >
                  {/* Profile Photo */}
                  <img
                    src={item.photoUrl || 'https://via.placeholder.com/80'}
                    alt="Farmer"
                    className="w-20 h-20 rounded-full object-cover border"
                  />

                  {/* Info Section */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{item.fullName}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Crops:</span> {item.crops}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Land Area:</span> {item.acres} acres
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Harvest Date:</span> {item.harvestDate}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      {renderStars(rating.average)}
                      <span>({rating.average} / 5 from {rating.count} ratings)</span>
                    </p>
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

export default GiveContractPage;
