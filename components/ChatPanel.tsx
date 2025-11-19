import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isThinking: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isThinking }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="absolute top-6 right-6 z-40 w-96 h-[500px] glass-panel rounded-xl flex flex-col overflow-hidden font-sans">
       {/* Header */}
       <div className="bg-white/5 p-3 border-b border-white/10 flex justify-between items-center">
         <span className="font-mono-space text-xs text-pink-300 tracking-widest uppercase">✦ Telepathy Link ✦</span>
         <div className="flex gap-1">
           <div className="w-2 h-2 rounded-full bg-red-400"></div>
           <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
           <div className="w-2 h-2 rounded-full bg-green-400"></div>
         </div>
       </div>

       {/* Messages */}
       <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
         {messages.map((msg, i) => (
           <div 
             key={i} 
             className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
           >
             <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed backdrop-blur-sm shadow-lg ${
                 msg.sender === 'user' 
                 ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-50 rounded-2xl rounded-tr-none' 
                 : msg.sender === 'system'
                 ? 'text-cyan-300/70 text-xs text-center w-full font-mono-space my-2 border-y border-cyan-500/10 py-1'
                 : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-50 rounded-2xl rounded-tl-none'
             }`}>
               {msg.text}
             </div>
           </div>
         ))}
         {isThinking && (
             <div className="flex justify-start items-center gap-2 p-2">
                 <span className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"></span>
                 <span className="w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-100"></span>
                 <span className="w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-200"></span>
             </div>
         )}
       </div>

       {/* Input */}
       <form onSubmit={handleSubmit} className="p-3 bg-black/20 border-t border-white/10">
         <div className="flex gap-2">
             <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Project thoughts..."
             className="flex-1 px-4 py-2 rounded-lg text-sm bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-pink-400/50 focus:bg-white/15 transition-all font-mono-space"
             />
             <button 
                 type="submit" 
                 disabled={isThinking}
                 className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-bold hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
                 SEND
             </button>
         </div>
       </form>
    </div>
  );
};

export default ChatPanel;