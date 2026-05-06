import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
// If you have premium SplitText (GSAP club), use this:
// import { SplitText } from 'gsap/SplitText';
// gsap.registerPlugin(SplitText);

export default function SecureVaultLanding() {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const mainWrapperRef = useRef(null);
  
  const phrases = ["INVENTORY", "SHIPMENTS", "VAULT", "ASSETS"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Initial Page Load Animation
      gsap.from(mainWrapperRef.current, {
        opacity: 0,
        duration: 2,
        ease: "power2.out",
      });

      // 2. The Text Rotation Timeline
      const tl = gsap.timeline({ repeat: -1 });

      phrases.forEach((phrase, index) => {
        // --- This is where the magic happens (Manually splitting for free GSAP) ---
        // Create an array of <span>s for each character
        const chars = phrase.split('').map((char, i) => (
          `<span class="anim-char inline-block origin-center" key=${i}>
            ${char === ' ' ? '&nbsp;' : char}
          </span>`
        )).join('');

        tl.add(() => {
          // Set the new HTML characters inside the container
          textContainerRef.current.innerHTML = chars;
        });

        // --- THE STAGGERED ENTRANCE ANIMATION (Exactly like the video) ---
        tl.fromTo(".anim-char", 
          { 
            y: 80,         // Start low
            rotateX: 110,  // Flip open
            opacity: 0,    // Transparent
          }, 
          { 
            duration: 1.2,
            y: 0, 
            rotateX: 0, 
            opacity: 1, 
            stagger: 0.04,  // SEQUENCE THE CHARACTERS!
            ease: "elastic.out(1.1, 0.4)", // The exact bouncy ease
          }
        );

        // --- PAUSE AT THIS PHRASE ---
        tl.to({}, { duration: 2.2 }); // Wait here

        // --- THE FADE OUT ANIMATION ---
        tl.to(".anim-char", {
          duration: 0.5,
          opacity: 0,
          y: -20,
          rotateX: -30,
          stagger: 0.02,
          ease: "power2.in",
        });

      });
    }, containerRef); // Scope GSAP to this container

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center pt-20 pb-44 px-6">
      
      {/* Dynamic Mesh Background (keeps theme) */}
      <div className="bg-gradient-mesh fixed inset-0 z-0 opacity-40" />

      {/* Main Wrapper */}
      <main ref={mainWrapperRef} className="relative z-10 text-center main-wrapper max-w-7xl mx-auto">
        
        {/* Navbar-style header (isolated for landing page) */}
        <header className="fixed top-0 w-full z-50 px-10 py-8 text-center left-0">
          <span className="apple-glass text-xl font-black text-white px-8 py-3 rounded-full border border-white/10 tracking-tighter uppercase italic shadow-2xl">
            Storage<span className="text-blue-500">Vault</span>
          </span>
        </header>
        
        {/* --- 3D Header Container with Perspective --- */}
        <div style={{ perspective: '1500px' }} className="mt-32">
          <h1 className="text-9xl font-black text-white tracking-tighter leading-none select-none">
            Secure <br />
            
            {/* THIS IS THE CONTAINER THAT GSAP WILL POPULATE WITH SPANS */}
            <span 
              ref={textContainerRef} 
              className="text-blue-500 inline-block min-w-[500px] origin-center mt-6"
              style={{ textShadow: "0 0 50px rgba(59, 130, 246, 0.5)" }}
            >
              INVENTORY
            </span>
          </h1>
        </div>

        {/* Floating background graphics (like the GSAP video style) */}
        <div className="absolute -z-10 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-[30%] left-[10%] opacity-20 text-blue-400 rotate-12 text-6xl font-black italic">DEPLOY</div>
        <div className="absolute bottom-[20%] right-[10%] opacity-20 text-blue-400 -rotate-12 text-6xl font-black italic">PURCHASE</div>

      </main>
    </div>
  );
}