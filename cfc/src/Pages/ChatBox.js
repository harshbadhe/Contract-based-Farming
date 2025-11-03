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

  // Fetch chat messages for this contract with polling (every 2 seconds)
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
    const interval = setInterval(fetchMessages, 5000); // Poll every 2 seconds

    // Cleanup function
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

      setNewMsg('');
      // No need for optimistic update, polling refreshes messages
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !sending) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border rounded-lg p-4 max-w-4xl mx-auto bg-white shadow-lg flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-3 text-green-700">Chat</h3>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-gray-50 p-3 rounded">
        {loading && <p className="text-center text-gray-500">Loading messages...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && messages.length === 0 && (
          <p className="text-center text-gray-400">No messages yet</p>
        )}

        {messages.map((msg, idx) => {
          const isSender = msg.senderEmail === currentUserEmail;
          return (
            <div key={msg.id || idx} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg break-words whitespace-pre-wrap ${
                  isSender ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-900'
                }`}
              >
                <p>{msg.messageText}</p>
                <span className="text-xs text-gray-200 block mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          rows={1}
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
          onKeyDown={handleKeyDown}
          disabled={sending}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !newMsg.trim()}
          className={`px-4 py-2 rounded text-white transition ${
            sending || !newMsg.trim()
              ? 'bg-green-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
