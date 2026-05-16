import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, Utensils, Sparkles, ChevronRight, Check, MapPin, Star, Phone, User } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function BookTable() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('2');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const timeSlots = ['12:30 PM', '01:30 PM', '07:00 PM', '08:00 PM', '09:00 PM'];
  const partySizes = ['2', '4', '6', '8+'];

  const handleBookTable = async () => {
    if (!name || !phone || !date || !time) {
      toast.error("Please fill all details before securing your table.");
      return;
    }
    
    setIsBooking(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        name,
        phone,
        date,
        time,
        people,
        status: 'confirmed',
        createdAt: serverTimestamp()
      });
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error("Could not secure your table. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-16 pb-40">
      <header className="text-center relative py-12 md:py-24">
        <div className="absolute inset-0 jaali-bg opacity-5 -z-10 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 cinematic-glow -z-10 animate-pulse"></div>
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="small-caps text-secondary inline-flex items-center gap-3 bg-primary border border-secondary/20 px-8 py-3 rounded-full mb-8 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] animate-[shimmer_3s_infinite] skew-x-12"></div>
          <Utensils className="w-4 h-4 fill-current" />
          Experience Raghuveer Dining
        </motion.div>
        <h1 className="text-display italic text-primary drop-shadow-sm mb-6">Royal <br/><span className="text-secondary">Hospitality</span></h1>
        <p className="text-on-surface-variant font-body italic max-w-2xl mx-auto leading-relaxed px-6 text-xl opacity-70">
          "A meal at Raghuveer is not just dining; it's a celebration of family, heritage, and pure ingredients."
        </p>
      </header>

      {/* Booking Form — Prestige Design */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(87,0,0,0.08)] border border-primary/5 p-10 md:p-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 ornament-bg opacity-5 w-64 h-64 pointer-events-none"></div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* Left Column: Form Controls */}
              <div className="space-y-12">
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <User className="text-secondary w-6 h-6" />
                       <h3 className="font-headline font-light italic text-2xl text-primary">Guest Name</h3>
                    </div>
                    <input 
                      type="text"
                      placeholder="Your majestic name"
                      className="w-full bg-surface-container-low border-2 border-primary/5 rounded-3xl p-6 focus:ring-4 focus:ring-primary/5 transition-all font-headline italic text-xl text-primary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                 </div>

                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <Phone className="text-secondary w-6 h-6" />
                       <h3 className="font-headline font-light italic text-2xl text-primary">Contact</h3>
                    </div>
                    <input 
                      type="tel"
                      placeholder="Phone number"
                      className="w-full bg-surface-container-low border-2 border-primary/5 rounded-3xl p-6 focus:ring-4 focus:ring-primary/5 transition-all font-headline italic text-xl text-primary"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                 </div>

                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <Calendar className="text-secondary w-6 h-6" />
                       <h3 className="font-headline font-light italic text-2xl text-primary">The Date</h3>
                    </div>
                    <input 
                      type="date" 
                      className="w-full bg-surface-container-low border-2 border-primary/5 rounded-3xl p-6 focus:ring-4 focus:ring-primary/5 transition-all font-headline italic text-xl text-primary"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                 </div>

                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <Users className="text-secondary w-6 h-6" />
                       <h3 className="font-headline font-light italic text-2xl text-primary">The Party</h3>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                       {partySizes.map(size => (
                         <button 
                           key={size}
                           onClick={() => setPeople(size)}
                           className={`px-8 py-4 rounded-2xl font-black transition-all border-2 ${
                             people === size ? 'bg-primary text-secondary border-primary shadow-xl scale-110' : 'bg-white text-primary/40 border-primary/5 hover:border-primary/10'
                           }`}
                         >
                           {size === '8+' ? '8+ Souls' : `${size} Souls`}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <Clock className="text-secondary w-6 h-6" />
                       <h3 className="font-headline font-light italic text-2xl text-primary">The Hour</h3>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                       {timeSlots.map(slot => (
                         <button 
                           key={slot}
                           onClick={() => setTime(slot)}
                           className={`px-6 py-4 rounded-2xl small-caps transition-all border-2 ${
                             time === slot ? 'bg-primary text-secondary border-primary shadow-xl scale-110' : 'bg-white text-primary/40 border-primary/5 hover:border-primary/10'
                           }`}
                         >
                           {slot}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Right Column: Experience Preview */}
              <div className="space-y-12">
                 <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden luxury-border-gold shadow-2xl relative group">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC-F9-HjP_L097Yk1zH7r8z2M9M1D3pX-tI2m9_R8z-Y2m-Hj-W-M-S-T-Y-L-E" 
                      alt="Restaurant Ambiance" 
                      className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-60"></div>
                    <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                       <div className="space-y-1">
                          <span className="small-caps text-secondary text-[10px]">Private Hall</span>
                          <p className="text-white font-headline font-light italic text-2xl tracking-tighter">The Heritage Terrace</p>
                       </div>
                       <Star className="text-secondary fill-secondary w-6 h-6" />
                    </div>
                 </div>

                 <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/5 space-y-4">
                    <div className="flex justify-between items-center text-sm italic">
                       <span className="text-on-surface-variant font-medium">Reservation Fee</span>
                       <span className="text-primary font-black">₹0 (Complimentary)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm italic">
                       <span className="text-on-surface-variant font-medium">Cancellation Policy</span>
                       <span className="text-primary font-black">2 Hour Grace</span>
                    </div>
                    <div className="pt-4 border-t border-primary/10">
                       <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-widest text-center">
                          "Dine like royalty, feast like a family."
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="mt-20">
              <button 
                disabled={!date || !time || !name || !phone || isBooking}
                onClick={handleBookTable}
                className="w-full bg-primary text-secondary py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl hover:gold-glow hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group disabled:opacity-30 disabled:grayscale"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                {isBooking ? 'Securing Desk...' : 'Secure My Table'}
              </button>
           </div>
        </div>

        {/* Location Card */}
        <div className="mt-16 bg-white rounded-[3rem] p-8 border luxury-border flex flex-col md:flex-row items-center justify-between gap-8 group">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                 <MapPin className="text-secondary w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-primary font-headline font-black text-xl italic tracking-tight">Main Heritage Branch</h4>
                 <p className="text-[10px] uppercase font-black tracking-widest text-secondary/60">Badnera Rd, Near Rajapeth, Amravati</p>
              </div>
           </div>
           <button className="small-caps text-primary/40 hover:text-primary transition-colors">Get Directions</button>
        </div>
      </div>

      <AnimatePresence>
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-primary/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white rounded-[4rem] p-12 md:p-20 text-center max-w-2xl relative overflow-hidden"
             >
                <div className="absolute inset-0 ornament-bg opacity-5"></div>
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl scale-110">
                   <Check className="text-white w-12 h-12 stroke-[4]" />
                </div>
                <h2 className="text-5xl md:text-7xl font-headline font-light italic text-primary leading-none tracking-tighter mb-8 italic">Invitation <br/>Confirmed</h2>
                <p className="text-on-surface-variant font-body italic text-xl opacity-60 mb-12">
                   Your table for {people} Souls on {new Date(date).toDateString()} at {time} is now secured. We await your presence.
                </p>
                <button 
                  onClick={() => setStep(1)}
                  className="bg-primary text-secondary px-12 py-5 rounded-2xl small-caps hover:gold-glow hover:scale-110 transition-all"
                >
                  Return to Court
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
