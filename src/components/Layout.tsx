import { ReactNode, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, UtensilsCrossed, Sparkles, ShoppingBasket, Search, User, Truck, X, Plus, Minus, Trash2, Package, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AIAssistant from './AIAssistant';
import { useStore } from '../store';
import { PRODUCTS, CATEGORIES } from '../constants';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isStaffDashboard = location.pathname === '/staff';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { cartItems, updateQuantity, removeFromCart } = useStore();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const searchResults = PRODUCTS.filter(product => 
    searchQuery.trim() !== '' && 
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 4);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface ornament-bg selection:bg-primary/20 selection:text-primary flex flex-col">
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-surface/95 backdrop-blur-xl flex flex-col pt-32 px-6 pb-6 overflow-y-auto"
          >
            <div className="absolute inset-0 jaali-bg opacity-5 pointer-events-none mix-blend-multiply"></div>
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-10 right-10 p-4 bg-white rounded-full shadow-xl hover:scale-110 transition-all text-primary luxury-border-gold z-10"><X className="w-6 h-6" /></button>
            <div className="max-w-4xl w-full mx-auto relative z-10 space-y-12">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="relative">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-secondary" />
                <input type="text" autoFocus placeholder="Search our Meethi Virasat..." className="w-full bg-white/50 backdrop-blur-md border-2 border-secondary/30 rounded-full py-8 pl-24 pr-12 text-3xl font-headline font-light italic text-primary focus:outline-none focus:border-secondary focus:bg-white shadow-[0_20px_50px_rgba(212,175,55,0.1)] transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </motion.div>
              {searchQuery && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6">
                  <span className="small-caps text-secondary ml-4">Discovered Curations ({searchResults.length})</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {searchResults.map(product => (
                      <div key={product.id} className="bg-white rounded-[2rem] p-4 flex gap-6 items-center luxury-border-gold hover:shadow-[0_20px_40px_rgba(87,0,0,0.08)] transition-all cursor-pointer group" onClick={() => { setIsSearchOpen(false); navigate('/menu'); }}>
                        <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shrink-0"><img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" /></div>
                        <div className="space-y-1"><h4 className="font-headline italic text-2xl text-primary">{product.name}</h4><p className="small-caps opacity-60">₹{product.price} • {product.unit}</p></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {!isStaffDashboard && (
        <header className="z-40 transition-all duration-500 bg-surface/80 backdrop-blur-md border-b border-primary/5">
          <div className="mx-auto max-w-[1600px] px-6 py-3 md:py-4 flex justify-between items-center mx-4 md:mx-10 h-20 md:h-24 overflow-hidden">
            <NavLink to="/" className="flex items-center group cursor-pointer h-full py-1">
              <img 
                src="/logo.png" 
                alt="Raghuveer Logo" 
                className="h-full max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
              />
            </NavLink>
            <nav className="hidden lg:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
              {[{ name: 'Home', path: '/' }, { name: 'Menu', path: '/menu' }, { name: 'Custom Hamper', path: '/custom' }, { name: 'Track Order', path: '/track' }].map(link => (
                <NavLink key={link.path} to={link.path} className={({ isActive }) => `small-caps transition-all relative group ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                  {link.name}
                  <span className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-secondary origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100 ${location.pathname === link.path && 'scale-x-100'}`}></span>
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSearchOpen(true)} className="p-3 hover:bg-white/50 rounded-2xl text-primary active:scale-95 transition-all hidden md:flex items-center gap-3 border border-transparent hover:border-primary/5"><Search className="w-5 h-5" /><span className="small-caps hidden xl:block">Search Mithaas</span></button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-primary text-secondary rounded-[1.5rem] shadow-[0_15px_30px_rgba(87,0,0,0.3)] hover:scale-105 active:scale-95 transition-all group overflow-hidden border border-secondary/20">
                <div className="flex items-center gap-3 relative z-10"><ShoppingBasket className="w-5 h-5" /><span className="text-[11px] font-black uppercase tracking-widest hidden md:block">The Basket</span></div>
                {cartItems.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-primary text-[9px] font-black flex items-center justify-center rounded-lg shadow-md border-2 border-primary">{cartItems.length}</span>}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3"><ShoppingBasket className="w-6 h-6 text-primary" /><h2 className="text-3xl font-headline italic text-primary">Your Basket</h2></div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-primary/5 rounded-full transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={`${item.id}-${item.weight}-${item.orderType}`} className="flex gap-4 p-4 rounded-2xl bg-surface-container/50 border border-primary/5 group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0"><img src={item.img} alt={item.name} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-primary">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id, item.weight, item.orderType)} className="p-1 text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] small-caps text-primary/40">
                          <span>{item.weight}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            {item.orderType === 'parcel' ? <Package className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {item.orderType === 'parcel' ? 'Parcel' : 'Required Now'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-4 bg-white rounded-lg border border-primary/5 px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, item.weight, item.orderType, -1)} className="p-1 text-primary hover:text-secondary"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQuantity(item.id, item.weight, item.orderType, 1)} className="p-1 text-primary hover:text-secondary"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="font-bold text-primary">₹{item.price * item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <ShoppingBasket className="w-16 h-16" />
                    <p className="font-headline italic text-xl">"Your basket awaits its first curation."</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-surface-container space-y-6 border-t border-primary/10">
                <div className="flex justify-between items-end">
                  <span className="small-caps text-primary/40">Grand Valuation</span>
                  <span className="text-4xl font-headline italic text-primary">₹{total}</span>
                </div>
                <button 
                  onClick={handleCheckout} 
                  disabled={cartItems.length === 0}
                  className="w-full bg-primary text-secondary py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 gold-glow"
                >
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1">{children}</main>
      <AIAssistant />
    </div>
  );
}
