import { 
  ArrowLeft, 
  Clock, 
  Package, 
  ShoppingCart, 
  User, 
  TrendingUp, 
  Bell, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Utensils,
  CreditCard,
  Wallet,
  Eye,
  EyeOff,
  Users,
  LogOut,
  Settings,
  LayoutDashboard,
  UtensilsCrossed
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Order, Product } from '../types';
import { PRODUCTS as STATIC_PRODUCTS } from '../constants';

const STATUS_FLOW: Order['status'][] = ['placed', 'confirmed', 'preparing', 'completed'];

const STATUS_COLORS = {
  placed: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  preparing: 'bg-purple-100 text-purple-700 border-purple-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time Orders
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Inventory
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (snapshot.empty) {
        setProducts(STATIC_PRODUCTS);
      } else {
        const productsData = snapshot.docs.map(doc => ({
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
      }
    });
    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = orders.filter(o => {
      if (!o.createdAt) return false;
      const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      return orderDate >= today;
    });

    return {
      totalCustomers: todaysOrders.length,
      revenue: todaysOrders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? (o.totalAmount || 0) : 0), 0),
      activeOrders: orders.filter(o => o.status !== 'completed').length
    };
  }, [orders]);

  const updateOrderStatus = async (orderId: string, currentStatus: Order['status']) => {
    // Specifically handle "Mark as Completed"
    const nextStatus = 'completed';

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: nextStatus,
        paymentStatus: 'paid' // Auto-mark as paid on completion
      });
      
      toast.success(`Order Ready! User notified.`, {
        icon: '🔔',
        duration: 4000
      });
    } catch (e) {
      console.error("Error updating status:", e);
      toast.error("Failed to update status");
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      const productRef = doc(db, 'products', product.id);
      await setDoc(productRef, {
        ...product,
        isOutOfStock: !product.isOutOfStock
      }, { merge: true });
      toast.success(product.isOutOfStock ? 'Item is now Available' : 'Item marked Out of Stock');
    } catch (e) {
      console.error("Error toggling stock:", e);
      toast.error("Failed to update stock");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 jaali-bg opacity-5 pointer-events-none"></div>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center space-y-8 relative z-10 border border-primary/10">
          <div className="w-20 h-20 bg-primary text-secondary rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <User className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-headline italic text-primary">Staff Authentication</h2>
            <p className="text-on-surface-variant text-xs small-caps tracking-widest">Amravati Heritage Terminal</p>
          </div>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && pin === '1234' && setIsAuthenticated(true)}
            className="w-full bg-surface-container border border-primary/10 rounded-2xl px-4 py-4 text-center tracking-[0.5em] text-primary focus:outline-none focus:border-primary transition-all font-bold text-xl"
            placeholder="****"
          />
          <button 
            onClick={() => {
              if (pin === '1234') {
                setIsAuthenticated(true);
                toast.success('Access Granted');
              } else {
                toast.error('Invalid Credentials');
              }
            }}
            className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f5f0]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-primary/5 flex flex-col p-8 hidden lg:flex sticky top-0 h-screen">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-secondary font-headline font-black text-xl italic text-center leading-none">R</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Raghuveer</p>
            <p className="text-[8px] font-bold text-primary/40 uppercase tracking-tighter">Heritage Amravati</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => scrollToSection('dashboard-top')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-primary/40 hover:bg-primary/5 hover:text-primary">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button onClick={() => scrollToSection('orders-section')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-primary/40 hover:bg-primary/5 hover:text-primary">
            <ShoppingCart className="w-5 h-5" />
            Live Orders
          </button>
          <button onClick={() => scrollToSection('stock-section')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-primary/40 hover:bg-primary/5 hover:text-primary">
            <UtensilsCrossed className="w-5 h-5" />
            Menu / Stock
          </button>
        </nav>

        <button className="mt-auto flex items-center gap-4 px-6 py-4 text-red-400 hover:text-red-600 transition-colors text-xs font-black uppercase tracking-widest">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12">
        <div id="dashboard-top" className="scroll-mt-12">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-headline italic text-primary">Admin Dashboard</h1>
              <p className="text-sm text-on-surface-variant italic opacity-60">Welcome back, Admin! Real-time operations active.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative p-3 bg-white rounded-full shadow-sm border border-primary/5 cursor-pointer">
                <Bell className="w-5 h-5 text-primary/40" />
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">3</span>
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center font-black text-xs">A</div>
                <p className="text-xs font-black uppercase tracking-widest">Admin</p>
              </div>
            </div>
          </header>

          {/* Top Navigation Tabs */}
          <div className="flex gap-4 mb-10 sticky top-0 z-20 bg-[#f8f5f0]/80 backdrop-blur-md py-4 border-b border-primary/5">
            <button 
              onClick={() => scrollToSection('orders-section')}
              className="bg-white border border-primary/10 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-secondary transition-all shadow-sm flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Orders
            </button>
            <button 
              onClick={() => scrollToSection('stock-section')}
              className="bg-white border border-primary/10 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-secondary transition-all shadow-sm flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Menu Stock
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 flex items-center gap-8 group">
            <div className="w-20 h-20 rounded-[1.5rem] bg-red-50 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-8 h-8 text-red-900" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary/40 mb-1">Total Customers Today</p>
              <p className="text-5xl font-headline font-black text-primary italic leading-none">{stats.totalCustomers}</p>
              <p className="text-[10px] text-primary/30 mt-2 font-bold">Total unique orders placed today</p>
            </div>
            <Users className="w-16 h-16 text-red-900/5 ml-auto" />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 flex items-center gap-8 group">
            <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary/40 mb-1">Revenue Collected Today</p>
              <p className="text-5xl font-headline font-black text-primary italic leading-none">₹ {stats.revenue.toLocaleString()}</p>
              <p className="text-[10px] text-primary/30 mt-2 font-bold">From all paid orders</p>
            </div>
            <TrendingUp className="w-16 h-16 text-emerald-600/5 ml-auto" />
          </div>
        </div>

        {/* Live Orders Section */}
        <section id="orders-section" className="bg-white rounded-[3rem] shadow-sm border border-primary/5 overflow-hidden mb-16 scroll-mt-24">
          <div className="p-8 border-b border-primary/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-red-900" />
              <h2 className="text-xl font-headline font-black text-primary italic">Live Orders</h2>
            </div>
            <div className="flex items-center gap-4">
              <Search className="w-4 h-4 text-primary/20" />
              <input 
                type="text" 
                placeholder="Search token..."
                className="bg-transparent text-xs font-bold focus:outline-none w-32"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] border-b border-primary/5">
                  <th className="px-10 py-6">Token No.</th>
                  <th className="px-10 py-6">Customer Name</th>
                  <th className="px-10 py-6">Phone No.</th>
                  <th className="px-10 py-6">Items</th>
                  <th className="px-10 py-6">Details</th>
                  <th className="px-10 py-6">Total Amount</th>
                  <th className="px-10 py-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                <AnimatePresence mode="popLayout">
                  {orders.filter(o => (o.token || '').toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={order.id} 
                      className="group hover:bg-primary/[0.01]"
                    >
                      <td className="px-10 py-8">
                        <span className="text-xl font-headline font-black text-secondary italic bg-secondary/10 px-4 py-2 rounded-xl">
                          #{order.token ? (order.token.includes('-') ? order.token.split('-')[1] : order.token) : (order.id?.slice(0, 4) || 'N/A')}
                        </span>
                      </td>
                      <td className="px-10 py-8 font-bold text-primary">{order.customerName || 'Guest'}</td>
                      <td className="px-10 py-8 text-primary/60 text-xs font-bold">{order.phone || 'N/A'}</td>
                      <td className="px-10 py-8 max-w-xs">
                        <div className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <p key={idx} className="text-xs text-primary/70 font-medium italic">
                              {item.qty} x {item.name} <span className="text-[10px] text-primary/30">({item.weight})</span>
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-2">
                          <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 w-fit">
                            {order.orderType || 'takeaway'}
                          </span>
                          <div className="flex gap-2">
                            <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 w-fit">
                              {order.paymentMethod || 'offline'}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border w-fit ${
                              order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {order.paymentStatus || 'unpaid'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-lg font-headline font-black text-primary italic">₹ {order.totalAmount || 0}</p>
                      </td>
                      <td className="px-10 py-8">
                        <button 
                          onClick={() => updateOrderStatus(order.id!, order.status)}
                          disabled={order.status === 'completed'}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            order.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {order.status === 'completed' ? 'Completed' : 'Mark as Completed'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-surface-container/30 border-t border-primary/5 flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary/30 animate-pulse" />
            <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">Orders update in real-time</p>
          </div>
        </section>

        {/* Menu Stock Management */}
        <section id="stock-section" className="bg-white rounded-[3rem] shadow-sm border border-primary/5 overflow-hidden scroll-mt-24 mb-32">
          <div className="p-8 border-b border-primary/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-5 h-5 text-red-900" />
              <h2 className="text-xl font-headline font-black text-primary italic">Menu Stock Management</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Out of Stock</span>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-[#fcfaf7] p-6 rounded-3xl border border-primary/5 flex flex-col gap-4 group transition-all hover:shadow-md">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-primary/5">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-primary truncate uppercase">{product.name}</h3>
                    <p className="text-[11px] font-bold text-primary/40">₹{product.price}</p>
                    <div className="mt-2">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${product.isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                         {product.isOutOfStock ? 'Out of Stock' : 'Available'}
                       </span>
                    </div>
                  </div>
                </div>
                
                {/* Toggle Switch */}
                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Stock Status</span>
                  <button 
                    onClick={() => toggleStock(product)}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                      product.isOutOfStock ? 'bg-red-200' : 'bg-emerald-500'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        product.isOutOfStock ? 'translate-x-1' : 'translate-x-7'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-surface-container/30 border-t border-primary/5 flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-primary/30" />
            <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">Stock changes reflect instantly on the ordering website.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
