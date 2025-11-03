import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProblemDetailsPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [reply, setReply] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5003/api/auth/get-problems')
      .then(res => res.json())
      .then(data => setProblem(data.find(p => p.id === id)))
      .catch(err => console.error('Fetch error:', err));
  }, [id]);

  const handleAddReply = async () => {
    if (!reply.trim()) return alert('Reply cannot be empty.');
    try {
      const res = await fetch(`http://localhost:5003/api/auth/problems/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply })
      });

      const result = await res.json();
      if (res.ok) {
        alert('Reply added!');
        setProblem(prev => ({ ...prev, replies: [...(prev.replies || []), reply] }));
        setReply('');
      } else {
        alert('Failed: ' + result.error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong!');
    }
  };

  if (!problem) return <p className="text-center py-10 text-gray-900">Loading...</p>;

  return (
    <div className="bg-white min-h-screen text-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col p-4 h-screen overflow-hidden">
        <h1 className="text-2xl font-bold mb-6">🌾 Farmafriend</h1>
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

      {/* Main Content */}
      <div className="flex-1 flex justify-center overflow-y-auto h-screen">
        <div className="w-full max-w-2xl border-x border-gray-300 min-h-screen flex flex-col">
          {/* Main Problem */}
          <div className="p-6 border-b border-gray-300">
            <div className="flex gap-3 items-center mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
                {problem.userEmail ? problem.userEmail[0].toUpperCase() : 'A'}
              </div>
              <div>
                <div className="font-semibold">{problem.userEmail || 'Anonymous'}</div>
                <div className="text-xs text-gray-500">
                  {problem.createdAt ? new Date(problem.createdAt.seconds * 1000).toLocaleString() : ''}
                </div>
              </div>
            </div>
            <div className="text-xl mb-2">{problem.message}</div>
            {problem.imageUrl && (
              <img src={problem.imageUrl} alt="problem" className="w-full mt-3 rounded-lg object-cover max-h-80" />
            )}
          </div>

          {/* Replies */}
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            {problem.replies?.length > 0 ? (
              problem.replies.map((r, idx) => (
                <div key={idx} className="flex gap-3 py-4 border-b border-gray-300">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                    R
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">User</div>
                    <div className="text-gray-900">{r}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center my-8">No replies yet.</p>
            )}
          </div>

          {/* Reply Input */}
          <div className="px-6 py-4 border-t border-gray-300 flex gap-3 sticky bottom-0 bg-white">
            <input
              type="text"
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-gray-100 text-gray-900 p-2 rounded-full outline-none border border-gray-300 focus:border-green-600"
            />
            <button
              onClick={handleAddReply}
              className="bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 font-semibold text-white transition"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsPage;
