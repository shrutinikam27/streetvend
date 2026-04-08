import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUserTie, FaCheckDouble } from 'react-icons/fa';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to Vendorverse Support. How can we help you today?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  const getBotResponse = (text) => {
    const t = text.toLowerCase();
    if (t.includes('hello') || t.includes('hi')) return "Hi there! I'm your StreetVend assistant. Are you looking for a supplier or tracking an order?";
    if (t.includes('track') || t.includes('order')) return "You can track your order in real-time from your Dashboard or by clicking the truck icon on the homepage!";
    if (t.includes('supplier')) return "We have over 400 verified suppliers! You can find them in the 'Find Suppliers' section.";
    if (t.includes('price')) return "Our platform allows you to compare real-time prices. Just select a product in your dashboard!";
    return "That's a great question! Let me connect you with a specialist. One moment please...";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce cursor-pointer group"
        >
          <FaComments className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">1</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl backdrop-blur-md">
                  <FaUserTie />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-orange-500"></div>
              </div>
              <div>
                <h3 className="font-black text-lg leading-none">Support Agent</h3>
                <p className="text-xs text-orange-100 mt-1 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Active Now
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-orange-500 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className={`text-[10px] mt-2 flex items-center ${msg.sender === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && <FaCheckDouble className="ml-1.5" />}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSend}
            className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none"
            />
            <button 
              type="submit"
              className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
            >
              <FaPaperPlane className="transform -rotate-12" />
            </button>
          </form>
          
          <div className="pb-3 text-center">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by StreetVend AI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
