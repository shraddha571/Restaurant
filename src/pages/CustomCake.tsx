import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cake, Check, Palette, Sparkles, Star, Wand2, Info, ChevronRight, Clock } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CustomCake() {
  const [flavor, setFlavor] = useState('belgian-chocolate');
  const [size, setSize] = useState('1kg');
  const [message, setMessage] = useState('');
  
  const addToCart = useStore(state => state.addToCart);
  const navigate = useNavigate();

  const flavors = [
    { id: 'belgian-chocolate', name: 'Belgian Truffle', color: 'bg-[#4a2c2a]', desc: 'Rich 70% dark chocolate layers with silk ganache.' },
    { id: 'red-velvet', name: 'Red Velvet', color: 'bg-[#9b1d20]', desc: 'Classic crimson cocoa layers with velvet cream cheese.' },
    { id: 'kesar-pistachio', name: 'Kesar Pistachio', color: 'bg-[#d4af37]', desc: 'Heritage saffron milk cake with hand-crushed pistachios.' },
    { id: 'fresh-fruit', name: 'Exotic Fruit', color: 'bg-[#f4d35e]', desc: 'Light vanilla sponge with seasonal fruit medley.' },
  ];

  const sizes = [
    { id: '500g', label: '500g', price: '750' },
    { id: '1kg', label: '1kg', price: '1450' },
    { id: '2kg', label: '2kg', price: '2800' },
    { id: 'tiered', label: 'Tiered', price: '4000' },
  ];

  const handleAddCakeToCasket = () => {
    const selectedFlavor = flavors.find(f => f.id === flavor);
    const selectedSize = sizes.find(s => s.id === size);
    
    addToCart({
      id: `cake-${Date.now()}`,
      name: `Custom ${selectedFlavor?.name} Cake (${selectedSize?.label})`,
      price: parseInt(selectedSize?.price || '1450', 10),
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD98o0E6N6XjQ_Fq9mK72_hHh68F1C376nQzjEwVb4z5M_1E_k7k1B3H_P_G_T_I_F_O' // Fallback image for cake
    });
    
    toast.success("Bespoke Cake design sent to your casket.");
    navigate('/');
  };

  return (
    <div className="space-y-16 pb-40">
      <header className="text-center relative py-12 md:py-20">
        <div className="absolute inset-0 jaali-bg opacity-5 -z-10 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 cinematic-glow -z-10 animate-pulse"></div>
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="small-caps text-secondary inline-flex items-center gap-2 bg-primary border border-secondary/20 px-8 py-3 rounded-full mb-6 shadow-2xl"
        >
          <Cake className="w-5 h-5" />
          The Sweetest Celebrations
        </motion.div>
        <h1 className="text-display italic text-primary drop-shadow-sm mb-6">Har Khushi, <br/><span className="text-secondary">Ek Cake</span></h1>
        <p className="text-on-surface-variant font-body italic max-w-2xl mx-auto leading-relaxed px-6 text-xl opacity-70">
          "Crafting memories into edible art." Celebrate your milestones with masterpieces sculpted by our master patissiers.
        </p>
      </header>

      {/* Main Designer Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Left: Interaction Controls */}
        <div className="xl:col-span-4 space-y-10 order-2 xl:order-1">
           {/* Section 1: Flavor */}
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Palette className="text-secondary w-5 h-5" />
                 <h3 className="font-headline font-black text-primary text-xl italic">Signature Crust</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {flavors.map((f) => (
                   <button
                     key={f.id}
                     onClick={() => setFlavor(f.id)}
                     className={`p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-4 group ${
                       flavor === f.id ? 'bg-primary border-primary shadow-2xl scale-[1.05]' : 'bg-white border-primary/5 hover:border-primary/10'
                     }`}
                   >
                     <div className={`w-12 h-12 rounded-2xl ${f.color} shadow-lg border border-white/20 transition-transform group-hover:scale-110`}></div>
                     <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${flavor === f.id ? 'text-secondary' : 'text-primary/40'}`}>Flavor</span>
                        <span className={`font-headline font-bold text-lg italic ${flavor === f.id ? 'text-white' : 'text-primary'}`}>{f.name}</span>
                     </div>
                   </button>
                 ))}
              </div>
              <p className="text-xs text-on-surface-variant font-medium italic leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-primary/5">
                 <Info className="w-4 h-4 inline-block mr-2 text-primary opacity-40 shrink-0" />
                 {flavors.find(f => f.id === flavor)?.desc}
              </p>
           </div>

           {/* Section 2: Hierarchy (Size) */}
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Star className="text-secondary w-5 h-5" />
                 <h3 className="font-headline font-black text-primary text-xl italic">Dimension</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                 {sizes.map((s) => (
                   <button
                     key={s.id}
                     onClick={() => setSize(s.id)}
                     className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2 flex flex-col items-center gap-1 ${
                       size === s.id ? 'bg-primary text-secondary border-primary shadow-xl scale-110' : 'bg-white border-primary/5 text-on-surface-variant/40 hover:border-primary/20'
                     }`}
                   >
                     {s.label}
                     <span className={`text-[8px] opacity-60 ${size === s.id ? 'text-secondary' : 'text-primary'}`}>₹{s.price}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* Section 3: Calligraphy (Message) */}
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Wand2 className="text-secondary w-5 h-5" />
                 <h3 className="font-headline font-black text-primary text-xl italic">Couture Message</h3>
              </div>
              <div className="relative">
                 <textarea
                   placeholder="Enter the golden text for your cake top..."
                   className="w-full bg-white border-2 border-primary/5 rounded-[2.5rem] p-8 focus:ring-4 focus:ring-primary/5 focus:border-primary/10 transition-all text-on-surface font-headline italic font-bold text-lg min-h-[160px] shadow-inner resize-none"
                   value={message}
                   maxLength={40}
                   onChange={(e) => setMessage(e.target.value)}
                 />
                 <div className="absolute bottom-6 right-8 text-[10px] font-black text-primary/30 uppercase tracking-widest">
                    {message.length} / 40
                 </div>
              </div>
           </div>
        </div>

        {/* Center/Right: Live Visual Preview Canvas */}
        <div className="xl:col-span-8 order-1 xl:order-2">
          <div className="bg-white rounded-[4rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(87,0,0,0.1)] border border-primary/5 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden group">
             <div className="absolute inset-0 opacity-10 ornament-bg pointer-events-none"></div>
             
             {/* Studio Lighting Effect */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none"></div>

             <div className="relative z-10 w-full max-w-lg aspect-square bg-[#FDFBF7] rounded-[4rem] shadow-inner border border-primary/5 flex items-center justify-center p-12 md:p-20 group">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={flavor + size}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full rounded-[3.5rem] shadow-2xl relative flex items-center justify-center overflow-hidden border-2 border-white/20"
                    style={{ 
                      background: `radial-gradient(circle at 30% 30%, ${flavors.find(f => f.id === flavor)?.color.split('[')[1].split(']')[0]}, #1a0000)`,
                      boxShadow: `0 30px 60px rgba(0,0,0,0.4), inset 0 0 50px rgba(255,255,255,0.1)`
                    }}
                  >
                     {/* Signature Toppers Overlay */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Cake className="w-64 h-64 text-white" />
                     </div>

                     {/* Live Greeting */}
                     <div className="p-12 text-center relative z-20">
                        <AnimatePresence>
                          {message ? (
                            <motion.span 
                              key={message}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-secondary font-headline font-black italic text-3xl md:text-5xl tracking-tighter block leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-b-2 border-secondary/20 pb-4"
                            >
                              {message}
                            </motion.span>
                          ) : (
                            <span className="text-secondary/20 font-headline font-black italic text-3xl tracking-tighter block leading-none border-b-2 border-secondary/5 pb-4">
                               Your Story Here
                            </span>
                          )}
                        </AnimatePresence>
                        <p className="text-secondary/60 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Hand-Written Icing</p>
                     </div>

                     {/* Gold Sparkles */}
                     <div className="absolute bottom-8 right-8">
                        <Sparkles className="w-10 h-10 text-secondary animate-pulse" />
                     </div>
                  </motion.div>
                </AnimatePresence>

                {/* Annotation Labels */}
                <div className="absolute -top-4 -right-4 glass-surface px-6 py-3 rounded-2xl border border-secondary/30 shadow-2xl flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(212,175,55,1)]"></div>
                   <span className="text-primary font-black text-[9px] uppercase tracking-widest">Heritage Spec</span>
                </div>
             </div>

             {/* Delivery Insight */}
             <div className="mt-12 flex gap-8">
                <div className="flex items-center gap-3">
                   <Clock className="w-5 h-5 text-secondary" />
                   <span className="text-xs font-bold text-on-surface-variant italic">Freshly Baked: 4-6 Hours Notice</span>
                </div>
                <div className="flex items-center gap-3">
                   <Star className="w-5 h-5 text-secondary fill-secondary" />
                   <span className="text-xs font-bold text-on-surface-variant italic">No Artificial Preservatives</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Action Footer Drawer */}
      <div className="fixed bottom-32 left-0 right-0 px-6 max-w-7xl mx-auto z-40">
        <div className="bg-primary/95 backdrop-blur-2xl p-6 md:p-8 rounded-[3.5rem] shadow-2xl border border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-8 group">
           <div className="flex flex-col text-center md:text-left">
              <span className="text-secondary/60 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Artisanal Investment</span>
              <div className="flex items-baseline gap-2">
                 <span className="text-white text-5xl font-headline font-black italic tracking-tighter">₹{sizes.find(s => s.id === size)?.price}</span>
                 <span className="text-secondary font-black text-xs uppercase tracking-widest opacity-60">Estimated*</span>
              </div>
           </div>
           
           <div className="flex gap-4 w-full md:w-auto">
             <button 
               onClick={handleAddCakeToCasket}
               className="flex-1 md:flex-none bg-secondary text-primary px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/30 flex items-center justify-center gap-3 hover:gold-glow relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                Add to Casket
                <ChevronRight className="w-4 h-4" />
             </button>
           </div>
        </div>
        <div className="flex justify-center mt-4">
           <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Expert design verification required for tiered cakes
           </p>
        </div>
      </div>
    </div>
  );
}
