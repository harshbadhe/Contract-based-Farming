import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const buyerEmail = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (!buyerEmail) {
      alert('No buyer email found in localStorage!');
      return;
    }

    fetch(`http://localhost:5003/api/auth/get-cart?buyerEmail=${buyerEmail}`)
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        const calculatedTotal = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(calculatedTotal);
      })
      .catch(err => console.error('❌ Failed to fetch cart:', err));
  }, [buyerEmail]);

  const handleRemove = async (indexToRemove) => {
    try {
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
        alert('Item removed from cart');
        // Filter out the removed item locally
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
    }
  };

  const goToDetails = (name) => {
    navigate(`/produce/${name}`);
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navigation */}
      <nav className="bg-green-700 text-white px-6 py-4">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo */}
    <h1 className="text-xl font-bold">AgriConnect</h1>

    {/* Navigation Links */}
    <ul className="hidden md:flex gap-16 font-medium">
      <li><a href="/buyer" className="hover:underline">Home</a></li>
      <li><a href="/buyer/buy-produces" className="hover:underline">Buy Produces</a></li>
      
      <li><a href="/buyer/give-contract" className="hover:underline">Give Contract</a></li>
      <li><a href="/buyer/my-orders" className="hover:underline">My Orders</a></li>
      <li><a href="/buyer/problems" className="hover:underline">Problems</a></li>
      <li><a href="/buyer/cart" className="hover:underline">Cart</a></li>
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


    
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">🛒 My Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center border rounded p-4">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border cursor-pointer hover:scale-110 transition"
                    onClick={() => goToDetails(item.name)}
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => goToDetails(item.name)}>
                    <h2 className="font-bold text-green-700 hover:underline">{item.name}</h2>
                    <p className="text-sm text-gray-600">{item.quantity} kg</p>
                    <p className="font-semibold text-green-700">₹ {item.price} per 10kg</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-lg text-green-700">
                      ₹ {item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="mt-2 bg-red-500 text-white px-4 py-1 rounded shadow hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Total:</h2>
              <p className="text-2xl font-bold text-green-700">₹ {total}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
