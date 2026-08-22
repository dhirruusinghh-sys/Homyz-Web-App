import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../features/messages/messageSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface MessageAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: any;
  propertyTitle: string;
}

export default function MessageAgentModal({ isOpen, onClose, agent, propertyTitle }: MessageAgentModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !agent?._id) return;
    
    // Add property reference to the first message for context
    const fullMessage = `Regarding: ${propertyTitle}\n\n${message}`;
    
    await dispatch(sendMessage({ receiverId: agent._id, content: fullMessage }));
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Message Agent</h3>
                <p className="text-xs text-gray-500">To: {agent?.name || 'Agent'}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {!user ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">Please log in to message the agent.</p>
                <a href="/login" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-bold">Log In</a>
              </div>
            ) : isSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">The agent will reply to you shortly. You can check your dashboard messages.</p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                  <textarea 
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm"
                    placeholder={`Hi ${agent?.name || 'there'},\n\nI am interested in this property and would like to know more...`}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
