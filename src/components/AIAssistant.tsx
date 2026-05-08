import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const FlickeringDiya = () => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className="w-12 h-12 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
  >
    {/* Diya Base - Traditional Clay Feel */}
    <path 
      d="M20 60 Q20 85 50 85 Q80 85 80 60 L75 55 Q50 65 25 55 Z" 
      fill="#5D2E17" 
      stroke="#D4AF37" 
      strokeWidth="1.5"
    />
    <ellipse cx="50" cy="58" rx="25" ry="8" fill="#3D1C0E" />
    
    {/* Animated Flame - Flickering childhood memory */}
    <motion.g
      animate={{ 
        scale: [1, 1.15, 1],
        opacity: [0.9, 1, 0.8, 1, 0.9],
        y: [0, -3, 0, -1, 0],
        filter: [
          'drop-shadow(0 0 5px #F59E0B)', 
          'drop-shadow(0 0 15px #F59E0B)', 
          'drop-shadow(0 0 8px #F59E0B)'
        ]
      }}
      transition={{ 
        duration: 0.9, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      {/* Outer Flame Glow */}
      <path 
        d="M50 52 Q40 40 50 12 Q60 40 50 52" 
        fill="#F59E0B"
      />
      {/* Inner Wick Heart */}
      <path 
        d="M50 50 Q46 42 50 25 Q54 42 50 50" 
        fill="#FEF3C7"
      />
    </motion.g>
  </motion.svg>
);

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Aap kis occasion ke liye mithai dekh rahe hain?\I am your personal Mithai Guide. Whether it's a Shaadi, a festival, or a simple craving, I can curate the perfect box for you."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured in the environment.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: `You are the Mithai Guide for Raghuveer Sweets & Restaurants (since 1970). 
          You help customers curate mithai boxes, find the right sweets for occasions, and answer questions about the menu. 
          Only speak english or hinglish. Be polite, royal, and use phrases like "Our heritage collection".
          
          Context from previous turns:
          ${messages.map(m => `${m.role}: ${m.text}`).join('\n')}`,
        },
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'I apologize, but I could not process that request at the moment.' }]);
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const errorMessage = error.message?.includes('permission') 
        ? 'Access denied. Please check the Gemini API key configuration.' 
        : 'I apologize, my systems are currently experiencing an interruption. Please try again later.';
      
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-32 md:bottom-12 right-6 md:right-10 z-[80] flex flex-col items-end gap-6 pointer-events-none">
       <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(20px)' }}
              className="pointer-events-auto w-[360px] max-w-[90vw] bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(87,0,0,0.15)] border luxury-border-gold overflow-hidden flex flex-col h-[500px]"
            >
               <div className="bg-primary p-7 flex items-center gap-4 relative shrink-0">
                  <div className="absolute inset-0 ornament-bg opacity-10"></div>
                  <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center border border-secondary/30 shadow-inner relative z-10">
                     <Sparkles className="w-8 h-8 text-secondary fill-secondary/20" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-secondary font-headline font-black text-2xl italic leading-none mb-1">Estate AI</h4>
                    <div className="flex items-center gap-1.5 small-caps text-[8px] text-white/40">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></span>
                       Active Protocol
                    </div>
                  </div>
               </div>
               
               <div className="flex-1 bg-surface-container-low p-7 space-y-6 overflow-y-auto no-scrollbar font-medium italic text-sm leading-relaxed text-on-surface-variant relative z-10">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-5 rounded-[2rem] shadow-[0_10px_30px_rgba(87,0,0,0.05)] border border-primary/5 max-w-[85%] ${
                        m.role === 'user' ? 'bg-primary text-secondary rounded-tr-none' : 'bg-white rounded-tl-none'
                      }`}>
                        <p className={`${m.role === 'user' ? 'text-sm' : 'text-primary font-headline text-lg opacity-90'}`}>{m.text.split('\\n')[0]}</p>
                        {m.text.split('\\n')[1] && <p className="mt-2 text-xs opacity-70">{m.text.split('\\n')[1]}</p>}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-white p-5 rounded-[2rem] rounded-tl-none shadow-[0_10px_30px_rgba(87,0,0,0.05)] border border-primary/5">
                          <Loader2 className="w-5 h-5 animate-spin text-primary opacity-50" />
                        </div>
                     </div>
                  )}

                  {messages.length === 1 && (
                    <div className="flex gap-2 flex-wrap justify-end pt-4">
                       {['Shaadi Gifting', 'Family Dinner', 'Festive Classics'].map(tag => (
                         <button onClick={() => handleSend(tag)} key={tag} className="bg-white border luxury-border-gold px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-secondary transition-all shadow-sm">
                            {tag}
                         </button>
                       ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
               </div>

               <div className="p-6 bg-white border-t border-primary/5 flex gap-3 relative z-10 shrink-0">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                    placeholder="Share your occasion..." 
                    className="flex-1 bg-surface-container-low border-none rounded-2xl px-6 py-4 text-xs font-bold font-body focus:ring-1 focus:ring-primary shadow-inner" 
                  />
                  <button 
                    onClick={() => handleSend(input)}
                    disabled={isLoading || !input.trim()}
                    className="bg-primary text-secondary p-4 rounded-2xl shadow-xl hover:scale-105 hover:gold-glow transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                     <Send className="w-5 h-5" />
                  </button>
               </div>
            </motion.div>
          )}
       </AnimatePresence>
       
       <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto w-24 h-24 bg-[#570000] text-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(87,0,0,0.5)] border-[3px] border-[#D4AF37] relative group transition-all"
       >
          {/* Decorative Outer Rings */}
          <div className="absolute inset-1 border-[2px] border-dashed border-[#D4AF37]/50 rounded-full animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute inset-2 border border-[#D4AF37]/30 rounded-full"></div>
          
          {/* Inner Mandala SVG */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#D4AF37] opacity-30 pointer-events-none animate-[spin_30s_linear_infinite_reverse]">
              <path fill="currentColor" d="M50 0 L56 22 Q70 20 80 10 L76 30 Q90 35 100 50 L76 70 Q70 80 80 90 L56 78 Q50 95 50 100 L44 78 Q30 80 20 90 L24 70 Q10 65 0 50 L24 30 Q30 20 20 10 L44 22 Q50 5 50 0 Z" />
          </svg>

          <div className="relative z-10 w-[60px] h-[60px] bg-[#2a0000] rounded-full border border-[#D4AF37]/40 flex items-center justify-center shadow-inner overflow-hidden">
             <AnimatePresence mode="wait">
               {isOpen ? (
                 <motion.div key="close" initial={{ opacity: 0, rotate: -180 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 180 }}>
                    <X className="w-8 h-8 drop-shadow-md text-[#D4AF37]" />
                 </motion.div>
               ) : (
                 <motion.div 
                   key="open" 
                   initial={{ opacity: 0, scale: 0.5 }} 
                   animate={{ opacity: 1, scale: 1 }} 
                   exit={{ opacity: 0, scale: 0.5 }}
                   className="w-full h-full"
                 >
                    <img 
                      src="/chatbot.png" 
                      alt="Mithai Guide" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Fallback to Diya if image is not yet provided
                        target.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg viewBox="0 0 100 100" class="w-10 h-10 text-[#D4AF37]"><path fill="currentColor" d="M50 20 Q70 20 70 50 Q70 80 50 80 Q30 80 30 50 Q30 20 50 20" /></svg></div>';
                      }}
                    />
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {!isOpen && (
            <span className="absolute top-0 right-0 flex w-5 h-5 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-[#D4AF37] border-2 border-[#570000]"></span>
            </span>
          )}
       </motion.button>
    </div>
  );
}
