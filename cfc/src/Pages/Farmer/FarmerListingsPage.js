import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerNavbar from '../../components/FarmerNavbar';

const FarmerListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5003/api/auth/my-listings')
      .then((res) => res.json())
      .then((data) => {
        setListings(data || []);
      })
      .catch((err) => {
        console.error('Error fetching listings:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getCategoryIcon = (category) => {
    const icons = { Grains: '🌾', Fruits: '🍎', Vegetables: '🥬' };
    return icons[category] || '🌱';
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Listings</h1>
                <p className="text-green-100 text-sm">
                  {!loading && `${listings.length} produce listing${listings.length !== 1 ? 's' : ''} active`}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/farmer/sell-produce')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Listing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings yet</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              Start selling your farm-fresh produce by creating your first listing
            </p>
            <button
              onClick={() => navigate('/farmer/sell-produce')}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Listing
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  {item.images && item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <span className="text-5xl opacity-40">🌾</span>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700">
                      {getCategoryIcon(item.category)} {item.category}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-bold shadow-sm">
                      ₹{item.price}/unit
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      {item.quantity} kg
                    </span>
                    {item.harvestDate && (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {item.harvestDate}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerListingsPage;
