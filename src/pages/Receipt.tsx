import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, Package, Utensils, ArrowLeft, Receipt, Sparkles, Download } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Order } from '../types';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ReceiptPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    toast.loading('Generating Receipt PDF...', { id: 'download' });

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Raghuveer-Receipt-${order?.token || 'Order'}.pdf`);
      
      toast.success('Receipt Downloaded!', { id: 'download' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download receipt', { id: 'download' });
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        const orderData = { id: doc.id, ...doc.data() } as Order;
        
        // Real-time notification when status changes to completed
        if (order?.status !== 'completed' && orderData.status === 'completed') {
          toast.success("Your order is ready. Please collect it from the food counter.", {
            duration: 6000,
            icon: '🎉',
            style: {
              background: '#570000',
              color: '#D4AF37',
              fontWeight: 'bold'
            }
          });
        }
        
        setOrder(orderData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId, order?.status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5E1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFF5E1] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h2 className="text-3xl font-headline italic text-primary">Order Not Found</h2>
        <button onClick={() => navigate('/')} className="bg-primary text-secondary px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs">
          Return Home
        </button>
      </div>
    );
  }

  const getStatusStep = () => {
    switch (order.status) {
      case 'placed': return 1;
      case 'confirmed': return 2;
      case 'preparing': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  const steps = [
    { id: 'placed', label: 'Placed', icon: Receipt },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { id: 'preparing', label: 'Preparing', icon: Clock },
    { id: 'completed', label: 'Ready', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5E1] py-20 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline italic text-primary tracking-tighter">Order Confirmed Successfully</h1>
          <p className="text-on-surface-variant italic opacity-70">"Your meethi curation is being prepared with royal precision."</p>
        </motion.div>

        {/* Real-time Status Tracker */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 jaali-bg opacity-5 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-12">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const active = getStatusStep() > idx;
                const current = getStatusStep() === idx + 1;
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-3 flex-1 relative">
                    {/* Connector Line */}
                    {idx < steps.length - 1 && (
                      <div className={`absolute top-6 left-[60%] w-full h-0.5 ${getStatusStep() > idx + 1 ? 'bg-emerald-500' : 'bg-primary/10'}`} />
                    )}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      active ? 'bg-emerald-500 border-emerald-500 text-white' : 
                      current ? 'bg-primary/5 border-primary text-primary animate-pulse' : 
                      'bg-white border-primary/10 text-primary/20'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      active || current ? 'text-primary' : 'text-primary/20'
                    }`}>{step.label}</span>
                  </div>
                );
              })}
            </div>

            {order.status === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2"
              >
                <p className="text-emerald-700 font-bold text-lg">Your order is ready for pickup!</p>
                <p className="text-emerald-600/70 text-xs italic">Please collect it from the food counter.</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Receipt UI */}
        <motion.div 
          ref={receiptRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-secondary/20 relative"
        >
          {/* Receipt Header */}
          <div className="bg-primary p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 jaali-bg opacity-10 pointer-events-none"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
                <Receipt className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-3xl font-headline italic text-secondary tracking-tighter">Receipt of Curation</h2>
              <div className="bg-secondary/20 border border-secondary/30 px-6 py-2 rounded-xl inline-block mt-4">
                 <p className="text-[10px] small-caps text-secondary font-black tracking-[0.3em]">Token Number</p>
                 <p className="text-4xl font-headline font-black text-secondary">{order.token}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-8 pb-8 border-b border-primary/5">
              <div className="space-y-1">
                <p className="small-caps text-primary/40 text-[9px] font-bold">Customer</p>
                <p className="font-bold text-primary">{order.customerName}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="small-caps text-primary/40 text-[9px] font-bold">Phone</p>
                <p className="font-bold text-primary">{order.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="small-caps text-primary/40 text-[9px] font-bold">Order Type</p>
                <p className="font-bold text-primary flex items-center gap-2">
                  {order.orderType === 'dine-in' ? <Utensils className="w-4 h-4 text-secondary" /> : <Package className="w-4 h-4 text-secondary" />}
                  {order.orderType === 'dine-in' ? 'Dine-in' : 'Takeaway'}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="small-caps text-primary/40 text-[9px] font-bold">Payment</p>
                <p className="font-bold text-primary uppercase text-xs tracking-widest">{order.paymentMethod} ({order.paymentStatus})</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-primary/5 text-[10px] font-bold uppercase tracking-widest text-primary/40">
                <span>Product Description</span>
                <span className="text-right">Amount</span>
              </div>

              <div className="space-y-6">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-primary">{item.name || 'Unknown Item'}</p>
                      <p className="text-[10px] small-caps text-primary/60">
                        {item.weight || 'N/A'} • {item.qty || 1} Unit{(item.qty || 1) > 1 ? 's' : ''} • ₹{item.price || 0} ea.
                      </p>
                    </div>
                    <p className="font-bold text-primary whitespace-nowrap">₹{(item.price || 0) * (item.qty || 1)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="pt-8 border-t-2 border-dashed border-primary/10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="small-caps text-primary/40 text-xs">Total Valuation</span>
                <span className="text-5xl font-headline italic text-primary">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary/20"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-secondary/20"></div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-white border-2 border-primary text-primary py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Processing...' : 'Download Receipt'}
          </button>
          <button 
            onClick={() => navigate('/menu')}
            className="flex-1 bg-primary text-secondary py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all gold-glow"
          >
            Order More Mithaas
          </button>
        </div>
      </div>
    </div>
  );
}
