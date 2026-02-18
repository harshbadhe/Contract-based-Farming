import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatListPage = () => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    fetch(`http://localhost:5003/api/auth/chat/list/${email}`)
      .then(res => res.json())
      .then(data => {
        setChatList(data || []);
      })
      .catch(err => console.error('Failed to fetch chat list:', err))
      .finally(() => setLoading(false));
  }, [email]);

  const filteredChats = chatList.filter(chat => {
    const otherUser = chat.participants.find(p => p !== email);
    return otherUser?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : '?';
  };

  const getAvatarColor = (email) => {
    const colors = [
      'from-green-400 to-emerald-500',
      'from-blue-400 to-indigo-500',
      'from-purple-400 to-pink-500',
      'from-amber-400 to-orange-500',
      'from-teal-400 to-cyan-500',
      'from-rose-400 to-red-500',
    ];
    const index = email ? email.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const SkeletonItem = () => (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded-lg w-2/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Messages</h1>
              <p className="text-green-100 text-sm">
                {!loading && `${chatList.length} conversation${chatList.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-green-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different search term'
                : 'Start a conversation by contacting a farmer or buyer'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filteredChats.map((chat, index) => {
              const otherUser = chat.participants.find(p => p !== email);
              return (
                <div
                  key={chat.id}
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-all duration-150 ${index !== filteredChats.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                  onClick={() => navigate(`/chatbox/${otherUser}`)}
                >
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(otherUser)} flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <span className="text-white font-bold text-lg">{getInitial(otherUser)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-semibold text-gray-900 truncate">{otherUser}</h4>
                      {chat.timestamp && (
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {new Date(chat.timestamp?.seconds ? chat.timestamp.seconds * 1000 : chat.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage || 'No messages yet'}</p>
                  </div>

                  {/* Arrow */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListPage;
