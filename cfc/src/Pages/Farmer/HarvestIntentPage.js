import React, { useState } from 'react';
import FarmerNavbar from '../../components/FarmerNavbar';

const HarvestIntentPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    acres: '',
    crops: '',
    harvestDate: '',
    photo: null,
    landPhotos: [],
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [landPreviews, setLandPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData(prev => ({ ...prev, photo: files[0] }));
      if (files[0]) setPhotoPreview(URL.createObjectURL(files[0]));
    } else if (name === 'landPhotos') {
      const fileArr = Array.from(files);
      setFormData(prev => ({ ...prev, landPhotos: fileArr }));
      setLandPreviews(fileArr.map(f => URL.createObjectURL(f)));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('address', formData.address);
    data.append('acres', formData.acres);
    data.append('crops', formData.crops);
    data.append('harvestDate', formData.harvestDate);
    data.append('email', localStorage.getItem('email'));
    if (formData.photo) data.append('photo', formData.photo);
    formData.landPhotos.forEach(img => data.append('landPhotos', img));

    try {
      const res = await fetch('http://localhost:5003/api/auth/harvest-intent', { method: 'POST', body: data });
      const result = await res.json();
      if (res.ok) {
        alert('Harvest intention submitted successfully!');
        setFormData({ fullName: '', address: '', acres: '', crops: '', harvestDate: '', photo: null, landPhotos: [] });
        setPhotoPreview(null);
        setLandPreviews([]);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Something went wrong');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Declare Harvest Intent</h1>
              <p className="text-green-100 text-sm">Let buyers know about your upcoming harvest — get contracts early</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Harvest Information</h2>
            <p className="text-sm text-gray-400">Share your farming details so buyers can find you</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Profile Photo */}
            <div className="flex items-center gap-5">
              <div className="relative">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-green-200" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-green-50 border-2 border-dashed border-green-300 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Photo</label>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Upload Photo
                  <input type="file" name="photo" accept="image/*" className="hidden" onChange={handleChange} />
                </label>
              </div>
            </div>

            {/* Full Name & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text" name="fullName" placeholder="e.g., Rajesh Kumar" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={formData.fullName} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <input
                  type="text" name="address" placeholder="Village, District, State" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={formData.address} onChange={handleChange}
                />
              </div>
            </div>

            {/* Crops & Acres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Crops</label>
                <input
                  type="text" name="crops" placeholder="e.g., Wheat, Rice, Corn" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={formData.crops} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Area (acres)</label>
                <input
                  type="number" name="acres" placeholder="e.g., 5" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={formData.acres} onChange={handleChange}
                />
              </div>
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected Harvest Date</label>
              <input
                type="date" name="harvestDate" required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                value={formData.harvestDate} onChange={handleChange}
              />
            </div>

            {/* Land Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Photos</label>
              <label className="flex flex-col items-center justify-center w-full h-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500">Click to upload land photos</span>
                <input type="file" name="landPhotos" accept="image/*" multiple className="hidden" onChange={handleChange} />
              </label>
              {landPreviews.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {landPreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`Land ${idx}`} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Harvest Intent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HarvestIntentPage;
