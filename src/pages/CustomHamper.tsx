import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Gift, LayoutGrid, Package, Sparkles, Wand2, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CustomHamper() {
  const [step, setStep] = useState(1);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const addToCart = useStore(state => state.addToCart);
  const navigate = useNavigate();

  const boxes = [
    { id: 'royal-gold', name: 'Royal Gold Box', price: 450, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnDXFAdyqWIZLqTyDqlOSyB44RZebZo88vEVzgJSAeBml6lLsVvfcMGWqyqj-Hie9jom9KqMyOFqBJ9qP0G4-noBFT43C9Qnhd0RP5We29vOQuVahgCnpMzFnEWbfOjM91ga7cl-hcX9b6qq7iUwKhX79Lo4orVShPtDkJl5eOlK72CWcddmqGsMbhNnSx4Qpbst2ua8IAJj_Zc_6J_mgsZEfAexumGVhMRSm729TbFsKX5Y3DoIWhkzuxUFhf-HQzzGYtUUTArmU' },
    { id: 'velvet-chest', name: 'Velvet Chest', price: 850, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4MZPfvlsgnS3m-3_wbaPK_MjTjJYCrEWg_wrqNO-QPJjDHDZ1sqB1eRS5Yjq433nsBmZAFH6TfSUO2BbLrnOff1L8ZeJdcQ-f4NbwnbILNisFOB5vvdsUJ2h7YwcMm2LCVxTD0PiEGTvoxQsmdBlvcxer1wpOGmpKcUhAAj8WIgLxTvdIpkcsaSVLkRG4rdsziAwMJSK3UCgiSIGcQ8BpyPMSaONH7npFZ4LGgZLrWFSuc51pNEDvQu-Cw4ec5ie3D34NfGUD4Xo' },
  ];

  const items = [
    { id: 'kaju-katli', name: 'Kaju Katli (250g)', price: 320, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlm6NCzLr1LPC91vlVJQpuceXITDCjK764xy1Pu6lOduQpngbRC1g__kVmVtcUtHvSctJ7aDqRGeYa8Fv02Xr2_Sss_pXVu4SC9lvJghUBceUMMQ7TuNXqDr7t-GfwhXELWU-gRNXX2hNm8I6BjDAfxrgwUSAWCkDGCIIJopAbkVL7hgj5f5n7yKes7gxXd7GO_h8W6aQYdW7s3I6JH3SNGJnNEMrjJdHnOn7xsgLxdNj3zPYda14oyIZYc4mqetc3NvxNeaRSBIw' },
    { id: 'pista-roll', name: 'Pista Roll (250g)', price: 450, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUgGBrIQ-7bWaj-eLPDwa0a_KG_L1wTiej6mv28HOtUz5IrQhwFZNa9uF2BBfY17pnRJ9vHgGijj4fSR7DSqd4eyeADtNUn_UOdmEWdTxGwRqXIujc9EMIxpovai1_VQLgvO8HUxpujYWHgLVbUS1TLlQhz-sWEzRxvbD0V4GhfXe3jZCLWlDJto__EFG9qb9VD57P0lDfzkgiXssVi90OKplHtN2MQNw19CT1KngR39txYZrDmcvWKGmgZyccoy8ut6dBIGXqHqY' },
    { id: 'motichoor', name: 'Motichoor Ladoo', price: 280, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJrwLmmqxvNuzCkhYHnWi3wGhU8AHTnx4qMMbBRP1JA2f_iSUDYnDkAkrt8Y2ZOH19csDYPjlzAL1dPj9BZ4E_WxPefX6lOF88Vmm40WUaVRSuDP4nWby0UBmfwKVlCmtuAkdM9WJdfEajD0f5CIo3zhqBGAUpDnPIRn2XJ5-iel5oPR8oEjbU5Ge2fsrpBtlXhnpCCogzROltfJ8hhYYGl9XdOlIq4twx4a0EMdLqWnisDEfoOY8296GqsD-EqwZe4CcDfklJgDQ' },
    { id: 'rajbhog', name: 'Saffron Rajbhog', price: 340, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvNVwNs_vAs36ljUCVhH1tFnEyHpFeUufhKup03N3oITz6ZlehmG5K2Egg4ATiGxHH5XgK8462kiJl5sSEMaf4WAsFBMFRMr35wM14gavUL_M2YejPPreuuLQs0FpzYp2sfHQIqyHntLaCFOxv7HaMaFIzqp7Z5TqDRRVa-k4NTi-wd9WuiPp5NbbGBmNCnTw1SujY_mRnG0ht1CJ5LMBhZOxSPeSg1ymME7c1UGOAO7MSzDquUV_JhltCUIK2lqdwKUx1ZlUZGFs' },
  ];

  const currentBox = boxes.find(b => b.id === selectedBox);
  const totalPrice = (currentBox?.price || 0) + 
                    items.filter(i => selectedItems.includes(i.id)).reduce((acc, curr) => acc + curr.price, 0);

  const handleAddToCasket = () => {
    if (!currentBox) return;
    addToCart({
      id: `hamper-${Date.now()}`,
      name: `Custom ${currentBox.name}`,
      price: totalPrice,
      img: currentBox.img
    });
    toast.success("Custom Hamper added to your casket.");
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
           className="inline-flex items-center gap-3 bg-primary text-secondary px-8 py-3 rounded-full mb-8 border border-secondary/30 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] animate-[shimmer_3s_infinite] skew-x-12"></div>
          <Sparkles className="w-4 h-4 fill-current" />
          <span className="small-caps text-secondary">The Art of Gifting</span>
        </motion.div>
        <h1 className="text-display italic text-primary drop-shadow-sm mb-6">Gift a <br/><span className="text-secondary">Memory</span></h1>
        <p className="text-on-surface-variant font-body italic max-w-2xl mx-auto leading-relaxed px-6 text-xl opacity-70">
          "Sirf mithai nahi — yaadein bhejiye." Curate a magnificent gift box filled with half a century of traditional sweetness.
        </p>
      </header>

      {/* Stepper — Enhanced */}
      <div className="flex justify-between items-center max-w-2xl mx-auto relative px-10 md:px-0">
        <div className="absolute h-[1px] bg-primary/10 left-0 right-0 top-1/2 -translate-y-1/2 -z-10 rounded-full"></div>
        <motion.div 
          className="absolute h-[1px] bg-secondary left-0 top-1/2 -translate-y-1/2 -z-10 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
          animate={{ width: `${(step - 1) * 50}%` }}
        />
        
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex flex-col items-center gap-6">
             <motion.div 
              animate={{ 
                scale: step === num ? 1.2 : 1,
                backgroundColor: step >= num ? '#570000' : '#FDFBF7',
                color: step >= num ? '#D4AF37' : '#570000'
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center font-black transition-all shadow-xl relative z-10 border ${step >= num ? 'border-secondary' : 'border-primary/10'}`}
            >
              {step > num ? <Check className="w-6 h-6 stroke-[3]" /> : num}
            </motion.div>
            <span className={`small-caps text-[10px] ${step === num ? 'text-primary' : 'text-on-surface-variant/40'}`}>
               {num === 1 ? 'Selection' : num === 2 ? 'Curation' : 'Review'}
            </span>
          </div>
        ))}
      </div>

      {/* Steps Content — Enhanced visuals and transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[500px]"
        >
          {step === 1 && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-headline font-black text-primary italic mb-2 tracking-tight">Choose Your Casket</h2>
                <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {boxes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBox(box.id)}
                    className={`relative p-10 rounded-[4rem] text-left transition-all border-2 overflow-hidden group ${
                      selectedBox === box.id 
                        ? 'bg-white border-secondary shadow-2xl scale-[1.02]' 
                        : 'bg-surface-container-low border-transparent hover:bg-white hover:border-primary/10'
                    }`}
                  >
                    <div className="flex flex-col gap-8">
                      <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-inner">
                         <img src={box.img} alt={box.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-3xl font-headline font-black text-primary italic mb-1">{box.name}</h3>
                          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Legacy Collection</p>
                        </div>
                        <p className="text-3xl font-black text-primary tracking-tighter">₹{box.price}</p>
                      </div>
                    </div>
                    {selectedBox === box.id && (
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary text-secondary flex items-center justify-center shadow-lg border border-secondary/30">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12">
              <div className="text-center">
                 <h2 className="text-4xl font-headline font-black text-primary italic mb-2 tracking-tight">Curation Of Delights</h2>
                 <p className="text-on-surface-variant font-medium italic">Select items to fill your {currentBox?.name}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Item List */}
                 <div className="space-y-4">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (selectedItems.includes(item.id)) {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          } else {
                            setSelectedItems([...selectedItems, item.id]);
                          }
                        }}
                        className={`w-full p-6 rounded-[2rem] flex justify-between items-center transition-all border-2 group ${
                          selectedItems.includes(item.id)
                            ? 'bg-primary text-secondary border-primary shadow-xl scale-[1.02]'
                            : 'bg-white text-on-surface-variant border-primary/5 hover:border-primary/20'
                        }`}
                      >
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-2xl overflow-hidden border border-primary/5">
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="text-left">
                              <span className="font-headline font-bold text-xl block italic">{item.name}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Artisanal Choice</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="font-black text-lg">+₹{item.price}</span>
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                             selectedItems.includes(item.id) ? 'bg-secondary text-primary' : 'bg-surface-container text-on-surface-variant/40'
                           }`}>
                             <Plus className={`w-5 h-5 transition-transform ${selectedItems.includes(item.id) ? 'rotate-45' : 'rotate-0'}`} />
                           </div>
                        </div>
                      </button>
                    ))}
                 </div>

                 {/* Live Preview Box */}
                 <div className="bg-primary rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl hidden lg:block sticky top-32 h-fit">
                    <div className="absolute inset-0 opacity-10 ornament-bg"></div>
                    <div className="relative z-10 space-y-10">
                       <h3 className="text-secondary font-headline font-black text-2xl italic">Basket Preview</h3>
                       
                       <div className="space-y-4 min-h-[200px]">
                          {selectedItems.length === 0 ? (
                            <div className="text-white/30 text-center py-12 italic">Your casket is empty. Add some sweetness...</div>
                          ) : (
                            <AnimatePresence>
                               {selectedItems.map((itemId) => {
                                 const item = items.find(i => i.id === itemId);
                                 return (
                                   <motion.div 
                                      key={itemId}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      className="flex justify-between items-center text-sm italic font-medium group"
                                   >
                                      <div className="flex items-center gap-3">
                                         <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                         {item?.name}
                                      </div>
                                      <button onClick={() => setSelectedItems(selectedItems.filter(id => id !== itemId))} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-red-400" /></button>
                                   </motion.div>
                                 );
                               })}
                            </AnimatePresence>
                          )}
                       </div>

                       <div className="pt-10 border-t border-white/10 flex justify-between items-end">
                          <div>
                            <p className="text-secondary text-[10px] uppercase font-black tracking-widest leading-none mb-1">Total Estate</p>
                            <span className="text-4xl font-headline font-black italic tracking-tighter">₹{totalPrice}</span>
                          </div>
                          <div className="text-right">
                             <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{selectedItems.length} Signature Items</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12">
               <div className="text-center">
                  <h2 className="text-4xl font-headline font-black text-primary italic mb-2 tracking-tight">Final Masterpiece</h2>
                  <p className="text-on-surface-variant font-medium italic">Available for pickup or royal delivery</p>
               </div>

               <div className="max-w-4xl mx-auto bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(87,0,0,0.1)] border border-primary/5 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                  <div className="p-10 md:p-16 border-r border-primary/5 bg-surface-container-low relative">
                    <div className="absolute top-10 left-10 opacity-10"><Package className="w-32 h-32" /></div>
                    <div className="relative z-10 space-y-8">
                       <h3 className="text-primary font-headline font-black text-3xl italic tracking-tight">{currentBox?.name}</h3>
                       <div className="aspect-video rounded-3xl overflow-hidden shadow-xl border border-secondary/20">
                          <img src={currentBox?.img} alt="Final Box" className="w-full h-full object-cover" />
                       </div>
                       <div className="space-y-2">
                          <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Selected Delights</span>
                          <div className="space-y-2">
                             {selectedItems.map(id => (
                               <div key={id} className="flex items-center gap-3 text-sm italic font-medium text-on-surface-variant">
                                  <Check className="w-4 h-4 text-secondary stroke-[3]" />
                                  {items.find(i => i.id === id)?.name}
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-10 md:p-16 flex flex-col justify-between space-y-12">
                     <div className="space-y-8">
                        <div>
                           <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">Estimated Value</span>
                           <h4 className="text-6xl font-headline font-black text-primary italic tracking-tighter mt-4 leading-none">₹{totalPrice}</h4>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between text-sm italic py-4 border-b border-primary/5">
                              <span className="text-on-surface-variant font-medium">Box Premium</span>
                              <span className="text-primary font-black">₹{currentBox?.price}</span>
                           </div>
                           <div className="flex justify-between text-sm italic py-4 border-b border-primary/5">
                              <span className="text-on-surface-variant font-medium">Curated Items</span>
                              <span className="text-primary font-black">₹{totalPrice - (currentBox?.price || 0)}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <button onClick={handleAddToCasket} className="w-full bg-secondary text-primary py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:gold-glow hover:scale-[1.02] active:scale-95 transition-all">
                           Add to Casket
                        </button>
                        <p className="text-[9px] text-on-surface-variant text-center font-bold uppercase tracking-[0.25em] opacity-40">Taxes calculated at checkout</p>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation — Enhanced */}
      <div className="fixed bottom-32 left-0 right-0 px-6 max-w-7xl mx-auto z-40 bg-gradient-to-t from-surface to-transparent pt-12">
        <div className="bg-primary/95 backdrop-blur-2xl p-4 md:p-6 rounded-[3rem] border border-secondary/20 shadow-2xl flex gap-4 md:gap-6 items-center">
          <div className="hidden md:flex flex-col pl-6 pr-10 border-r border-secondary/20">
             <span className="text-secondary/50 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Session Total</span>
             <span className="text-secondary font-headline font-black italic text-2xl tracking-tighter leading-none">₹{totalPrice}</span>
          </div>

          <div className="flex-1 flex gap-4 pr-2">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="bg-white/10 text-white font-black uppercase tracking-widest text-[10px] px-8 py-5 rounded-2xl transition-all active:scale-95 border border-white/10 hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <button 
              disabled={step === 1 && !selectedBox}
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else handleAddToCasket();
              }}
              className="flex-1 bg-secondary text-primary font-black uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-secondary/20 disabled:opacity-30 disabled:grayscale group hover:gold-glow"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              {step === 3 ? 'Finalize Hamper' : step === 1 ? 'Curate Contents' : 'Review Design'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
