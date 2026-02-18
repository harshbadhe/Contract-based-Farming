import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FarmerNavbar from '../../components/FarmerNavbar';
import BuyerNavbar from '../../components/BuyerNavbar';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const isBuyer = location.pathname.startsWith('/buyer');

  const fetchProblems = () => {
    setLoading(true);
    fetch('http://localhost:5003/api/auth/get-problems')
      .then(res => res.json())
      .then(data => { setProblems(data); setLoading(false); })
      .catch(err => { console.error('Fetch error:', err); setLoading(false); });
  };

  useEffect(() => {
    fetchProblems();
  }, []);

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

  const basePath = isBuyer ? '/buyer' : '/farmer';

  return (
    <div className="min-h-screen bg-gray-50">
      {isBuyer ? <BuyerNavbar /> : <FarmerNavbar />}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Community Forum</h1>
              </div>
              <p className="text-green-100 text-sm ml-[52px]">Post farming problems, share advice, and get help from the community</p>

              {/* Search Bar */}
              <div className="mt-5 ml-[52px] relative max-w-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search posts by keyword or author..."
                  className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-green-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100 py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{problems.length}</span> discussions
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Active Community
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-400 text-sm mb-6">Be the first to share a problem or ask for advice!</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {problems.filter(p =>
              p.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(problem => (
              <Link to={`${basePath}/problems/${problem.id}`} key={problem.id}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-0.5 mb-4">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {problem.userEmail ? problem.userEmail[0].toUpperCase() : 'A'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{problem.userEmail || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">{getTimeAgo(problem.createdAt)}</p>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* Message */}
                    <p className="text-gray-800 text-sm leading-relaxed mb-3 line-clamp-3">{problem.message}</p>

                    {/* Image Preview */}
                    {problem.imageUrl && (
                      <div className="rounded-xl overflow-hidden mb-3 max-h-64 bg-gray-100">
                        <img
                          src={problem.imageUrl}
                          alt="problem"
                          className="w-full h-full object-cover max-h-64"
                        />
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{problem.replies?.length || 0} replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PostProblemModal onClose={() => setShowModal(false)} refresh={fetchProblems} />
      )}
    </div>
  );
};

export default ProblemsPage;

// Post Problem Modal
const PostProblemModal = ({ onClose, refresh }) => {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const userEmail = localStorage.getItem('email');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    const data = new FormData();
    data.append('userEmail', userEmail);
    data.append('message', message);
    if (imageFile) data.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5003/api/auth/post-problem', { method: 'POST', body: data });
      const result = await res.json();
      if (res.ok) {
        setMessage('');
        setImageFile(null);
        setImagePreview(null);
        onClose();
        refresh();
      } else alert('Error: ' + result.error);
    } catch (err) {
      console.error('Post error:', err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Share a Problem</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{userEmail || 'user@email.com'}</p>
              <p className="text-xs text-gray-400">Posting publicly</p>
            </div>
          </div>

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-gray-800 placeholder:text-gray-400 text-sm"
            placeholder="What farming problem are you facing? Share it with the community..."
            rows={4}
            required
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mt-3 rounded-xl overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-gray-500 hover:text-green-600 cursor-pointer transition text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={posting || !message.trim()}
              className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
            >
              {posting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
