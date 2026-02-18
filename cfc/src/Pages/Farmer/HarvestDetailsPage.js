import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';

const HarvestDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [ratingInfo, setRatingInfo] = useState({ average: 0, count: 0 });
  const userEmail = localStorage.getItem('email') || 'anonymous@example.com';
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = () => {
    fetch(`http://localhost:5003/api/auth/harvest-details/${id}`)
      .then(res => res.json())
      .then(info => setData(info))
      .catch(err => console.error('Fetch error:', err));

    fetch(`http://localhost:5003/api/auth/harvest/ratings/${id}`)
      .then(res => res.json())
      .then(res => setRatingInfo(res))
      .catch(err => console.error('Rating fetch error:', err));
  };

  useEffect(() => { fetchData(); }, [id]);

  const submitRating = () => {
    if (selectedRating < 1) { alert('Please select a rating.'); return; }
    setIsSubmitting(true);
    fetch('http://localhost:5003/api/auth/harvest/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intentId: id, userEmail, rating: selectedRating }),
    })
      .then(res => res.json())
      .then(() => { setSelectedRating(0); fetchData(); })
      .catch(err => { console.error('Rating submit error:', err); alert('Failed to submit rating.'); })
      .finally(() => setIsSubmitting(false));
  };

  if (!data) return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const avg = Math.round(Number(ratingInfo.average));

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/buyer/give-contract" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Contract Listings
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{data.fullName}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Farmer Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5">
            <div className="flex items-center gap-5">
              <img
                src={data.photoUrl || 'https://via.placeholder.com/150'}
                alt="Farmer"
                className="w-20 h-20 rounded-2xl object-cover border-3 border-white/30 shadow-lg"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{data.fullName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < avg ? 'text-yellow-300' : 'text-white/30'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-green-100 text-sm">
                    {Number(ratingInfo.average).toFixed(1)} ({ratingInfo.count} ratings)
                  </span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Farmer
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-green-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Crops</p>
                <p className="text-sm font-bold text-green-800">{data.crops}</p>
              </div>
              <div className="bg-orange-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Land Area</p>
                <p className="text-sm font-bold text-orange-700">{data.acres} acres</p>
              </div>
              <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Harvest Date</p>
                <p className="text-sm font-bold text-blue-700">{data.harvestDate}</p>
              </div>
              <div className="bg-purple-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-sm font-bold text-purple-700 truncate">{data.address || '—'}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-6">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Full Address</p>
                <p className="text-sm text-gray-700">{data.address}</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(`/buyer/request-form/${data.id}?farmerEmail=${data.email || data.farmerEmail}`)}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              I'm Interested — Send Contract Request
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Rate this Farmer</h3>

            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  style={{ color: star <= (hoverRating || selectedRating) ? '#FACC15' : '#D1D5DB' }}
                >
                  ★
                </button>
              ))}
            </div>

            {selectedRating > 0 && (
              <p className="text-sm text-gray-500 mb-3">
                You selected <span className="font-semibold text-yellow-600">{selectedRating}</span> star{selectedRating > 1 ? 's' : ''}
              </p>
            )}

            <button
              onClick={submitRating}
              disabled={selectedRating === 0 || isSubmitting}
              className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : 'Submit Rating'}
            </button>
          </div>

          {/* Land Photos Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Land Photos</h3>

            {data.landPhotoUrls?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {data.landPhotoUrls.map((url, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden bg-gray-100">
                    <img src={url} alt={`Land ${idx}`} className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-gray-400 text-sm">No land photos uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvestDetailsPage;
