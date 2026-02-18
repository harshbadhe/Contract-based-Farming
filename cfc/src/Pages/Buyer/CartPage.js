import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [removingIdx, setRemovingIdx] = useState(null);

  const buyerEmail = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (!buyerEmail) {
      alert('No buyer email found in localStorage!');
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5003/api/auth/get-cart?buyerEmail=${buyerEmail}`)
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        const calculatedTotal = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(calculatedTotal);
      })
      .catch(err => console.error('❌ Failed to fetch cart:', err))
      .finally(() => setLoading(false));
  }, [buyerEmail]);

  const handleRemove = async (indexToRemove) => {
    try {
      setRemovingIdx(indexToRemove);
      const itemToDelete = cartItems[indexToRemove];

      const res = await fetch(`http://localhost:5003/api/auth/remove-from-cart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail: buyerEmail,
          name: itemToDelete.name,
          imageUrl: itemToDelete.imageUrl,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        const updatedItems = cartItems.filter((_, idx) => idx !== indexToRemove);
        setCartItems(updatedItems);
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);
      } else {
        alert('Failed to remove: ' + result.error);
      }
    } catch (err) {
      console.error('❌ Remove failed:', err);
      alert('Failed to remove item');
    } finally {
      setRemovingIdx(null);
    }
  };

  const goToDetails = (name) => {
    navigate(`/produce/${name}`);
  };

  const SkeletonItem = () => (
    <div className="flex gap-5 p-5 animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded-lg w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-1/5"></div>
      </div>
      <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Cart</h1>
              <p className="text-green-100 text-sm">
                {!loading && `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in cart`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              Browse fresh produce from local farmers and add items to your cart
            </p>
            <button
              onClick={() => navigate('/buyer/buy-produces')}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Produce
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Cart Items</h2>
              </div>

              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex gap-5 p-5 hover:bg-gray-50/50 transition-all ${idx !== cartItems.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                >
                  {/* Product Image */}
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => goToDetails(item.name)}
                  />

                  {/* Product Details */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => goToDetails(item.name)}
                  >
                    <h3 className="text-lg font-bold text-gray-900 hover:text-green-600 transition">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        {item.quantity} kg
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">₹{item.price} per 10kg</span>
                    </div>
                    <p className="text-lg font-bold text-green-600 mt-2">₹{item.price * item.quantity}</p>
                  </div>

                  {/* Remove Button */}
                  <div className="flex items-start">
                    <button
                      onClick={() => handleRemove(idx)}
                      disabled={removingIdx === idx}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      {removingIdx === idx ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                  <span className="font-medium text-gray-700">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transport</span>
                  <span className="font-medium text-gray-700">Calculated at checkout</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
