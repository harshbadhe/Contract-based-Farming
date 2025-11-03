import React from 'react';
//import farmImg1 from '/assets/bgforlogin.jpg';
//import farmImg2 from '../assets/farm2.jpg';
//import farmImg3 from '../assets/farm3.jpg';

const BuyerLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-green-700 text-white px-6 py-4">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo */}
    <h1 className="text-xl font-bold">Farmafriend</h1>

    {/* Navigation Links */}
    <ul className="hidden md:flex gap-16 font-medium">
      <li><a href="/buyer" className="hover:underline">Home</a></li>
      <li><a href="/buyer/buy-produces" className="hover:underline">Buy Produces</a></li>
      
      <li><a href="/buyer/give-contract" className="hover:underline">Give Contract</a></li>
            

      <li><a href="/buyer/my-orders" className="hover:underline">My Orders</a></li>
      <li><a href="/buyer/problems" className="hover:underline">Problems</a></li>
      <li><a href="/buyer/final-contracts" className="hover:underline">final contract</a></li>
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


      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 bg-green-100 px-4">
        <button className="mb-6 bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition">
          Give Contract
        </button>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold  text-green-800 max-w-4xl leading-snug font-family: 'Raleway'">
        Grow-to-Order Farming for Your Organization's Needs
        </h2>
        <p className="text-gray-700 mt-4 max-w-2xl text-sm sm:text-base">
        Define your crop requirements in advance and let verified farmers grow exactly to your needs. Build direct, long-term partnerships that ensure consistent supply, improved quality, and complete transparency throughout the farming cycle.
          </p>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-6 bg-white">
        <h3 className="text-3xl font-bold text-center text-green-700 mb-12">About Us</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Image 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/assets/comm3.jpg" alt="Farming" className="w-full h-56 object-cover" />
            <div className="p-4">
              <h4 className="text-xl font-semibold text-green-700">Empowering Farmers</h4>
              <p className="text-sm text-gray-600 mt-2">
                We aim to build a direct link between farmers and markets, reducing dependency on middlemen.
              </p>
            </div>
          </div>

          {/* Image 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/assets/comm4.jpg" alt="Seeds and fertilizers" className="w-full h-56 object-cover" />
            <div className="p-4">
              <h4 className="text-xl font-semibold text-green-700">Smart Supply Access</h4>
              <p className="text-sm text-gray-600 mt-2">
                From seeds to fertilizers, find everything you need in one place, tailored to your crop needs.
              </p>
            </div>
          </div>

          {/* Image 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/assets/comm2.jpg" alt="Farmer support" className="w-full h-56 object-cover" />
            <div className="p-4">
              <h4 className="text-xl font-semibold text-green-700">Community Support</h4>
              <p className="text-sm text-gray-600 mt-2">
                Share your problems, get solutions from other farmers and experts in the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyerLandingPage;
