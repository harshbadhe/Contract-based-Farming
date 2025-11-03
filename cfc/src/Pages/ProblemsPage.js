import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProblems = () => {
    fetch('http://localhost:5003/api/auth/get-problems')
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col p-4 h-screen overflow-hidden">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span role="img" aria-label="logo"></span> Farmafriend
        </h1>
        <nav className="flex flex-col gap-4">
          <a href="/farmer" className="hover:text-green-600">Home</a>
          <a href="/farmer/sell-produces" className="hover:text-green-600">Sell Produces</a>
          <a href="/farmer/my-listings" className="hover:text-green-600">My Listings</a>
          <a href="/farmer/problems" className="text-green-700 font-semibold">Problems</a>
        </nav>
        <button 
          onClick={() => setShowModal(true)}
          className="mt-auto bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700"
        >
          Post
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 flex justify-center overflow-y-auto h-screen">
        <div className="w-full max-w-2xl p-6">
          {problems.length === 0 && (
            <p className="text-center text-gray-500">No problems posted yet.</p>
          )}

          {problems.map(problem => (
            <Link to={`/farmer/problems/${problem.id}`} key={problem.id}>
              <div className="bg-gray-50 rounded-xl p-5 mb-6 hover:bg-gray-100 cursor-pointer transition-all shadow-md">
                {/* Top row: user + time */}
                <div className="flex justify-between items-center text-gray-500 text-xs mb-2">
                  <span>{problem.userEmail || 'Anonymous'}</span>
                  <span>
                    {problem.createdAt && problem.createdAt.seconds
                      ? new Date(problem.createdAt.seconds * 1000).toLocaleString()
                      : ''}
                  </span>
                </div>

                <p className="text-base mb-3">{problem.message}</p>

                {problem.imageUrl && (
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-200 border border-gray-300">
                    <img
                      src={problem.imageUrl}
                      alt="problem"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Replies count below */}
                <p className="text-xs text-gray-400 mt-2">{problem.replies?.length || 0} replies</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showModal && (
        <PostProblemModal onClose={() => setShowModal(false)} refresh={fetchProblems} />
      )}
    </div>
  );
};

export default ProblemsPage;

// Modal with light theme styles
const PostProblemModal = ({ onClose, refresh }) => {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const userEmail = localStorage.getItem('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('userEmail', userEmail);
    data.append('message', message);
    if (imageFile) data.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5003/api/auth/post-problem', { method: 'POST', body: data });
      const result = await res.json();
      if (res.ok) {
        alert('Posted!');
        setMessage('');
        setImageFile(null);
        onClose();
        refresh();
      } else alert('Error: ' + result.error);
    } catch (err) {
      console.error('Post error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 rounded-lg w-96 p-4 relative shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-3 text-2xl font-bold hover:text-gray-600">&times;</button>
        <h2 className="text-lg font-bold mb-3">What's happening?</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-2 resize-none focus:outline-green-500"
            placeholder="Describe your problem..."
            rows={4}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            className="mb-2"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-full w-full hover:bg-green-700 transition">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};
