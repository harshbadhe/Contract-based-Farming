import React, { useState } from 'react';

const FarmerNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: 'Home', href: '/farmer' },
        { label: 'Sell Produces', href: '/farmer/sell-produces' },
        { label: 'Harvest Produces', href: '/farmer/going-to-harvest' },
        { label: 'Problems', href: '/farmer/problems' },
        { label: 'My Listings', href: '/farmer/mylistings' },
        { label: 'My Orders', href: '/farmer/my-orders' },
        { label: 'Contracts', href: '/farmer/final-contracts' },
    ];

    return (
        <nav className="bg-green-700 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <a href="/farmer" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-lg group-hover:scale-110 transition-transform">🌾</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Farmafriend</span>
                </a>

                {/* Desktop Nav Links */}
                <ul className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Profile + Mobile Toggle */}
                <div className="flex items-center gap-3">
                    <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 text-white text-sm font-medium hover:bg-white/25 border border-white/20 transition-all duration-200">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">👤</div>
                        Profile
                    </button>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition"
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
                <div className="lg:hidden bg-green-800 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="block px-4 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default FarmerNavbar;
