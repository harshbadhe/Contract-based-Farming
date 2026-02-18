import React, { useEffect, useState, useRef } from 'react';

const ChatBox = ({ currentUserEmail, otherUserEmail, contractId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat messages with polling
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        if (isMounted) setLoading(true);
        if (isMounted) setError(null);

        const res = await fetch(`http://localhost:5003/api/auth/chat-messages/${contractId}`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        if (isMounted) setMessages(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [contractId]);

  // Send new message
  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    setSending(true);
    const messageObj = {
      contractId,
      senderEmail: currentUserEmail,
      receiverEmail: otherUserEmail,
      messageText: newMsg.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:5003/api/auth/chat-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageObj),
      });

      if (!res.ok) throw new Error('Failed to send message');

      // Optimistic update
      setMessages(prev => [...prev, { ...messageObj, id: Date.now() }]);
      setNewMsg('');
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !sending) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitial = (email) => email ? email.charAt(0).toUpperCase() : '?';

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

  // Group messages by date
  const getDateLabel = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  let lastDateLabel = '';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ height: '520px' }}>
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(otherUserEmail)} flex items-center justify-center shadow-sm`}>
            <span className="text-white font-bold">{getInitial(otherUserEmail)}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{otherUserEmail}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/50" style={{ scrollBehavior: 'smooth' }}>
          {loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="text-sm text-gray-400">Loading messages...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          {!loading && messages.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-3xl">👋</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Start a conversation</p>
              <p className="text-xs text-gray-400 mt-1">Send a message to begin chatting</p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isSender = msg.senderEmail === currentUserEmail;
            const dateLabel = getDateLabel(msg.timestamp);
            const showDate = dateLabel !== lastDateLabel;
            lastDateLabel = dateLabel;

            return (
              <React.Fragment key={msg.id || idx}>
                {/* Date Separator */}
                {showDate && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-400 font-medium px-2">{dateLabel}</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {!isSender && (
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(msg.senderEmail)} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-bold">{getInitial(msg.senderEmail)}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2.5 break-words whitespace-pre-wrap ${isSender
                        ? 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl rounded-br-md shadow-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-md shadow-sm'
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.messageText}</p>
                    <span className={`text-[10px] block mt-1 text-right ${isSender ? 'text-green-200' : 'text-gray-400'
                      }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                rows={1}
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition resize-none pr-12"
                onKeyDown={handleKeyDown}
                disabled={sending}
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={sending || !newMsg.trim()}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${sending || !newMsg.trim()
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md active:scale-95'
                }`}
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
