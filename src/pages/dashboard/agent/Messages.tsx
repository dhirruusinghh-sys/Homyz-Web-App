import { useState, useEffect, useMemo } from 'react';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../context/SocketContext';
import { fetchMessages, sendMessage, addMessage } from '../../../features/messages/messageSlice';
import type { AppDispatch, RootState } from '../../../app/store';

export default function Messages() {
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((state: RootState) => state.messages);
  const { user } = useSelector((state: RootState) => state.auth);
  const { socket } = useSocket();

  const [messageText, setMessageText] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('messageReceived', (newMessage) => {
        dispatch(addMessage(newMessage));
      });
    }
    return () => {
      if (socket) socket.off('messageReceived');
    };
  }, [socket, dispatch]);

  // Group messages by user (conversations)
  const conversations = useMemo(() => {
    const map = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.sender._id === user?._id ? msg.receiver : msg.sender;
      if (!otherUser) return;
      if (!map.has(otherUser._id)) {
        map.set(otherUser._id, {
          id: otherUser._id,
          customerName: otherUser.name,
          avatar: otherUser.avatar || 'https://via.placeholder.com/150',
          lastMessage: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: 0,
          online: true,
        });
      } else {
        const existing = map.get(otherUser._id);
        existing.lastMessage = msg.content;
        existing.time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    });
    return Array.from(map.values());
  }, [messages, user]);

  const activeCustomer = conversations.find(c => c.id === activeChatId);

  // Filter current chat messages
  const currentChat = messages.filter(
    (msg) =>
      (msg.sender._id === user?._id && msg.receiver._id === activeChatId) ||
      (msg.sender._id === activeChatId && msg.receiver._id === user?._id)
  );

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChatId) return;
    
    const text = messageText;
    setMessageText('');
    
    const resultAction = await dispatch(sendMessage({ receiverId: activeChatId, content: text }));
    
    if (sendMessage.fulfilled.match(resultAction)) {
      if (socket) {
        socket.emit('newMessage', resultAction.payload);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-80 border-r border-gray-100 flex flex-col hidden md:flex shrink-0 bg-gray-50/30">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No conversations yet.</p>
          )}
          {conversations.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img src={chat.avatar} alt={chat.customerName} className="w-12 h-12 rounded-full object-cover" />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-semibold text-gray-900 truncate">{chat.customerName}</h4>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeCustomer ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-gray-100 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <img src={activeCustomer.avatar} alt={activeCustomer.customerName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-900">{activeCustomer.customerName}</h3>
                <p className="text-xs text-gray-500">{activeCustomer.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <button className="hover:text-primary transition-colors"><Phone className="w-5 h-5" /></button>
              <button className="hover:text-primary transition-colors"><Video className="w-5 h-5" /></button>
              <button className="hover:text-gray-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 flex flex-col">
            {currentChat.map((msg) => (
              <div key={msg._id} className={`flex flex-col ${msg.sender._id === user?._id ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                    msg.sender._id === user?._id 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
}
