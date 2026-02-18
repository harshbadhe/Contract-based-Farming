import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FarmerLandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/farmer' },
    { label: 'Sell Produces', href: '/farmer/sell-produces' },
    { label: 'Harvest Produces', href: '/farmer/going-to-harvest' },
    { label: 'Problems', href: '/farmer/problems' },
    { label: 'My Listings', href: '/farmer/mylistings' },
    { label: 'My Orders', href: '/farmer/my-orders' },
    { label: 'Contracts', href: '/farmer/final-contracts' },
  ];

  const features = [
    {
      icon: '🌾',
      title: 'Sell Your Harvest',
      desc: 'List your produce and connect with verified buyers directly at fair market prices.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: '📋',
      title: 'Smart Contracts',
      desc: 'Transparent, blockchain-powered contracts that protect your interests.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: '💬',
      title: 'Community Support',
      desc: 'Get expert advice and solutions from fellow farmers and agricultural experts.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '📊',
      title: 'Track Orders',
      desc: 'Monitor all your orders & contracts from one simple dashboard.',
      color: 'from-violet-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAF9] font-sans">
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/farmer" className="flex items-center gap-3 group">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${scrolled
                ? 'bg-[#15803d]/10'
                : 'bg-white/20 backdrop-blur-sm'
                }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🌾</span>
            </div>
            <span
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-[#15803d]' : 'text-white'
                }`}
            >
              Farmafriend
            </span>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${scrolled
                    ? 'text-gray-600 hover:text-[#15803d] hover:bg-[#15803d]/5'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Profile + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Profile Button */}
            <button
              className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${scrolled
                ? 'bg-[#15803d] text-white hover:bg-[#166534] shadow-lg shadow-[#15803d]/20'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20'
                }`}
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">👤</div>
              Profile
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-xl border-t border-gray-100 animate-slideDown">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:text-[#15803d] hover:bg-[#15803d]/5 text-sm font-medium transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <img
          src="/assets/comm3.jpg"
          alt="Farming landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#15803d]/95 via-[#15803d]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-40 right-20 w-72 h-72 bg-[#FD661F]/20 rounded-full blur-3xl animate-pulse hidden xl:block"></div>
        <div className="absolute bottom-20 right-40 w-64 h-64 bg-[#dcfce7]/20 rounded-full blur-3xl animate-pulse hidden xl:block" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl space-y-8 pt-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">Trusted by 500+ Farmers</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Direct
              <br />
              Marketplace for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dcfce7] to-emerald-300">
                Agricultural Produce
              </span>
            </h1>

            {/* Description */}
            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              Easily list your farm's produce and connect directly with buyers.
              No middlemen, no extra costs — just fair prices and transparent transactions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/farmer/sell-produces')}
                className="px-8 py-4 bg-[#FD661F] text-white font-semibold rounded-xl hover:bg-[#e55a19] active:scale-[0.97] transition-all duration-200 shadow-xl shadow-[#FD661F]/30 flex items-center gap-2"
              >
                <span>Start Selling</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/farmer/going-to-harvest')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-all duration-200"
              >
                Announce Harvest
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex gap-8 pt-4">
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
                <p className="text-3xl font-bold text-white">200+</p>
                <p className="text-green-200 text-sm font-medium">Verified Buyers</p>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
                <p className="text-3xl font-bold text-white">1K+</p>
                <p className="text-green-200 text-sm font-medium">Transactions</p>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
                <p className="text-3xl font-bold text-white">98%</p>
                <p className="text-green-200 text-sm font-medium">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 100V60C240 20 480 0 720 10C960 20 1200 50 1440 60V100H0Z" fill="#F7FAF9" />
          </svg>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#15803d]/10 text-[#15803d] text-sm font-semibold rounded-full">
              Why Farmafriend?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to
              <span className="text-[#15803d]"> grow your business</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From selling produce to managing contracts, we've got you covered with powerful tools designed for modern farmers.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / Showcase Section ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#FD661F]/10 text-[#FD661F] text-sm font-semibold rounded-full">
              Our Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Built for the <span className="text-[#15803d]">farming community</span>
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: '/assets/comm3.jpg',
                title: 'Empowering Farmers',
                desc: 'We aim to build a direct link between farmers and markets, reducing dependency on middlemen.',
                tag: 'Mission',
              },
              {
                img: '/assets/comm4.jpg',
                title: 'Smart Supply Access',
                desc: 'From seeds to fertilizers, find everything you need in one place, tailored to your crop needs.',
                tag: 'Resources',
              },
              {
                img: '/assets/comm2.jpg',
                title: 'Community Support',
                desc: 'Share your problems, get solutions from other farmers and experts in the community.',
                tag: 'Community',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#15803d]">
                    {card.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#15803d] to-[#16a34a] px-8 sm:px-16 py-16">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to sell your produce?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Join thousands of farmers who are already earning more by selling directly to buyers through Farmafriend.
            </p>
            <button
              onClick={() => navigate('/farmer/sell-produces')}
              className="px-8 py-4 bg-white text-[#15803d] font-bold rounded-xl hover:bg-gray-50 active:scale-[0.97] transition-all duration-200 shadow-xl shadow-black/10"
            >
              Get Started Now →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold">Farmafriend</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 Farmafriend. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/farmer" className="text-gray-400 hover:text-white text-sm transition">Home</a>
            <a href="/farmer/problems" className="text-gray-400 hover:text-white text-sm transition">Support</a>
            <a href="/farmer/my-orders" className="text-gray-400 hover:text-white text-sm transition">Orders</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FarmerLandingPage;
