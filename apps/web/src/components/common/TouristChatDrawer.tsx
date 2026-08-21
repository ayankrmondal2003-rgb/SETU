import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Store, MessageSquare } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface TouristChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  vendorLogo?: string;
  initialOfferingTitle?: string;
}

export const TouristChatDrawer: React.FC<TouristChatDrawerProps> = ({
  isOpen,
  onClose,
  vendorId,
  vendorName,
  vendorLogo,
  initialOfferingTitle
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState(
    initialOfferingTitle ? `Hello! I have a question regarding "${initialOfferingTitle}".` : ''
  );
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen || !vendorId) return;

    if (!user) {
      onClose();
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    async function initChat() {
      setLoading(true);
      try {
        const res = await api.post('/conversations', { vendorId });
        if (res.data.success) {
          setConversationId(res.data.data.conversation.id);
          setMessages(res.data.data.messages || []);
        }
      } catch (err) {
        console.error('Error initializing conversation:', err);
      } finally {
        setLoading(false);
      }
    }

    initChat();
  }, [isOpen, vendorId, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || sending) return;

    setSending(true);
    try {
      if (conversationId) {
        const res = await api.post(`/conversations/${conversationId}/messages`, {
          content: inputMsg.trim()
        });
        if (res.data.success) {
          setMessages(prev => [...prev, res.data.data]);
          setInputMsg('');
        }
      } else {
        const res = await api.post('/conversations', {
          vendorId,
          message: inputMsg.trim()
        });
        if (res.data.success) {
          setConversationId(res.data.data.conversation.id);
          setMessages(res.data.data.messages || []);
          setInputMsg('');
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between p-6 border-l border-brand-brown/20 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-brown/15 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-black text-brand-gold flex items-center justify-center font-bold font-serif text-base border border-brand-gold/40 shrink-0 overflow-hidden">
              {vendorLogo ? (
                <img src={vendorLogo} alt={vendorName} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-5 h-5 text-brand-gold" />
              )}
            </div>
            <div>
              <h3 className="font-serif font-bold text-brand-black text-lg leading-snug">{vendorName}</h3>
              <p className="text-[10px] sub-nav-label text-brand-maroon">VERIFIED TOURISM VENDOR</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-brand-black/60 hover:text-brand-black">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message Thread Body */}
        <div className="flex-grow my-4 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="py-20 text-center text-xs text-brand-brown font-serif">Opening chat thread...</div>
          ) : messages.length === 0 ? (
            <div className="bg-cream/70 p-6 rounded-xl border border-brand-brown/15 text-center space-y-2 my-8">
              <MessageSquare className="w-6 h-6 text-brand-gold mx-auto" />
              <p className="font-serif text-sm text-brand-black font-bold">Start an inquiry with {vendorName}</p>
              <p className="text-xs font-serif text-brand-brown/80">
                Ask about availability, custom itineraries, group discounts, or special accommodations.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = Boolean(user && (msg.senderId === user.id || (user.vendor && msg.senderId === user.vendor.id)));
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs space-y-1 ${
                    isMe
                      ? 'bg-brand-black text-cream rounded-br-none'
                      : 'bg-cream text-brand-black border border-brand-brown/15 rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                    <span className={`text-[9px] block text-right ${isMe ? 'text-brand-gold/70' : 'text-brand-brown/60'}`}>
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-brand-brown/15 flex items-center space-x-2 shrink-0">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type your message to vendor..."
            className="flex-grow bg-cream/70 border border-brand-brown/20 rounded-xl p-3 text-xs text-brand-black focus:outline-none focus:border-brand-gold focus:bg-white"
          />
          <button
            type="submit"
            disabled={sending || !inputMsg.trim()}
            className="px-4 py-3 bg-brand-black text-brand-gold rounded-xl hover:bg-brand-maroon hover:text-white transition-all text-xs font-bold sub-nav-label disabled:opacity-50 flex items-center space-x-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>SEND</span>
          </button>
        </form>
      </div>
    </div>
  );
};
