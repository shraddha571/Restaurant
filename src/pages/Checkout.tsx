import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Wallet, Receipt, Sparkles, User, Phone, Package, Utensils } from 'lucide-react';
import { useStore } from '../store';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Order } from '../types';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('takeaway');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const generateToken = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `RGV-${randomNum}`;
  };

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error('Your basket is empty');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please provide name and phone number');
      return;
    }

    setIsProcessing(true);

    try {
      const token = generateToken();

      // Payment simulation for online method
      if (paymentMethod === 'online') {
        toast.loading('Initializing Online Payment...', { id: 'payment' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Payment Successful!', { id: 'payment' });
      }

      // Order Data Structure as requested
      const orderData: Omit<Order, 'id'> = {
        token: token,
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          weight: item.weight,
          qty: item.qty,
          price: item.price,
          img: item.img,
          orderType: item.orderType
        })),
        totalAmount: total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'online' ? 'paid' : 'unpaid',
        orderType: orderType,
        status: 'placed',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // IMPORTANT: Clear cart and redirect
      clearCart();
      toast.success('Order confirmed!');
      navigate(`/receipt/${docRef.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to confirm order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 bg-[#FFF5E1]">
        <h2 className="text-3xl font-headline italic text-primary">Your basket is empty</h2>
        <button onClick={() => navigate('/menu')} className="bg-primary text-secondary px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1] py-12 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="small-caps">Back to Basket</span>
          </button>
        </div>

        {/* Left Side: Forms */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2rem] p-8 shadow-xl border border-secondary/10 space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-headline italic text-primary flex items-center gap-3">
                <User className="w-6 h-6 text-secondary" />
                Customer Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-2">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-surface-container border border-primary/5 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-all italic text-sm"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-2">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 9876543210"
                    className="w-full bg-surface-container border border-primary/5 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-all italic text-sm"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-headline italic text-primary flex items-center gap-3">
                <Utensils className="w-6 h-6 text-secondary" />
                Order Configuration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setOrderType('dine-in')}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                    orderType === 'dine-in' ? 'bg-primary text-secondary border-primary shadow-lg' : 'bg-white border-primary/10 text-primary/40 hover:border-primary/30'
                  }`}
                >
                  <Utensils className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest">Dine-in</span>
                </button>
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                    orderType === 'takeaway' ? 'bg-primary text-secondary border-primary shadow-lg' : 'bg-white border-primary/10 text-primary/40 hover:border-primary/30'
                  }`}
                >
                  <Package className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest">Takeaway</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-headline italic text-primary flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-secondary" />
                Settlement Protocol
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                    paymentMethod === 'online' ? 'bg-primary text-secondary border-primary shadow-lg' : 'bg-white border-primary/10 text-primary/40 hover:border-primary/30'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest">Online Payment</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('offline')}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                    paymentMethod === 'offline' ? 'bg-primary text-secondary border-primary shadow-lg' : 'bg-white border-primary/10 text-primary/40 hover:border-primary/30'
                  }`}
                >
                  <Wallet className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest">Offline (Cash)</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Summary Card */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-secondary/20 sticky top-24"
          >
            <div className="bg-primary p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 jaali-bg opacity-10"></div>
              <h2 className="text-2xl font-headline italic text-secondary relative z-10">Basket Valuation</h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4 max-h-[30vh] overflow-y-auto no-scrollbar">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.weight}-${item.orderType}`} className="flex justify-between items-start gap-4 pb-4 border-b border-primary/5">
                    <div className="space-y-0.5">
                      <p className="font-bold text-primary text-sm">{item.name}</p>
                      <p className="text-[10px] small-caps text-primary/60">
                        {item.weight} • {item.qty} Unit{item.qty > 1 ? 's' : ''}
                      </p>
                    </div>
                    <p className="font-bold text-primary text-sm">₹{item.price * item.qty}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="small-caps text-primary/40 text-xs">Total Amount</span>
                  <span className="text-4xl font-headline italic text-primary">₹{total}</span>
                </div>
                
                <button 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all gold-glow disabled:opacity-50"
                >
                  {isProcessing ? 'Transmitting...' : 'Confirm and Transmit'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
