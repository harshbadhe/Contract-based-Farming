import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5003/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Login successful');
        localStorage.setItem('token', result.token);
        localStorage.setItem('email', email);
        role === 'farmer' ? navigate('/farmer') : navigate('/buyer');
      } else {
        alert('Login failed: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      alert('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel — Branding / Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img
          src="/assets/comm3.jpg"
          alt="Farming"
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
              Connecting Farms
              <br />
              <span className="text-[#dcfce7]">to Markets</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              A transparent platform for contract-based farming. Sell directly, buy with confidence, and grow together.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-white/60 text-sm">Active Farmers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">200+</p>
                <p className="text-white/60 text-sm">Verified Buyers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1K+</p>
                <p className="text-white/60 text-sm">Contracts</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md border border-white/10">
            <p className="text-white/90 italic text-sm leading-relaxed">
              "Farmafriend gave me direct access to buyers. My income increased by 40% in the first season itself!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">👨‍🌾</div>
              <div>
                <p className="font-semibold text-sm">Rajesh Patil</p>
                <p className="text-white/50 text-xs">Farmer, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F7FAF9] p-6 sm:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#15803d]/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <span className="text-2xl font-bold text-[#15803d] tracking-tight">Farmafriend</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="bg-[#dcfce7]/40 p-1.5 rounded-2xl flex">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${role === 'farmer'
                ? 'bg-white text-[#15803d] shadow-md shadow-[#15803d]/10'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="text-lg">👨‍🌾</span>
              Farmer
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${role === 'buyer'
                ? 'bg-white text-[#15803d] shadow-md shadow-[#15803d]/10'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="text-lg">🏪</span>
              Buyer
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
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
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#15803d] focus:ring-4 focus:ring-[#15803d]/10 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#15803d] focus:ring-4 focus:ring-[#15803d]/10 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#15803d] text-white font-semibold rounded-xl hover:bg-[#166534] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#15803d]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                `Sign in as ${role === 'farmer' ? 'Farmer' : 'Buyer'}`
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#F7FAF9] text-gray-400">New to Farmafriend?</span>
            </div>
          </div>

          {/* Register Link */}
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3.5 border-2 border-[#15803d]/20 text-[#15803d] font-semibold rounded-xl hover:bg-[#15803d]/5 hover:border-[#15803d]/40 active:scale-[0.98] transition-all duration-200"
          >
            Create an Account
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 pt-2">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
