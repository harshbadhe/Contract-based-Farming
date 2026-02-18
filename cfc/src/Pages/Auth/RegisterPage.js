import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
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
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel — Branding / Visual */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        {/* Background Image */}
        <img
          src="/assets/comm4.jpg"
          alt="Agriculture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#15803d]/90 via-[#15803d]/75 to-[#16a34a]/60"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">Farmafriend</span>
          </div>

          {/* Main Message */}
          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Join the Future
              <br />
              <span className="text-[#dcfce7]">of Farming</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Whether you grow it or need it — Farmafriend connects you directly, building trust through transparent contracts.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">📋</div>
              <div>
                <p className="font-semibold text-sm">Smart Contracts</p>
                <p className="text-white/60 text-xs mt-0.5">Blockchain-powered transparent agreements</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">🤝</div>
              <div>
                <p className="font-semibold text-sm">Direct Connection</p>
                <p className="text-white/60 text-xs mt-0.5">No middlemen, fair prices for everyone</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">🛡️</div>
              <div>
                <p className="font-semibold text-sm">Verified Community</p>
                <p className="text-white/60 text-xs mt-0.5">Trusted farmers and buyers network</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center bg-[#F7FAF9] p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#15803d]/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <span className="text-2xl font-bold text-[#15803d] tracking-tight">Farmafriend</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-2">Start your journey with Farmafriend today</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="bg-[#dcfce7]/40 p-1.5 rounded-2xl flex">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'farmer' }))}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${formData.role === 'farmer'
                ? 'bg-white text-[#15803d] shadow-md shadow-[#15803d]/10'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="text-lg">👨‍🌾</span>
              I'm a Farmer
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'buyer' }))}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${formData.role === 'buyer'
                ? 'bg-white text-[#15803d] shadow-md shadow-[#15803d]/10'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="text-lg">🏪</span>
              I'm a Buyer
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div className="flex justify-center">
              <label className="cursor-pointer group">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 group-hover:border-[#15803d] transition-colors duration-200 flex items-center justify-center overflow-hidden bg-white">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-400 group-hover:text-[#15803d] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 text-center mt-1.5 group-hover:text-[#15803d] transition-colors">
                  Upload Photo
                </p>
              </label>
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 block">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#15803d] focus:ring-4 focus:ring-[#15803d]/10 transition-all duration-200 text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#15803d] focus:ring-4 focus:ring-[#15803d]/10 transition-all duration-200 text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 block">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#15803d] focus:ring-4 focus:ring-[#15803d]/10 transition-all duration-200 text-sm"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.879L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Address & City Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 block">Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Your address"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#15803d] focus:ring-4 focus:ring-[#15803d]/10 transition-all duration-200 text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 block">City</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="city"
                    placeholder="Your city"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#15803d] focus:ring-4 focus:ring-[#15803d]/10 transition-all duration-200 text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#15803d] text-white font-semibold rounded-xl hover:bg-[#166534] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#15803d]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                `Create ${formData.role === 'farmer' ? 'Farmer' : 'Buyer'} Account`
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#F7FAF9] text-gray-400">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 border-2 border-[#15803d]/20 text-[#15803d] font-semibold rounded-xl hover:bg-[#15803d]/5 hover:border-[#15803d]/40 active:scale-[0.98] transition-all duration-200"
          >
            Sign In Instead
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 pb-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
