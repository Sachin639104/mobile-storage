import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SecureVaultLanding() {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const mainWrapperRef = useRef(null);

  const phrases = ["INVENTORY", "SHIPMENTS", "VAULT", "ASSETS"];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page fade
      gsap.from(mainWrapperRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      });

      const tl = gsap.timeline({ repeat: -1 });

      phrases.forEach((phrase) => {
        const chars = phrase
          .split("")
          .map(
            (char, i) =>
              `<span class="anim-char d-inline-block" key=${i}>
                ${char === " " ? "&nbsp;" : char}
              </span>`
          )
          .join("");

        tl.add(() => {
          textContainerRef.current.innerHTML = chars;
        });

        tl.fromTo(
          ".anim-char",
          {
            y: 80,
            rotateX: 110,
            opacity: 0,
          },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.04,
            ease: "elastic.out(1.1,0.4)",
          }
        );

        tl.to({}, { duration: 2 });

        tl.to(".anim-char", {
          opacity: 0,
          y: -20,
          rotateX: -30,
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.in",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className=" position-relative overflow-hidden 
      d-flex align-items-center justify-content-center"
      style={{height:"30vh" }}
    >
      {/* Background glow */}
      <div
        className="position-absolute rounded-circle"
        style={{

          width: "800px",
          height: "800px",
          background: "transparent",
          filter: "blur(150px)",
        }}
      />

      <main
        ref={mainWrapperRef}
        className="container-fluid text-center position-relative"
      >
        {/* Navbar logo */}
        <header className="position-fixed top-0 start-50 translate-middle-x mt-4">
          <span
            className="text-white fw-bold fs-3 border rounded-pill d-inline-block"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(15px)",
        
            }}
          >
            Storage
            <span className="text-primary">Vault</span>
          </span>
        </header>

        {/* Main animated heading */}
        <div style={{ perspective: "1500px" }}>
          <h1
            className="fw-bold text-white m-0"
            style={{
              fontSize: "clamp(2rem, 10vw, 7rem)",
              letterSpacing: "13px",
              lineHeight: "1",
              whiteSpace: "nowrap",
            }}
          >
            Secure{" "}
            <span
              ref={textContainerRef}
              className="text-primary d-inline-block"
              style={{
                textShadow: "0 0 50px rgba(13,110,253,0.8)",
                minWidth: "35vw",
              }}
            >
              INVENTORY
            </span>
          </h1>
        </div>

        {/* Floating text */}
        
      </main>
    </div>
  );
}