import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { io } from 'socket.io-client';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 👋 I'm your EduNest assistant. How can I help you find the perfect institute today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to socket when component mounts
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    socketRef.current.on('chatbot_reply', (data) => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date(data.timestamp)
      }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Format history for OpenAI
    const chatHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Send to server
    socketRef.current.emit('chatbot_message', { 
      message: input,
      history: chatHistory 
    });
  };

  const handleSuggestion = (text) => {
    setInput(text);
    // document.getElementById('chat-input').focus();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight">AI Assistant</h3>
                  <p className="text-brand-100 text-xs">Online | Replies instantly</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-slate-200' : 'bg-brand-100 text-brand-600'}`}>
                      {msg.sender === 'user' ? <User size={16} className="text-slate-500" /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-brand-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                      <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-2 flex-row max-w-[80%]">
                     <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex-shrink-0 flex items-center justify-center mt-1">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && !isTyping && (
               <div className="px-4 pb-2 bg-slate-50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-2 border-t border-slate-100">
                  <button onClick={() => handleSuggestion("Find nearby JEE coaching")} className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors shadow-sm">Find nearby JEE coaching</button>
                  <button onClick={() => handleSuggestion("What are the fees?")} className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors shadow-sm">What are the fees?</button>
               </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-slate-100 border-transparent rounded-full py-2.5 pl-4 pr-12 text-sm text-slate-900 focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center relative shadow-glow z-50"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default Chatbot;
