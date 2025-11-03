import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
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
      localStorage.setItem('token', result.token); // ✅ already here
      localStorage.setItem('email', email);        // ✅ add this line to save email
      role === 'farmer' ? navigate('/farmer') : navigate('/buyer');
    } else {
      alert('Login failed: ' + result.error);
    }
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    alert('Login failed: ' + error.message);
  }
};

  
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-green-700">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full p-2 mb-4 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Login
          </button>

          <p className="mt-4 text-sm text-gray-600">
            New?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-green-700 underline cursor-pointer hover:text-green-900"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
