import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';

const BuyProducesPage = () => {
  const [produces, setProduces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5003/api/auth/buy-produces')
      .then(res => res.json())
      .then(data => { setProduces(data); setLoading(false); })
      .catch(err => { console.error('Error fetching produce:', err); setLoading(false); });
  }, []);

  const categories = ['All', ...new Set(produces.map(p => p.category).filter(Boolean))];

  const filtered = produces.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
        <div className="flex justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />

      {/* Header with Search & Filters */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 pb-10 pt-8 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Fresh Produce Marketplace</h1>
              <p className="text-green-100 text-sm">Direct farm-to-table sourcing</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for crops, vegetables, fruits..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 shadow-xl shadow-green-900/10 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${selectedCategory === cat
                  ? 'bg-white text-green-700 shadow-lg shadow-black/5 scale-105'
                  : 'bg-green-800/40 text-green-50 hover:bg-green-800/60 hover:text-white border border-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 pb-12">
        {/* Stats Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">{filtered.length}</span> fresh listings
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Live Market</span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-300">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No produce found</h3>
            <p className="text-gray-500">We couldn't find any produce matching your criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-6 px-6 py-2.5 bg-green-50 text-green-600 font-semibold rounded-xl hover:bg-green-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <Link to={`/buyer/details/${encodeURIComponent(item.name)}`} key={idx} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.category && (
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-lg text-xs font-bold text-gray-800 shadow-sm">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-medium text-white/80 uppercase tracking-wider mb-0.5">Price</p>
                      <p className="text-lg font-bold flex items-baseline gap-1">
                        ₹{item.price}
                        <span className="text-xs font-normal text-white/70">/ 10kg</span>
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-1">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {item.description || 'Fresh farm produce available for direct purchase. Quality assured.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-sm font-bold text-green-800">{item.quantity} kg</span>
                      </div>

                      <span className="flex items-center gap-1 text-sm font-semibold text-green-600 group-hover:translate-x-1 transition-transform">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyProducesPage;
