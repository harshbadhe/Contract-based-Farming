import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';

const ProduceDetailsPage = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [data, setData] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5003/api/auth/details/${name}`)
      .then(res => res.json())
      .then(info => { setData(info); setMainImageIndex(0); setLoading(false); })
      .catch(err => { console.error('❌ Fetch failed:', err); setLoading(false); });
  }, [name]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const buyerEmail = localStorage.getItem('email') || 'test@example.com';
    const body = {
      buyerEmail,
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      imageUrl: data.images?.[mainImageIndex] || '',
    };
    try {
      const res = await fetch('http://localhost:5003/api/auth/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (res.ok) alert('Added to cart!');
      else alert('Failed: ' + result.error);
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong!');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
        <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-white/20 rounded-lg w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
              <div className="h-24 bg-gray-200 rounded-xl mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Product not found</h3>
          <p className="text-sm text-gray-400">This listing may have been removed</p>
          <button onClick={() => navigate('/buyer/buy-produces')} className="mt-4 text-green-600 hover:text-green-700 font-medium">
            Browse other products &rarr;
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-green-100 hover:text-white text-sm mb-4 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Marketplace
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🥬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white max-w-2xl leading-tight">{data.name}</h1>
              {data.category && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-lg bg-green-800/40 border border-green-500/30 text-green-100 text-xs font-medium">
                    {data.category}
                  </span>
                  <span className="text-green-200 text-sm">• Fresh Harvest</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Image Gallery */}
            <div className="p-6 lg:p-8 bg-gray-50/50 border-r border-gray-100">
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 group">
                <img
                  src={data.images?.[mainImageIndex] || 'https://via.placeholder.com/500?text=No+Image'}
                  alt={data.name}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {data.quantity > 0 ? (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                    In Stock
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>

              {data.images?.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {data.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImageIndex(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${mainImageIndex === idx
                          ? 'border-green-500 ring-2 ring-green-200 shadow-md transform -translate-y-1'
                          : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                        }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6 lg:p-8 flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Product Details
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  {data.description || 'Fresh farm produce available for direct purchase. Sourced directly from verified farmers ensuring the best quality and fair prices.'}
                </p>

                {/* Price Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium mb-1">Current Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">₹{data.price}</span>
                        <span className="text-gray-500 font-medium">/ 10 kg</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-700 font-medium mb-1">Available Quantity</p>
                      <p className="text-2xl font-bold text-gray-900">{data.quantity} kg</p>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-wider">Harvest Date</span>
                    </div>
                    <p className="text-gray-900 font-semibold truncate">{data.harvestDate || 'Freshly Harvested'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-wider">Quality</span>
                    </div>
                    <p className="text-green-700 font-semibold">Premium Grade</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || data.quantity <= 0}
                  className="flex-1 px-8 py-4 bg-white border-2 border-green-600 text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  {addingToCart ? (
                    <div className="w-5 h-5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  )}
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/buy-now/${data.name}`)}
                  disabled={data.quantity <= 0}
                  className="flex-1 px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-600/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Footer */}
        <div className="flex justify-center gap-8 mt-12 mb-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🛡️</div>
            <div className="text-xs font-semibold text-gray-500">Secure<br />Payment</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">🚚</div>
            <div className="text-xs font-semibold text-gray-500">Fast<br />Delivery</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🌱</div>
            <div className="text-xs font-semibold text-gray-500">100%<br />Organic</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduceDetailsPage;
