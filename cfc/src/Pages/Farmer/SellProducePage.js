import React, { useState } from 'react';
import FarmerNavbar from '../../components/FarmerNavbar';

const SellProducePage = () => {
  const email = localStorage.getItem('email');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    description: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('quantity', formData.quantity);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('mode', 'ready');
    data.append('email', email);
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach(file => data.append('images', file));
    }
    try {
      const response = await fetch('http://localhost:5003/api/auth/sell-produce', { method: 'POST', body: data });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setFormData({ name: '', category: '', quantity: '', price: '', description: '', images: [] });
        setImagePreviews([]);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
              <span className="text-xl">🌾</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sell Your Produce</h1>
              <p className="text-green-100 text-sm">List your farm-fresh produce for buyers to discover</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Produce Details</h2>
            <p className="text-sm text-gray-400">Fill in the details about your produce listing</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Crop Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Crop Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Organic Tomatoes"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Grains">🌾 Grains</option>
                  <option value="Fruits">🍎 Fruits</option>
                  <option value="Vegetables">🥬 Vegetables</option>
                </select>
              </div>
            </div>

            {/* Quantity & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity (kg)</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="e.g., 500"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per 10 kg (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g., 250"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                name="description"
                placeholder="Describe your produce — quality, freshness, farming method..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition resize-none"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Images</label>
              <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500">Click to upload images</span>
                <span className="text-xs text-gray-400 mt-0.5">First image shown as main photo</span>
                <input type="file" name="images" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img src={src} alt={`Preview ${idx}`} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                      {idx === 0 && (
                        <span className="absolute -top-1.5 -left-1.5 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">Main</span>
                      )}
                    </div>
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
                  Listing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  List Produce for Sale
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProducePage;
