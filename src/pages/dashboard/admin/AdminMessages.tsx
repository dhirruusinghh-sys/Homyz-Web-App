import { useState } from 'react';
import { Search, Send, CheckCircle, ShieldAlert, MoreVertical } from 'lucide-react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getAdminMessages } from '../../../features/admin/adminSlice';

export default function AdminMessages() {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isLoading } = useSelector((state: RootState) => state.admin);
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAdminMessages());
  }, [dispatch]);

  // Group messages by sender to create conversations
  const conversationsMap = new Map();
  messages?.forEach((msg) => {
    const senderId = msg.sender?._id;
    if (!senderId) return;
    
    if (!conversationsMap.has(senderId)) {
      conversationsMap.set(senderId, {
        id: senderId,
        userName: msg.sender?.name || 'Unknown User',
        userRole: 'user', // We don't have role populated in message sender yet
        avatar: 'https://via.placeholder.com/150',
        subject: `Property Inquiry`,
        lastMessage: msg.content,
        time: new Date(msg.createdAt).toLocaleDateString(),
        unread: msg.status === 'unread' ? 1 : 0,
        status: 'open',
        messages: []
      });
    }
    const conv = conversationsMap.get(senderId);
    conv.messages.push({
      id: msg._id,
      text: msg.content,
      sender: 'user', // assuming they are from user to admin
      time: new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
  });

  const supportConversations = Array.from(conversationsMap.values());
  
  // Set default active chat if none selected
  useEffect(() => {
    if (supportConversations.length > 0 && !activeChat) {
      setActiveChat(supportConversations[0].id);
    }
  }, [supportConversations, activeChat]);

  const activeUser = supportConversations.find(c => c.id === activeChat);
  const currentSupportChat = activeUser?.messages || [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Inbox</h1>
        <p className="text-sm text-gray-500">Manage support tickets and messages from users and agents</p>
      </div>

      <div className="h-[calc(100vh-180px)] bg-white rounded-2xl shadow-sm border border-gray-200 flex overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Sidebar - Ticket List */}
        <div className="w-full md:w-96 border-r border-gray-100 flex flex-col hidden md:flex shrink-0 bg-gray-50/30">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tickets by user or subject..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {supportConversations.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${activeChat === chat.id ? 'bg-blue-50/50 border-l-4 border-l-primary' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-start gap-3">
                  <img src={chat.avatar} alt={chat.userName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{chat.userName}</h4>
                      <span className="text-xs text-gray-400 shrink-0">{chat.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        chat.userRole === 'agent' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {chat.userRole}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        chat.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {chat.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-900 mb-1 truncate">{chat.subject}</p>
                    <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        {activeUser ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="h-20 px-6 border-b border-gray-100 flex justify-between items-center shrink-0 bg-white">
              <div className="flex items-center gap-4">
                <img src={activeUser.avatar} alt={activeUser.userName} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-gray-900">{activeUser.userName}</h3>
                  <p className="text-xs text-primary font-medium">{activeUser.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {activeUser.status === 'open' ? (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors">
                    <CheckCircle className="w-4 h-4" /> Mark Resolved
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                    <ShieldAlert className="w-4 h-4" /> Reopen Ticket
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              <div className="text-center">
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Ticket Opened • {activeUser.time}</span>
              </div>
              
              {currentSupportChat.map((msg: any) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-end gap-2 mb-1">
                    {msg.sender === 'user' && <img src={activeUser.avatar} className="w-6 h-6 rounded-full" alt="" />}
                    <span className="text-xs text-gray-500 font-medium">{msg.sender === 'admin' ? 'You (Support)' : activeUser.userName}</span>
                  </div>
                  <div 
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                      msg.sender === 'admin' 
                        ? 'bg-primary text-white rounded-tr-sm shadow-sm' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              {activeUser.status === 'resolved' ? (
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500">This ticket has been resolved. You cannot send further messages unless it is reopened.</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <input 
                    type="text" 
                    placeholder="Type a reply to the user..." 
                    className="flex-1 bg-transparent border-none outline-none px-3 text-sm"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setMessage('')}
                  />
                  <button 
                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
                    onClick={() => setMessage('')}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a support ticket to reply</p>
          </div>
        )}
      </div>
    </div>
  );
}
