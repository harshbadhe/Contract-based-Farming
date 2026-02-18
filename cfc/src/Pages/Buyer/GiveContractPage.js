import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';

const GiveContractPage = () => {
  const [data, setData] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5003/api/auth/harvest-intents')
      .then(res => res.json())
      .then(async (result) => {
        const reversed = result.reverse();
        setData(reversed);

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
        setLoading(false);
      })
      .catch(err => { console.error('❌ Error fetching harvest data:', err); setLoading(false); });
  }, []);

  const renderStars = (average) => {
    const avg = Math.round(average);
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < avg ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  const filtered = data.filter(item =>
    item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.crops?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Give a Contract</h1>
              <p className="text-green-100 text-sm">Connect with farmers ready to harvest — define your crop needs in advance</p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search farmers or crops..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/95 backdrop-blur-sm rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100 py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filtered.length}</span> farmers available for contracts
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Active Listings
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No harvest listings found</h3>
            <p className="text-gray-400 text-sm">Check back later for new farmer listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((item, index) => {
              const rating = ratings[item.id] || { average: 0, count: 0 };
              return (
                <div
                  key={index}
                  onClick={() => navigate(`/buyer/give-contract/${item.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-5">
                      {/* Farmer Photo */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.photoUrl || 'https://via.placeholder.com/80'}
                          alt="Farmer"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-green-100 group-hover:border-green-300 transition-colors"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>

                      {/* Farmer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                            {item.fullName}
                          </h3>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-green-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <div className="flex">{renderStars(rating.average)}</div>
                          <span className="text-sm text-gray-500">
                            {Number(rating.average).toFixed(1)} ({rating.count})
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-green-50 rounded-xl px-3 py-2 text-center">
                            <p className="text-xs text-gray-500 mb-0.5">Crops</p>
                            <p className="text-sm font-semibold text-green-800 truncate">{item.crops}</p>
                          </div>
                          <div className="bg-orange-50 rounded-xl px-3 py-2 text-center">
                            <p className="text-xs text-gray-500 mb-0.5">Land</p>
                            <p className="text-sm font-semibold text-orange-700">{item.acres} acres</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl px-3 py-2 text-center">
                            <p className="text-xs text-gray-500 mb-0.5">Harvest</p>
                            <p className="text-sm font-semibold text-blue-700">{item.harvestDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{item.address || 'Location not specified'}</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                      Offer Contract →
                    </span>
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
