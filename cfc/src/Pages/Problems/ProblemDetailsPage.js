import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import FarmerNavbar from '../../components/FarmerNavbar';
import BuyerNavbar from '../../components/BuyerNavbar';

const ProblemDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const isBuyer = location.pathname.startsWith('/buyer');
  const [problem, setProblem] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const userEmail = localStorage.getItem('email');
  const basePath = isBuyer ? '/buyer' : '/farmer';

  useEffect(() => {
    fetch('http://localhost:5003/api/auth/get-problems')
      .then(res => res.json())
      .then(data => setProblem(data.find(p => p.id === id)))
      .catch(err => console.error('Fetch error:', err));
  }, [id]);

  const handleAddReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`http://localhost:5003/api/auth/problems/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply })
      });

      const result = await res.json();
      if (res.ok) {
        setProblem(prev => ({ ...prev, replies: [...(prev.replies || []), reply] }));
        setReply('');
      } else {
        alert('Failed: ' + result.error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong!');
    } finally {
      setSending(false);
    }
  };

  const getTimeAgo = (createdAt) => {
    if (!createdAt?.seconds) return '';
    const diff = Date.now() - createdAt.seconds * 1000;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (!problem) return (
    <div className="min-h-screen bg-gray-50">
      {isBuyer ? <BuyerNavbar /> : <FarmerNavbar />}
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {isBuyer ? <BuyerNavbar /> : <FarmerNavbar />}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm">
          <Link to={`${basePath}/problems`} className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Community Forum
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500 truncate max-w-[200px]">{problem.message?.substring(0, 30)}...</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Main Post Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                {problem.userEmail ? problem.userEmail[0].toUpperCase() : 'A'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{problem.userEmail || 'Anonymous'}</p>
                <p className="text-xs text-gray-400">{getTimeAgo(problem.createdAt)}</p>
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-800 text-base leading-relaxed mb-4">{problem.message}</p>

            {/* Image */}
            {problem.imageUrl && (
              <div className="rounded-xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={problem.imageUrl}
                  alt="problem"
                  className="w-full object-cover max-h-96 rounded-xl"
                />
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{problem.replies?.length || 0} replies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Replies ({problem.replies?.length || 0})
          </h3>

          {problem.replies?.length > 0 ? (
            <div className="space-y-3">
              {problem.replies.map((r, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      R
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-700">Community Member</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">Reply #{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{r}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-gray-400 text-sm">No replies yet. Be the first to help!</p>
            </div>
          )}
        </div>

        {/* Reply Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky bottom-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddReply(); } }}
                placeholder="Write a helpful reply..."
                className="flex-1 bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm placeholder:text-gray-400"
              />
              <button
                onClick={handleAddReply}
                disabled={sending || !reply.trim()}
                className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsPage;
