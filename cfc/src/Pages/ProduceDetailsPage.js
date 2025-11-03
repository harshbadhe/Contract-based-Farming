import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProduceDetailsPage = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [data, setData] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5003/api/auth/details/${name}`)
      .then(res => res.json())
      .then(info => {
        setData(info);
        setMainImageIndex(0);
      })
      .catch(err => console.error('❌ Fetch failed:', err));
  }, [name]);

  if (!data) return <p className="text-center py-10">Loading...</p>;

  const handleAddToCart = async () => {
  const buyerEmail = localStorage.getItem('email') || 'test@example.com'; // fallback for testing

  const body = {
    buyerEmail,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    imageUrl: data.images?.[mainImageIndex] || '',  // fallback
  };

  console.log('👉 Sending to backend:', body);

  try {
    const res = await fetch('http://localhost:5003/api/auth/add-to-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (res.ok) {
      alert('Added to cart!');
    } else {
      alert('Failed: ' + result.error);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong!');
  }
};


  return (
    <div className="bg-gray-100 min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Section */}
          <div>
            <img
              src={data.images?.[mainImageIndex] || 'https://via.placeholder.com/300'}
              alt="Main"
              className="w-full h-[320px] object-cover rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:scale-[1.02]"
            />
            {data.images?.length > 1 && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {data.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => setMainImageIndex(idx)}
                    className={`w-20 h-20 object-cover rounded border cursor-pointer transition hover:scale-110 ${
                      mainImageIndex === idx ? 'ring-2 ring-green-600' : ''
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-700">{data.name}</h1>
            <p className="text-gray-700">{data.description || 'No description provided.'}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p><span className="font-semibold">Category:</span> {data.category}</p>
              <p><span className="font-semibold">Quantity:</span> {data.quantity} kg</p>
              <p><span className="font-semibold">Price:</span> ₹{data.price} / kg</p>
              {data.harvestDate && (
                <p><span className="font-semibold">Harvest Date:</span> {data.harvestDate}</p>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={handleAddToCart} className="bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-yellow-600 transition">
              Add to Cart 
           </button>
                <button
                   onClick={() => navigate(`/buy-now/${data.name}`)}
               className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition" > 
              Buy Now
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduceDetailsPage;
