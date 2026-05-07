import { ArrowRight, CalendarDays, ChefHat, Sparkles, Star, Utensils, Users, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { NavLink, useNavigate } from 'react-router-dom';
import LuxuryInteractiveBackground from '../components/LuxuryInteractiveBackground';
import GoldenFireworks from '../components/GoldenFireworks';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-40 md:space-y-64 pb-0 px-0 max-w-full mx-auto bg-[#FFF5E1]">
      <div className="px-6 md:px-10 lg:px-20 max-w-[1600px] mx-auto space-y-40 md:space-y-64">
        {/* Hero Section — Redesigned */}
        <section className="relative h-[calc(100vh-100px)] flex items-center overflow-hidden">
          {/* Static Mandala Background */}
          <div 
            className="absolute right-[-15%] md:right-[-10%] lg:right-[-5%] top-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] pointer-events-none z-0"
          >
            <img 
              src="/mandala.png" 
              alt="Mandala Background" 
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full relative z-10">
             <div className="lg:col-span-8 flex flex-col justify-center space-y-10">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                   <span className="small-caps text-secondary tracking-[0.5em] flex items-center gap-2 font-bold">
                     <Sparkles className="w-4 h-4" /> 
                     Since 1970
                   </span>
                </motion.div>
                
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
                  }}
                  className="space-y-6"
                >
                  <motion.h1 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                    }}
                    className="text-5xl md:text-7xl lg:text-[8rem] font-headline font-light text-primary leading-[0.9] tracking-tighter"
                  >
                     Har khushi ka <br/> 
                     <span className="text-secondary italic">asli swaad</span>
                  </motion.h1>
                  
                  <motion.p 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                    }}
                    className="font-body text-lg md:text-2xl lg:text-3xl italic text-primary/70 max-w-2xl font-light"
                  >
                    "From celebrations to traditions, we craft sweetness that becomes memory."
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <NavLink to="/menu" className="bg-primary text-secondary px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                     Explore Mithaas
                  </NavLink>
                  <NavLink to="/menu" className="bg-secondary text-primary px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                     Order Now
                  </NavLink>
                </motion.div>
             </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="relative overflow-hidden py-10">
           <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[300px] jaali-bg jaali-bg-animated opacity-20 pointer-events-none mix-blend-multiply"></div>
           
           <div className="mx-auto max-w-4xl text-center space-y-12 relative z-10">
              <span className="small-caps text-secondary inline-block font-bold uppercase tracking-[0.3em] text-[10px]">Our Devotion</span>
              <h2 className="text-5xl md:text-8xl font-headline font-light italic text-primary leading-tight tracking-tighter">
                "We do not create sweets; we curate heritage moments."
              </h2>
              <div className="flex justify-center my-10">
                <svg className="w-32 h-6 calligraphy-stroke-anim" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M5 10 Q 25 20, 50 10 T 95 10" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8"/>
                </svg>
              </div>
              <p className="text-on-surface-variant text-xl md:text-2xl font-body italic leading-relaxed max-w-3xl mx-auto opacity-70">
                Each piece is a testament to fifty years of relentless purity — hand-selected Mamra almonds, Saffron from the valley, and Desi Ghee crafted in our own estates.
              </p>
           </div>
        </section>

        {/* Bespoke Experience — Custom Callout */}
        <section className="bg-primary p-20 md:p-32 rounded-[6rem] relative overflow-hidden text-center group">
           <div className="absolute inset-0 ornament-bg opacity-10"></div>
           <div className="relative z-10 space-y-12">
              <span className="small-caps text-secondary uppercase tracking-[0.3em] text-[10px] font-bold">Bespoke Experience</span>
              <h2 className="text-5xl md:text-8xl font-headline font-light italic text-secondary leading-none tracking-tighter max-w-4xl mx-auto">
                 "Can't find your childhood memory? We'll recreate it for you."
              </h2>
              <div className="w-24 h-px bg-secondary/20 mx-auto"></div>
              <button onClick={() => navigate('/custom')} className="bg-secondary text-primary px-12 py-6 rounded-2xl small-caps hover:gold-glow hover:scale-110 transition-all font-bold uppercase tracking-widest text-[10px]">Consult Our Master Chef</button>
           </div>
        </section>

        {/* Dine Section */}
        <section className="space-y-20 relative">
          <div className="absolute -inset-20 jaali-bg jaali-bg-animated opacity-[0.03] pointer-events-none"></div>
          <div className="flex justify-between items-end relative z-10">
             <div>
               <span className="small-caps text-secondary mb-4 block font-bold uppercase tracking-[0.3em] text-[10px]">Experience Raghuveer</span>
               <h2 className="text-5xl md:text-7xl font-headline font-light italic text-primary tracking-tighter">Royal Hospitality</h2>
             </div>
             <NavLink to="/menu" className="hidden md:block small-caps text-primary border-b border-primary/20 pb-2 hover:text-secondary transition-colors font-bold uppercase tracking-widest text-[10px]">Explore All Thalis</NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto xl:h-[800px] relative z-10">
             <motion.div 
               whileHover={{ y: -10 }}
               className="md:col-span-7 bg-white rounded-[4rem] overflow-hidden luxury-border-gold flex flex-col p-12 md:p-20 relative group shadow-[0_30px_60px_rgba(87,0,0,0.05)]"
             >
                <div className="absolute top-10 right-10 luxury-border p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChefHat className="w-8 h-8 text-secondary" />
                </div>
                <div className="space-y-8 mt-auto relative z-10">
                   <h3 className="text-4xl md:text-6xl font-headline font-light italic text-primary tracking-tighter">The Royal Table</h3>
                   <p className="text-on-surface-variant text-lg italic max-w-lg">A sanctuary of flavors featuring our 24-course Maharaja Thali, served with the silver-spoon protocol. Perfect for family celebrations.</p>
                   <NavLink to="/book-table" className="bg-primary text-secondary px-10 py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[10px] hover:gold-glow transition-all inline-block shadow-2xl hover:scale-105">Book a Table</NavLink>
                </div>
             </motion.div>

             <div className="md:col-span-5 grid grid-rows-2 gap-8">
                <div className="bg-primary rounded-[4rem] p-12 text-white relative overflow-hidden group luxury-border-gold">
                   <div className="absolute inset-0 ornament-bg opacity-10"></div>
                   <h4 className="text-3xl font-headline font-light italic text-secondary mb-4 relative z-10">Intimate Events</h4>
                   <p className="text-white/60 text-sm italic mb-8 max-w-xs relative z-10">Host your legacy celebrations in our private AC chambers. Memories created over perfect meals.</p>
                   <Sparkles className="absolute -bottom-10 -right-10 w-40 h-40 text-secondary opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                </div>
                <div className="bg-white rounded-[4rem] p-12 flex flex-col justify-center gap-6 luxury-border-gold overflow-hidden group shadow-[0_30px_60px_rgba(87,0,0,0.05)]">
                   <div className="flex gap-1 text-secondary">
                      <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                   </div>
                   <p className="text-xl font-headline italic font-medium leading-tight text-primary">"The most expensive taste in central India, yet every rupee is justified by the purity."</p>
                   <span className="small-caps opacity-30 font-bold uppercase tracking-widest text-[10px]">— Estate Review</span>
                </div>
             </div>
          </div>
        </section>

        {/* Art of Gifting — Luxury Hampers */}
        <section className="bg-primary p-20 md:p-32 rounded-[6rem] relative overflow-hidden text-center group shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
           <div className="relative z-10 space-y-12">
              <span className="small-caps text-secondary uppercase tracking-[0.3em] text-[10px] font-bold">The Art of Gifting</span>
              <h2 className="text-5xl md:text-8xl font-headline font-light italic text-white leading-none tracking-tighter max-w-4xl mx-auto">
                 Gift the Taste of Celebration
              </h2>
              <p className="text-white/70 font-body italic text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
                "Sirf mithai nahi — yaadein bhejiye." From magnificent Shaadi hampers to exquisite festival boxes, curate a customized legacy gift.
              </p>
              <button onClick={() => navigate('/custom')} className="bg-secondary text-primary px-12 py-6 rounded-2xl small-caps hover:gold-glow hover:scale-110 transition-all font-bold uppercase tracking-widest text-[10px]">Curate Your Box</button>
           </div>
        </section>

        {/* Featured Collection */}
        <section className="space-y-20 relative">
           <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center relative z-10"
           >
              <span className="small-caps text-secondary mb-4 block font-bold uppercase tracking-[0.3em] text-[10px]">Signature Pieces</span>
              <h2 className="text-5xl md:text-8xl font-headline font-light italic text-primary tracking-tight leading-none mb-6">Hamari Meethi Virasat</h2>
              <p className="text-on-surface-variant font-body italic max-w-xl mx-auto opacity-70">Crafted with pure desi ghee and an abundance of love. These are the sweets that have witnessed half a century of weddings, festivals, and joyous reunions.</p>
           </motion.div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { name: 'Imperial Katli', price: '₹2,400', tag: 'Signature sweet since 1970', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlm6NCzLr1LPC91vlVJQpuceXITDCjK764xy1Pu6lOduQpngbRC1g__kVmVtcUtHvSctJ7aDqRGeYa8Fv02Xr2_Sss_pXVu4SC9lvJghUBceUMMQ7TuNXqDr7t-GfwhXELWU-gRNXX2hNm8I6BjDAfxrgwUSAWCkDGCIIJopAbkVL7hgj5f5n7yKes7gxXd7GO_h8W6aQYdW7s3I6JH3SNGJnNEMrjJdHnOn7xsgLxdNj3zPYda14oyIZYc4mqetc3NvxNeaRSBIw' },
                { name: 'Saffron Peda', price: '₹1,800', tag: 'Made with pure desi ghee', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCthILhOrJMRr7rJ0uZoebUObnfL0uu12gyIONSmYabL66j10PCYlA_0hZeh2wafJPsLvuKJrNSOyCamTvNi-1RqbGEf25PFjVLkgklsCznL0yYIa_9Ozd7JtiwTA6DlObUDeUYUZMr911K8s2mnR2VPgR7GZuHByLzsFsgpmIXu_MjsKl4vFgBcqbamxzZD9bka7SVXgPJ0vpCEOiaMIHQ6-PkeaAVOy73Pa6PQ6nao7U2V86omc48gPV1qP6kzB2rhDc9Mw6m5U4' },
                { name: 'Heritage Ladoo', price: '₹1,200', tag: 'Festive bestseller', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJrwLmmqxvNuzCkhYHnWi3wGhU8AHTnx4qMMbBRP1JA2f_iSUDYnDkAkrt8Y2ZOH19csDYPjlzAL1dPj9BZ4E_WxPefX6lOF88Vmm40WUaVRSuDP4nWby0UBmfwKVlCmtuAkdM9WJdfEajD0f5CIo3zhqBGAUpDnPIRn2XJ5-iel5oPR8oEjbU5Ge2fsrpBtlXhnpCCogzROltfJ8hhYYGl9XdOlIq4twx4a0EMdLqWnisDEfoOY8296GqsD-EqwZe4CcDfklJgDQ' },
                { name: 'Royal Pista Roll', price: '₹3,200', tag: 'Rich Kashmiri Pistachios', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUgGBrIQ-7bWaj-eLPDwa0a_KG_L1wTiej6mv28HOtUz5IrQhwFZNa9uF2BBfY17pnRJ9vHgGijj4fSR7DSqd4eyeADtNUn_UOdmEWdTxGwRqXIujc9EMIxpovai1_VQLgvO8HUxpujYWHgLVbUS1TLlQhz-sWEzRxvbD0V4GhfXe3jZCLWlDJto__EFG9qb9VD57P0lDfzkgiXssVi90OKplHtN2MQNw19CT1KngR39txYZrDmcvWKGmgZyccoy8ut6dBIGXqHqY' }
              ].map((item, i) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="group"
                >
                   <div className="aspect-square rounded-[3rem] overflow-hidden luxury-border-gold mb-6 relative">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <NavLink to="/menu" className="bg-secondary text-primary px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest">Select Details</NavLink>
                      </div>
                   </div>
                   <h3 className="text-2xl font-headline italic text-primary">{item.name}</h3>
                   <p className="text-secondary font-bold">{item.price}</p>
                   <p className="text-[10px] small-caps opacity-40 font-bold uppercase tracking-widest">{item.tag}</p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Inner Sanctum — Location & Experience */}
        <section className="relative py-20 overflow-hidden">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-7 space-y-10">
                 <span className="small-caps text-secondary uppercase tracking-[0.3em] text-[10px] font-bold">The Estate</span>
                 <h2 className="text-6xl md:text-[7rem] font-headline font-light italic text-primary leading-[0.9] tracking-tighter">
                    Visit Our <br/> <span className="text-secondary">Inner Sanctum</span>
                 </h2>
                 <p className="text-on-surface-variant font-body italic text-xl md:text-2xl opacity-70 leading-relaxed max-w-2xl">
                    Located in the heart of Amravati, our flagship store is a masterpiece of colonial architecture and modern luxury.
                 </p>
                 <button className="bg-primary text-secondary px-12 py-6 rounded-2xl small-caps hover:gold-glow hover:scale-110 transition-all font-bold uppercase tracking-widest text-[10px]">Directions to Heritage</button>
              </div>
              <div className="lg:col-span-5 relative group">
                 <div className="aspect-[4/5] rounded-[5rem] overflow-hidden luxury-border-gold shadow-2xl">
                    <img src="https://picsum.photos/seed/store/800/1000" alt="Raghuveer Store" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                 </div>
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full p-8 shadow-2xl luxury-border-gold flex items-center justify-center animate-floating-motif">
                    <MapPin className="w-12 h-12 text-secondary" />
                 </div>
              </div>
           </div>
        </section>
      </div>

        {/* Footer — Legacy & Connections */}
        <footer className="bg-primary text-secondary p-20 md:p-32 rounded-t-[6rem] relative overflow-hidden mt-40 md:mt-64">
           <div className="absolute inset-x-0 top-0 h-24 overflow-hidden pointer-events-none opacity-20">
              <div className="flex gap-4">
                 {[...Array(20)].map((_, i) => (
                   <div key={i} className="w-24 h-24 rounded-full border border-secondary/30 -translate-y-12 shrink-0"></div>
                 ))}
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-12 gap-20 relative z-10">
              <div className="md:col-span-4 space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                       <span className="font-headline font-black text-3xl italic">R</span>
                    </div>
                    <h2 className="text-4xl font-headline italic tracking-tighter">Raghuveer</h2>
                 </div>
                 <p className="small-caps opacity-60 text-[10px] tracking-widest leading-loose font-bold uppercase">
                    Est. 1970 • Amravati <br/>
                    Pure Desi Ghee Heritage <br/>
                    Central India's Finest Curation
                 </p>
              </div>
              
              <div className="md:col-span-4 space-y-10">
                 <span className="small-caps text-[10px] opacity-40 uppercase tracking-[0.3em] font-bold">Meethi Virasat</span>
                 <nav className="flex flex-col gap-6">
                    <NavLink to="/menu" className="font-headline italic text-2xl hover:text-white transition-colors">Our Philosophy</NavLink>
                    <NavLink to="/menu" className="font-headline italic text-2xl hover:text-white transition-colors">Master Chefs</NavLink>
                    <NavLink to="/menu" className="font-headline italic text-2xl hover:text-white transition-colors">Purity Protocols</NavLink>
                 </nav>
              </div>

              <div className="md:col-span-4 space-y-10">
                 <span className="small-caps text-[10px] opacity-40 uppercase tracking-[0.3em] font-bold">Reach Us</span>
                 <div className="space-y-6 italic">
                    <p className="text-2xl font-headline">+91 98765 43210</p>
                    <p className="text-2xl font-headline">namaste@raghuveer.com</p>
                    <p className="opacity-60 font-bold uppercase tracking-widest text-[10px]">Amravati, Maharashtra</p>
                 </div>
              </div>
           </div>

           {/* Bottom Copyright Line */}
           <div className="mt-32 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <p className="small-caps text-[9px] opacity-40 tracking-widest">© 2026 RAGHUVEER HERITAGE</p>
              <div className="flex items-center gap-6">
                 <div className="h-px w-12 bg-secondary/30"></div>
                 <p className="font-headline italic text-xl opacity-80">The Gold Standard of Sweets</p>
                 <div className="h-px w-12 bg-secondary/30"></div>
              </div>
              <p className="small-caps text-[9px] opacity-40 tracking-widest">ALL RIGHTS RESERVED</p>
           </div>
        </footer>
    </div>
  );
}
