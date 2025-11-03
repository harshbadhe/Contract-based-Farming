// src/Pages/ChatListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatListPage = () => {
  const [chatList, setChatList] = useState([]);
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) return;

    fetch(`http://localhost:5003/api/auth/chat/list/${email}`)
      .then(res => res.json())
      .then(setChatList)
      .catch(err => console.error('Failed to fetch chat list:', err));
  }, [email]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-green-700 mb-4">Chats</h2>
      <div className="space-y-3">
        {chatList.map(chat => {
          const otherUser = chat.participants.find(p => p !== email);
          return (
            <div
              key={chat.id}
              className="bg-white shadow-md p-3 rounded cursor-pointer hover:bg-green-50"
              onClick={() => navigate(`/chatbox/${otherUser}`)}
            >
              <p className="font-semibold">{otherUser}</p>
              <p className="text-sm text-gray-600">{chat.lastMessage}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatListPage;
