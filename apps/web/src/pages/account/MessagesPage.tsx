import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Store, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ConversationItem {
  id: string;
  vendor: {
    id: string;
    businessName: string;
    logo?: string;
    city: string;
    phone?: string;
  };
  messages: Array<{
    id: string;
    content: string;
    isRead: boolean;
    createdAt: string;
  }>;
  updatedAt: string;
}

interface MessageItem {
  id: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [activeConvDetails, setActiveConvDetails] = useState<any>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    try {
      const res = await api.get('/conversations/me');
      if (res.data.success) {
        setConversations(res.data.data);
        if (res.data.data.length > 0 && !selectedConvId) {
          setSelectedConvId(res.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading tourist conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const loadThread = async (convId: string) => {
    setLoadingThread(true);
    try {
      const res = await api.get(`/conversations/${convId}/messages`);
      if (res.data.success) {
        setActiveConvDetails(res.data.data.conversation);
        setMessages(res.data.data.messages);
      }
    } catch (err) {
      console.error('Error loading thread:', err);
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    if (selectedConvId) {
      loadThread(selectedConvId);
    }
  }, [selectedConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !newMsg.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.post(`/conversations/${selectedConvId}/messages`, {
        content: newMsg.trim()
      });

      if (res.data.success) {
        setMessages(prev => [...prev, res.data.data]);
        setNewMsg('');
        loadConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="border-b border-brand-brown/15 pb-4">
        <span className="sub-nav-label text-brand-maroon">MY ACCOUNT</span>
        <h1 className="text-3xl font-serif text-brand-black font-bold">My Vendor Messages & Inquiries</h1>
      </div>

      {loading ? (
        <div className="py-20 text-center text-brand-brown font-serif">Loading your messages...</div>
      ) : conversations.length === 0 ? (
        <div className="bg-cream/80 p-12 rounded-xl border border-brand-brown/15 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-brand-gold mx-auto" />
          <h3 className="font-serif text-xl text-brand-black">No Messages Yet</h3>
          <p className="text-sm font-serif text-brand-brown/80">
            When you contact local hosts or message vendors about tour offerings, your conversations will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-brown/20 shadow-lg grid grid-cols-1 lg:grid-cols-12 min-h-[550px] overflow-hidden">
          {/* Left Pane: Conversations List */}
          <div className={`lg:col-span-4 border-r border-brand-brown/15 bg-cream/50 flex flex-col ${
            selectedConvId ? 'hidden lg:flex' : 'flex'
          }`}>
            <div className="p-4 border-b border-brand-brown/10 font-serif font-bold text-brand-black text-sm sub-nav-label">
              VENDOR CONVERSATIONS ({conversations.length})
            </div>
            <div className="flex-grow overflow-y-auto divide-y divide-brand-brown/10">
              {conversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                const lastMsg = conv.messages[0];
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full text-left p-4 transition-all flex items-start space-x-3 ${
                      isSelected ? 'bg-white font-semibold border-l-4 border-brand-maroon' : 'hover:bg-cream-light'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-black text-brand-gold flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border border-brand-gold/30">
                      {conv.vendor?.logo ? (
                        <img src={conv.vendor.logo} alt={conv.vendor.businessName} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-5 h-5 text-brand-gold" />
                      )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm text-brand-black truncate">{conv.vendor?.businessName}</span>
                        {lastMsg && (
                          <span className="text-[10px] text-brand-brown/60 shrink-0">
                            {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-brown/80 truncate mt-0.5">
                        {lastMsg ? lastMsg.content : 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pane: Active Thread */}
          <div className={`lg:col-span-8 flex flex-col ${
            !selectedConvId ? 'hidden lg:flex' : 'flex'
          }`}>
            {activeConvDetails ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-brand-brown/15 flex items-center justify-between bg-cream/30 shrink-0">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedConvId(null)}
                      className="lg:hidden p-1.5 text-brand-black hover:bg-cream rounded"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-brand-black text-brand-gold flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-brand-gold/30">
                      {activeConvDetails.vendor?.logo ? (
                        <img src={activeConvDetails.vendor.logo} alt={activeConvDetails.vendor.businessName} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-4 h-4 text-brand-gold" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-brand-black text-sm">{activeConvDetails.vendor?.businessName}</h4>
                      <p className="text-[10px] sub-nav-label text-brand-maroon">{activeConvDetails.vendor?.city}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-grow p-5 overflow-y-auto space-y-4 max-h-[420px]">
                  {loadingThread ? (
                    <div className="py-12 text-center text-xs text-brand-brown">Loading thread...</div>
                  ) : messages.length === 0 ? (
                    <div className="py-12 text-center text-xs text-brand-brown">No messages in this conversation yet.</div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = Boolean(user && (msg.senderId === user.id || (user.vendor && msg.senderId === user.vendor.id)));
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-xs space-y-1 ${
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

                {/* Message Input Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-brand-brown/15 bg-cream/20 flex items-center space-x-3 shrink-0">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type your message to vendor..."
                    className="flex-grow bg-white border border-brand-brown/20 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-gold text-brand-black"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMsg.trim()}
                    className="px-5 py-3 bg-brand-black text-brand-gold rounded-xl hover:bg-brand-maroon hover:text-white transition-all text-xs font-bold sub-nav-label disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">SEND</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-center p-8 text-brand-brown font-serif text-sm">
                Select a vendor conversation from the left pane to view messages.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
