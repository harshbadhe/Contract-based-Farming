import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    role: 'farmer',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('address', formData.address);
    data.append('city', formData.city);
    data.append('role', formData.role);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      const res = await fetch('http://localhost:5003/api/auth/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert('Registered successfully!');
        navigate('/');
      } else {
        alert('Registration failed: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full mb-3 p-2 border rounded"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="farmer">Farmer</option>
          <option value="buyer">Buyer</option>
        </select>

        <label className="block text-left text-sm text-gray-600 mb-1">Upload Photo (optional)</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="mb-4"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <span
            className="text-green-700 underline cursor-pointer"
            onClick={() => navigate('/')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
