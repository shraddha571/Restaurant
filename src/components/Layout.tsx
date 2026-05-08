import { ReactNode, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, UtensilsCrossed, Sparkles, ShoppingBasket, Search, User as UserIcon, Truck, X, Plus, Minus, Trash2, Package, Clock, Phone, LogOut, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AIAssistant from './AIAssistant';
import { useStore } from '../store';
import { PRODUCTS, CATEGORIES } from '../constants';
import { auth, db, doc, setDoc, getDoc } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isStaffDashboard = location.pathname === '/staff';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { cartItems, updateQuantity, removeFromCart, user, setUser } = useStore();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Auth States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize reCAPTCHA on mount
  useEffect(() => {
    const initRecaptcha = () => {
      try {
        // Check if window.recaptchaVerifier already exists before creating a new one.
        if (!(window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved, will allow signInWithPhoneNumber to proceed.
            },
            'expired-callback': () => {
              toast.error('reCAPTCHA expired. Please try again.');
              if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
                (window as any).recaptchaVerifier = null;
                initRecaptcha(); // Re-initialize after expiry
              }
            }
          });
          
          // Pre-render the verifier
          (window as any).recaptchaVerifier.render().catch((err: any) => {
            console.error("reCAPTCHA render error:", err);
          });
        }
      } catch (error) {
        console.error("reCAPTCHA initialization failed:", error);
      }
    };

    initRecaptcha();

    // Cleanup: If an old verifier exists, clear it properly before re-rendering or unmounting.
    return () => {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        } catch (error) {
          console.error("reCAPTCHA cleanup error:", error);
        }
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            name: userData.name,
            phone: userData.phone
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber) return toast.error('Please enter phone number');
    if (isRegistering && !fullName) return toast.error('Please enter your full name');
    
    setIsLoading(true);
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      if (!appVerifier) {
        throw new Error('reCAPTCHA not initialized. Please refresh the page.');
      }
      
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmation);
      toast.success('OTP sent successfully!');
    } catch (error: any) {
      console.error('OTP Send Error:', error);
      toast.error(error.message || 'Failed to send OTP');
      
      // If error occurs, re-initialize reCAPTCHA as it might be in a bad state
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
      // Re-trigger the init logic if needed, but since it's in useEffect, 
      // it might need a trigger or just a fresh manual init here.
      window.location.reload(); // Simple recovery for reCAPTCHA errors
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error('Please enter OTP');
    setIsLoading(true);
    try {
      const result = await verificationId.confirm(otp);
      const firebaseUser = result.user;

      if (isRegistering) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          name: fullName,
          phone: phoneNumber,
          createdAt: new Date()
        });
        setUser({ uid: firebaseUser.uid, name: fullName, phone: phoneNumber });
      } else {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            name: userData.name,
            phone: userData.phone
          });
        } else {
          // If user exists in Auth but not Firestore (unlikely with this flow), prompt for registration
          toast.error('User record not found. Please register.');
          await signOut(auth);
          setIsRegistering(true);
          setIsLoading(false);
          return;
        }
      }

      toast.success(isRegistering ? 'Registration successful!' : 'Login successful!');
      setIsAuthOpen(false);
      resetAuthStates();
      setIsRegistering(false);
    } catch (error: any) {
      toast.error('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAuthStates = () => {
    setPhoneNumber('');
    setFullName('');
    setOtp('');
    setVerificationId(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    toast.success('Logged out');
  };

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsRegistering(false);
      setIsAuthOpen(true);
      toast.error('Please login to continue');
      return;
    }
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
        <header className="z-40 transition-all duration-500 bg-surface/90 backdrop-blur-lg border-b border-primary/10 sticky top-0">
          <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center h-20 md:h-28">
            <NavLink to="/" className="flex items-center group cursor-pointer h-full shrink-0">
              <img 
                src="/logo.png" 
                alt="Raghuveer Logo" 
                className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
              />
            </NavLink>

            {/* Desktop Navigation - Improved Spacing */}
            <nav className="hidden xl:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              {[{ name: 'Home', path: '/' }, { name: 'Menu', path: '/menu' }, { name: 'Custom Hamper', path: '/custom' }, { name: 'Track Order', path: '/track' }].map(link => (
                <NavLink key={link.path} to={link.path} className={({ isActive }) => `small-caps transition-all relative group py-2 whitespace-nowrap text-[11px] font-black tracking-[0.2em] ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100 ${location.pathname === link.path && 'scale-x-100'}`}></span>
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3 md:gap-6">
              <button onClick={() => setIsSearchOpen(true)} className="p-3 hover:bg-white/50 rounded-2xl text-primary active:scale-95 transition-all hidden sm:flex items-center gap-3 border border-transparent hover:border-primary/10 group">
                <Search className="w-5 h-5 group-hover:text-secondary transition-colors" />
                <span className="small-caps hidden lg:block text-[10px] font-black tracking-widest">Search</span>
              </button>
              
              <div className="flex items-center gap-2">
                {user ? (
                  <button onClick={() => setIsAuthOpen(true)} className="px-4 py-3 bg-secondary/10 text-secondary rounded-2xl hover:bg-secondary/20 transition-all flex items-center gap-3 border border-secondary/20 group">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-secondary/20 group-hover:bg-primary/20 transition-all">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="small-caps text-[10px] font-black tracking-widest hidden md:block">{user.name}</span>
                  </button>
                ) : (
                  <button onClick={() => { setIsRegistering(false); setIsAuthOpen(true); }} className="p-3 hover:bg-white/50 rounded-2xl text-primary active:scale-95 transition-all flex items-center gap-3 border border-transparent hover:border-primary/10 group">
                    <UserIcon className="w-5 h-5 group-hover:text-secondary transition-colors" />
                    <span className="small-caps hidden lg:block text-[10px] font-black tracking-widest">Sign In</span>
                  </button>
                )}
              </div>

              <button onClick={() => setIsCartOpen(true)} className="relative p-3 md:p-4 bg-primary text-secondary rounded-2xl shadow-[0_15px_30px_rgba(87,0,0,0.3)] hover:scale-105 active:scale-95 transition-all group overflow-hidden border border-secondary/20 shrink-0">
                <div className="flex items-center gap-3 relative z-10">
                  <ShoppingBasket className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Basket</span>
                </div>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-primary text-[9px] font-black flex items-center justify-center rounded-lg shadow-md border-2 border-primary animate-bounce">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuthOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#FFF5E1] z-[120] rounded-[3rem] shadow-2xl overflow-hidden border luxury-border-gold p-10 space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-secondary/20">
                  {user ? <ShieldCheck className="w-10 h-10 text-secondary" /> : <UserIcon className="w-10 h-10 text-secondary" />}
                </div>
                <h2 className="text-3xl font-headline italic text-primary">
                  {user ? 'Your Profile' : isRegistering ? 'Join the Legacy' : 'Welcome Back'}
                </h2>
                <p className="small-caps text-[10px] text-secondary tracking-widest font-bold">Raghuveer Heritage Amravati</p>
              </div>

              {user ? (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl border luxury-border-gold space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Full Identity</p>
                      <p className="text-2xl font-headline italic text-primary">{user.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Contact Protocol</p>
                      <p className="text-2xl font-headline italic text-primary">{user.phone}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full bg-white text-red-600 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border border-red-100 hover:bg-red-50 transition-all">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {!verificationId ? (
                    <>
                      {isRegistering && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Full Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-white border border-primary/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition-all italic text-sm"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                          <input 
                            type="tel" 
                            placeholder="9876543210"
                            className="w-full bg-white border border-primary/5 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-secondary transition-all italic text-sm"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 gold-glow"
                      >
                        {isLoading ? 'Processing...' : 'Send Authentication Code'}
                      </button>
                      <button 
                        onClick={() => { setIsRegistering(!isRegistering); resetAuthStates(); }}
                        className="w-full text-center small-caps text-[10px] text-primary/40 hover:text-primary transition-colors font-bold"
                      >
                        {isRegistering ? 'Already have an account? Sign In' : 'New to Raghuveer? Register Now'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2 text-center">
                        <p className="text-sm italic text-primary/60">Enter the 6-digit code sent to <br/><span className="font-bold text-primary">{phoneNumber}</span></p>
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder="000000"
                          className="w-full bg-white border border-primary/5 rounded-2xl py-6 text-center text-3xl font-headline tracking-[1em] focus:outline-none focus:border-secondary transition-all text-primary shadow-inner"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={handleVerifyOTP}
                        disabled={isLoading}
                        className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 gold-glow"
                      >
                        {isLoading ? 'Verifying...' : 'Verify & Continue'}
                      </button>
                      <button 
                        onClick={() => setVerificationId(null)}
                        className="w-full text-center small-caps text-[10px] text-primary/40 hover:text-primary transition-colors font-bold"
                      >
                        Change Phone Number
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
      {/* reCAPTCHA Container - Hidden but always present to prevent re-rendering errors */}
      <div id="recaptcha-container" className="hidden"></div>
    </div>
  );
}
