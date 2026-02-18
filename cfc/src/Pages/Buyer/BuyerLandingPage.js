import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerLandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/buyer' },
    { label: 'Buy Produces', href: '/buyer/buy-produces' },
    { label: 'Give Contract', href: '/buyer/give-contract' },
    { label: 'My Orders', href: '/buyer/my-orders' },
    { label: 'Problems', href: '/buyer/problems' },
    { label: 'Contracts', href: '/buyer/final-contracts' },
  ];

  const features = [
    {
      icon: '🛒',
      title: 'Buy Fresh Produce',
      desc: 'Browse and purchase farm-fresh produce directly from verified farmers at fair prices.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: '📋',
      title: 'Give Contracts',
      desc: 'Define crop requirements in advance and let farmers grow-to-order for your needs.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: '🤝',
      title: 'Direct Partnership',
      desc: 'Build long-term relationships with trusted farmers. No middlemen involved.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '🛡️',
      title: 'Secure Transactions',
      desc: 'Blockchain-powered contracts ensure transparency, trust, and quality assurance.',
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
          <a href="/buyer" className="flex items-center gap-3 group">
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
            <button
              className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${scrolled
                ? 'bg-[#15803d] text-white hover:bg-[#166534] shadow-lg shadow-[#15803d]/20'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20'
                }`}
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">👤</div>
              Profile
            </button>

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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-xl border-t border-gray-100">
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
        {/* Background */}
        <img
          src="/assets/comm4.jpg"
          alt="Agriculture supply chain"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#15803d]/95 via-[#15803d]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

        {/* Decorative Blobs */}
        <div className="absolute top-40 right-20 w-72 h-72 bg-[#FD661F]/20 rounded-full blur-3xl animate-pulse hidden xl:block"></div>
        <div className="absolute bottom-20 right-40 w-64 h-64 bg-[#dcfce7]/20 rounded-full blur-3xl animate-pulse hidden xl:block" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl space-y-8 pt-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              <span className="text-white text-sm font-semibold tracking-wide">Grow-to-Order Platform</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Source Fresh
              <br />
              Produce Directly
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dcfce7] to-emerald-300">
                from Farmers
              </span>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              Define your crop requirements in advance and let verified farmers grow exactly to your needs.
              Build direct, long-term partnerships with complete transparency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/buyer/buy-produces')}
                className="px-8 py-4 bg-[#FD661F] text-white font-semibold rounded-xl hover:bg-[#e55a19] active:scale-[0.97] transition-all duration-200 shadow-xl shadow-[#FD661F]/30 flex items-center gap-2"
              >
                <span>Browse Produce</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/buyer/give-contract')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-all duration-200"
              >
                Give a Contract
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-green-200 text-sm font-medium">Active Farmers</p>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
                <p className="text-3xl font-bold text-white">50+</p>
                <p className="text-green-200 text-sm font-medium">Crop Varieties</p>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-green-200 text-sm font-medium">Transparent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 100V60C240 20 480 0 720 10C960 20 1200 50 1440 60V100H0Z" fill="#F7FAF9" />
          </svg>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#15803d]/10 text-[#15803d] text-sm font-semibold rounded-full">
              Why Farmafriend?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              The smartest way to
              <span className="text-[#15803d]"> source produce</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From buying fresh produce to managing long-term farming contracts, we've built everything you need.
            </p>
          </div>

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

      {/* ── About Section ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#FD661F]/10 text-[#FD661F] text-sm font-semibold rounded-full">
              Our Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Built for <span className="text-[#15803d]">smart procurement</span>
            </h2>
          </div>

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
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to source quality produce?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Join a growing network of buyers sourcing directly from verified farmers with transparent, blockchain-powered contracts.
            </p>
            <button
              onClick={() => navigate('/buyer/buy-produces')}
              className="px-8 py-4 bg-white text-[#15803d] font-bold rounded-xl hover:bg-gray-50 active:scale-[0.97] transition-all duration-200 shadow-xl shadow-black/10"
            >
              Start Sourcing Now →
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
            <a href="/buyer" className="text-gray-400 hover:text-white text-sm transition">Home</a>
            <a href="/buyer/problems" className="text-gray-400 hover:text-white text-sm transition">Support</a>
            <a href="/buyer/my-orders" className="text-gray-400 hover:text-white text-sm transition">Orders</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuyerLandingPage;
