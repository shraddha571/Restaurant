import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, Sparkles, Receipt, Search, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function TrackOrder() {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      toast.error('Please enter your Token Number');
      return;
    }

    setIsSearching(true);
    try {
      // Search for the order with the given token
      const q = query(
        collection(db, 'orders'),
        where('token', '==', tokenInput.trim().toUpperCase()),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        // Redirect to the receipt page which has the real-time tracker
        navigate(`/receipt/${orderDoc.id}`);
      } else {
        toast.error('Order not found. Please check your Token Number.');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Failed to track order. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5E1] py-20 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center mb-8">
             <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3">
                <Receipt className="w-12 h-12 text-secondary" />
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline italic text-primary tracking-tighter leading-none">
            Track Your <span className="text-secondary">Mithaas</span>
          </h1>
          <p className="text-on-surface-variant font-body italic text-xl opacity-70 max-w-xl mx-auto">
            "Patience brings the sweetest rewards." Enter your token number to follow your collection's journey.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-secondary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 jaali-bg opacity-5 pointer-events-none"></div>
          
          <form onSubmit={handleTrack} className="relative z-10 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 ml-4">Heritage Identifier</label>
              <div className="relative group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary group-focus-within:scale-110 transition-transform" />
                <input 
                  type="text" 
                  placeholder="e.g. RGV-1234"
                  className="w-full bg-[#fcfaf7] border-2 border-primary/5 rounded-3xl py-8 pl-20 pr-8 text-3xl font-headline font-black text-primary tracking-widest focus:outline-none focus:border-secondary focus:bg-white shadow-inner transition-all uppercase"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSearching}
              className="w-full bg-primary text-secondary py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 gold-glow disabled:opacity-50"
            >
              {isSearching ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-secondary"></div>
                  Searching Archive...
                </div>
              ) : (
                <>
                  Locate My Order
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/50 flex items-center gap-6">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Real-time Sync</p>
              <p className="text-sm font-bold text-primary italic">Live kitchen transmission</p>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/50 flex items-center gap-6">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Purity First</p>
              <p className="text-sm font-bold text-primary italic">Quality assured since 1970</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
