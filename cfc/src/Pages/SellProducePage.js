import React, { useState } from 'react';

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

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('quantity', formData.quantity);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('mode', 'ready'); 
    data.append('email', email);// fixed mode since pre-harvest removed

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach(file => {
        data.append('images', file);
      });
    }

    try {
      const response = await fetch('http://localhost:5003/api/auth/sell-produce', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setFormData({
          name: '',
          category: '',
          quantity: '',
          price: '',
          description: '',
          images: [],
        });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
      <li><a href="/farmer" className="hover:underline">Home</a></li>
      <li><a href="/farmer/sell-produces" className="hover:underline">Sell Produces</a></li>
      <li><a href="/farmer/going-to-harvest" className="hover:underline">Harvest Poduces</a></li>
      
      <li><a href="/farmer/problems" className="hover:underline">Problems</a></li>
      <li><a href="/farmer/mylistings" className="hover:underline">My Listings</a></li>
      <li><a href="/farmer/my-orders" className="hover:underline">My Orders</a></li>
      
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
      <div className="pt-[100px] pb-6 px-4 max-w-2xl mx-auto">
        {/* Sell Produce Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Ready to Sell Produce
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Crop Name"
            required
            className="w-full p-2 border rounded mb-4"
            value={formData.name}
            onChange={handleInputChange}
          />

          <select
            name="category"
            required
            className="w-full p-2 border rounded mb-4"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            <option value="Grains">Grains</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity (kg)"
            required
            className="w-full p-2 border rounded mb-4"
            value={formData.quantity}
            onChange={handleInputChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price per Unit"
            required
            className="w-full p-2 border rounded mb-4"
            value={formData.price}
            onChange={handleInputChange}
          />

          <textarea
            name="description"
            placeholder="Description (optional)"
            className="w-full p-2 border rounded mb-4"
            value={formData.description}
            onChange={handleInputChange}
          />

          <div className="mb-4">
            <label className="block mb-1 font-medium">Upload Images</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <p className="text-xs text-gray-500 mt-1">
              First image will be shown as main. Others in the details section.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            List Produce for Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellProducePage;
