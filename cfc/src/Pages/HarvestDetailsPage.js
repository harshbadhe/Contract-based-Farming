import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const HarvestDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [ratingInfo, setRatingInfo] = useState({ average: 0, count: 0 });
  const userEmail = localStorage.getItem('email') || 'anonymous@example.com'; // fallback email
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterestedClick = () => {
    // This will redirect to the BuyerRequestForm page with data.id as a URL parameter
    navigate(`/buyer-request-form/${data.intentId}`);
  };

  // Fetch harvest details and ratings on mount and after rating submit
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

  useEffect(() => {
    fetchData();
  }, [id]);

  const submitRating = () => {
    if (selectedRating < 1) {
      alert('Please select a rating before submitting.');
      return;
    }
    setIsSubmitting(true);

    fetch('http://localhost:5003/api/auth/harvest/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intentId: id, userEmail, rating: selectedRating }),
    })
      .then(res => res.json())
      .then(() => {
        setSelectedRating(0);
        fetchData();
      })
      .catch(err => {
        console.error('Rating submit error:', err);
        alert('Failed to submit rating. Please try again.');
      })
      .finally(() => setIsSubmitting(false));
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  // Render stars for average rating (rounded)
  const renderAverageStars = () => {
    const avg = Math.round(ratingInfo.average);
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < avg ? '#FFD700' : '#ccc', fontSize: 24 }}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Photo */}
          <img
            src={data.photoUrl || 'https://via.placeholder.com/150'}
            alt="Farmer"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-green-800">{data.fullName}</h1>
            <p className="text-sm text-gray-600"><strong>Address:</strong> {data.address}</p>
            <p className="text-sm text-gray-600"><strong>Crops:</strong> {data.crops}</p>
            <p className="text-sm text-gray-600"><strong>Land Area:</strong> {data.acres} acres</p>
            <p className="text-sm text-gray-600"><strong>Harvest Date:</strong> {data.harvestDate}</p>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              {renderAverageStars()}
              <span><strong>{ratingInfo.average}</strong> ({ratingInfo.count} ratings)</span>
            </p>
          </div>
        </div>

        {/* Rating Component */}
        <div className="mt-6">
          <p className="text-gray-700 font-medium mb-1">Rate this Farmer:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: 30,
                  color: star <= (hoverRating || selectedRating) ? '#FFD700' : '#ccc',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} Star`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedRating(star);
                }}
              >
                ★
              </span>
            ))}
          </div>
          <button
            onClick={submitRating}
            disabled={selectedRating === 0 || isSubmitting}
            className={`mt-3 px-4 py-2 rounded font-semibold text-white ${
              selectedRating === 0 || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>

        {/* Land Photos */}
        {data.landPhotoUrls?.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Land Photos</h2>
            <div className="flex flex-wrap gap-4">
              {data.landPhotoUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Land ${idx}`}
                  className="w-40 h-28 object-cover rounded shadow"
                />
              ))}
            </div>
          </div>
        )}
       <button
  onClick={() => navigate(`/buyer/request-form/${data.id}?farmerEmail=${data.email || data.farmerEmail}`)}
  className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition"
>
  I’m Interested
</button>




                   
      
   

      </div>
    </div>
  );
};

export default HarvestDetailsPage;
