import React, { useState } from 'react';

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

  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else if (name === 'landPhotos') {
      setFormData((prev) => ({ ...prev, landPhotos: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('address', formData.address);
    data.append('acres', formData.acres);
    data.append('crops', formData.crops);
    data.append('harvestDate', formData.harvestDate);
    data.append('email', localStorage.getItem('email'));

    if (formData.photo) data.append('photo', formData.photo);
    formData.landPhotos.forEach((img) => data.append('landPhotos', img));
       

    
    try {
      const res = await fetch('http://localhost:5003/api/auth/harvest-intent', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        alert('Harvest intention submitted successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Something went wrong');
      console.error(err);
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


      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Going to Harvest</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
          />
          <input
          type="text"
        name="address"
         placeholder="Address"  required
        className="w-full p-2 border rounded mb-4"
        value={formData.address}
        onChange={handleChange}
           />
          <input
            type="number"
            name="acres"
            placeholder="Land Area (in acres)"
            required
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
          />
          <input
            type="text"
            name="crops"
            placeholder="List of Crops"
            required
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
          />
          <input
            type="date"
            name="harvestDate"
            required
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
          />
          <label className="block text-sm font-medium mb-1">Upload Your Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="mb-4"
            onChange={handleChange}
          />
          <label className="block text-sm font-medium mb-1">Upload Land Photos</label>
          <input
            type="file"
            name="landPhotos"
            accept="image/*"
            multiple
            className="mb-4"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default HarvestIntentPage;
