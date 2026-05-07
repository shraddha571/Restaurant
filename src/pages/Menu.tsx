import { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../constants';
import { Filter, Minus, Plus, Search, ShoppingBag, Sparkles, Star, Tag, Check, X, Package, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('mithai');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalWeight, setModalWeight] = useState('500g');
  const [modalOrderType, setModalOrderType] = useState<'parcel' | 'required_now'>('parcel');
  const [modalQty, setModalQty] = useState(1);
  const navigate = useNavigate();
  const addToCart = useStore(state => state.addToCart);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'premium', label: 'Premium' },
    { id: 'festival', label: 'Festival' },
    { id: 'veg', label: 'Eggless' },
  ];

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                          (activeFilter === 'premium' && product.tags?.includes('Premium')) ||
                          (activeFilter === 'festival' && product.tags?.includes('Festival')) ||
                          (activeFilter === 'veg' && true);
    return matchesCategory && matchesSearch && matchesFilter && !product.isOutOfStock;
  });

  const getWeightMultiplier = (weight: string) => {
    if (weight === '250g') return 0.5;
    if (weight === '1kg') return 2;
    return 1; // 500g is standard base for 500g price in data
  };

  const calculatePrice = (basePrice: number, weight: string) => {
    // Assuming base price in PRODUCTS is for 500g
    return Math.round(basePrice * getWeightMultiplier(weight));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const finalPrice = calculatePrice(selectedProduct.price, modalWeight);

    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: finalPrice,
      img: selectedProduct.image,
      weight: modalWeight,
      orderType: modalOrderType,
      qty: modalQty
    });

    toast.success(`${selectedProduct.name} added to your basket.`);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-24 md:space-y-40 pb-40 relative bg-[#FFF5E1]">
      <div className="absolute -inset-20 jaali-bg opacity-[0.03] pointer-events-none"></div>
      
      {/* Header — Prestige Intro */}
      <header className="flex flex-col lg:flex-row justify-between items-end gap-12 relative z-10 px-6 md:px-10 lg:px-20 pt-20">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-px bg-secondary"></div>
             <span className="small-caps text-secondary">The Collection</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-headline font-light italic text-primary tracking-tighter leading-none">Hamari Meethi <span className="text-secondary">Virasat</span></h1>
          <p className="text-on-surface-variant italic font-medium text-xl md:text-2xl opacity-70 max-w-xl">"A curated anthology of artisanal delights, crafted with pure desi ghee and devotion since 1970."</p>
        </div>
        
        <div className="w-full lg:w-96 space-y-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <input 
              type="text" 
              placeholder="Inquire products..." 
              className="w-full bg-white border luxury-border-gold rounded-full py-5 pl-16 pr-8 focus:ring-4 focus:ring-primary/2 transition-all italic text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-center lg:justify-end">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`small-caps px-4 py-2 rounded-full border transition-all ${
                  activeFilter === filter.id ? 'bg-primary text-secondary border-primary shadow-lg' : 'text-primary/40 border-primary/5 hover:border-primary/20'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="py-8 grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-6 px-6 md:px-10 lg:px-20">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300 border ${
              selectedCategory === cat.id 
                ? 'bg-primary text-secondary border-secondary shadow-[0_10px_30px_rgba(212,175,55,0.4)] scale-105' 
                : 'bg-white text-primary/60 border-primary/10 hover:border-secondary hover:text-primary hover:scale-105 hover:shadow-lg'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24 px-6 md:px-10 lg:px-20">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, i) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i % 3 * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedProduct(product);
                setModalWeight('500g');
                setModalOrderType('parcel');
                setModalQty(1);
              }}
            >
              <div className="relative aspect-[4/5] mb-10 overflow-hidden rounded-[10rem] luxury-border-gold group-hover:shadow-[0_40px_100px_rgba(87,0,0,0.15)] transition-all duration-700">
                <img 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-110" 
                  src={product.image} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://picsum.photos/seed/${product.name}/600/800`;
                  }}
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   <div className="bg-secondary text-primary px-8 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] shadow-[0_15px_40px_rgba(212,175,55,0.4)]">
                     Customize Order
                   </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex flex-col items-center justify-center gap-2">
                   <h3 className="text-3xl font-headline font-light italic text-primary leading-tight tracking-tight group-hover:text-secondary transition-colors">{product.name}</h3>
                   <span className="bg-primary/5 text-primary text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">{product.tags?.includes('Premium') ? 'Signature Heritage' : 'Pure Desi Ghee'}</span>
                </div>
                <p className="text-on-surface-variant text-sm font-medium italic leading-relaxed opacity-60 line-clamp-2 max-w-xs mx-auto group-hover:opacity-100 transition-opacity">
                  "{product.description}"
                </p>
                <div className="flex flex-col items-center gap-2 pt-2">
                   <span className="small-caps text-secondary/40 text-[10px]">Price per 500g</span>
                   <span className="text-4xl font-headline font-light text-primary italic">₹{product.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Product Selection Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full text-primary hover:bg-primary hover:text-white transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              <div className="w-full md:w-1/2 p-10 md:p-14 space-y-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <Sparkles className="w-5 h-5 text-secondary" />
                     <span className="small-caps text-secondary">Pure Heritage</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-headline font-light italic text-primary leading-tight tracking-tighter">{selectedProduct.name}</h2>
                  <p className="text-on-surface-variant italic opacity-70">"{selectedProduct.description}"</p>
                </div>

                <div className="space-y-8">
                  {/* Weight Selection */}
                  <div className="space-y-4">
                    <span className="small-caps text-primary/40 block">Select Weight</span>
                    <div className="flex gap-3">
                      {['250g', '500g', '1kg'].map(w => (
                        <button
                          key={w}
                          onClick={() => setModalWeight(w)}
                          className={`flex-1 py-4 rounded-xl font-bold transition-all border ${
                            modalWeight === w ? 'bg-primary text-secondary border-primary shadow-lg' : 'border-primary/10 text-primary/40 hover:border-primary/30'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Type Selection */}
                  <div className="space-y-4">
                    <span className="small-caps text-primary/40 block">Order Type</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setModalOrderType('parcel')}
                        className={`flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all border ${
                          modalOrderType === 'parcel' ? 'bg-primary text-secondary border-primary shadow-lg' : 'border-primary/10 text-primary/40 hover:border-primary/30'
                        }`}
                      >
                        <Package className="w-4 h-4" />
                        Parcel
                      </button>
                      <button
                        onClick={() => setModalOrderType('required_now')}
                        className={`flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all border ${
                          modalOrderType === 'required_now' ? 'bg-primary text-secondary border-primary shadow-lg' : 'border-primary/10 text-primary/40 hover:border-primary/30'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Required Now
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                    <div className="flex items-center gap-6">
                      <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="p-3 rounded-full border border-primary/10 text-primary hover:bg-primary/5 transition-all"><Minus className="w-4 h-4" /></button>
                      <span className="text-2xl font-headline italic font-bold text-primary w-8 text-center">{modalQty}</span>
                      <button onClick={() => setModalQty(modalQty + 1)} className="p-3 rounded-full border border-primary/10 text-primary hover:bg-primary/5 transition-all"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="text-right">
                      <span className="small-caps text-primary/40 block">Valuation</span>
                      <span className="text-4xl font-headline font-light text-primary italic">₹{calculatePrice(selectedProduct.price, modalWeight) * modalQty}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-secondary py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all gold-glow"
                  >
                    Add to Basket
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
