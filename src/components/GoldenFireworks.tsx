import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

// Define the type for our firework burst state
interface Burst {
  id: number;
  x: number;
  y: number;
  delay: number;
  scale: number;
}

export default function GoldenFireworks() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    // Generate a fixed number of bursts to ensure it's "minimal" and not distracting.
    const predefinedBursts: Burst[] = [
      { id: 1, x: 20, y: 30, delay: 0.5, scale: 0.9 },
      { id: 2, x: 80, y: 25, delay: 3.2, scale: 1.2 },
      { id: 3, x: 65, y: 60, delay: 6.8, scale: 0.7 },
      { id: 4, x: 15, y: 55, delay: 9.5, scale: 1.0 },
      { id: 5, x: 85, y: 50, delay: 12.1, scale: 0.8 },
    ];
    setBursts(predefinedBursts);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen opacity-100">
      {bursts.map((b) => (
        <div key={b.id} className="absolute inset-0">
          
          {/* Rocket Trail (Shoots up before burst) */}
          <motion.div
            className="absolute rounded-full w-[2px] h-16 bg-gradient-to-t from-transparent via-[#D4AF37] to-white shadow-[0_0_15px_#D4AF37]"
            style={{ left: `${b.x}%`, top: `${b.y}%`, x: '-50%' }}
            animate={{
              y: [300, 0, 0],
              opacity: [0, 1, 0, 0],
              scaleY: [1, 2, 0, 0]
            }}
            transition={{
              duration: 6, // Total cycle
              times: [0, 0.15, 0.2, 1], // Rocket shoots in the first 0.15 * 6 = 0.9 seconds
              delay: b.delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />

          {/* Main Burst Container */}
          <motion.div
            className="absolute"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            <motion.div style={{ scale: b.scale }}>
              {/* Center soft core glow reminiscent of Anar/Sparklers */}
              <motion.div 
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#D4AF37] rounded-full blur-xl"
                animate={{
                  opacity: [0, 0, 0.9, 0, 0]
                }}
                transition={{
                  duration: 6,
                  times: [0, 0.15, 0.2, 0.6, 1], // Appears exactly as rocket finishes at 0.15
                  delay: b.delay,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              
              {/* Main Sparkle Outburst */}
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute origin-bottom"
                  style={{ 
                    transform: `rotate(${i * 22.5}deg) translateY(-5px)`,
                    left: '-1px'
                  }}
                >
                  <motion.div
                    className="w-[2px] rounded-full bg-white shadow-[0_0_12px_4px_#D4AF37]"
                    animate={{
                      height: ["0px", "0px", "50px", "0px", "0px"],
                      y: [0, 0, -120, -140, -140],
                      opacity: [0, 0, 1, 0, 0]
                    }}
                    transition={{
                      duration: 6,
                      times: [0, 0.15, 0.25, 0.6, 1],
                      delay: b.delay,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                </motion.div>
              ))}

              {/* Falling Embers / Memories */}
              {[...Array(10)].map((_, i) => {
                const staticRndX = (Math.sin(i * 36) * 120); 
                const staticRndY = 80 + (Math.cos(i) * 60);
                return (
                  <motion.div
                    key={`ember-${i}`}
                    className="absolute rounded-full bg-[#FFF5D1] shadow-[0_0_12px_2px_#D4AF37]"
                    style={{ width: '5px', height: '5px', left: '-2.5px', top: '-2.5px' }}
                    animate={{
                      x: [0, 0, staticRndX, staticRndX],
                      y: [0, 0, staticRndY, staticRndY],
                      opacity: [0, 0, 1, 0, 0],
                      scale: [0, 0, 1.5, 0, 0]
                    }}
                    transition={{
                      duration: 6,
                      times: [0, 0.15, 0.4, 0.8, 1],
                      delay: b.delay + (i * 0.05),
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
