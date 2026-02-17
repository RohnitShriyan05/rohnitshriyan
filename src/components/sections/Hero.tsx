"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const Scene = dynamic(
  () => import("@/components/three/Scene").then((mod) => mod.Scene),
  { ssr: false }
);

function LatencyCounter() {
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 60) + 20);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-widest">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-sys-red animate-pulse-red" />
      <span className="text-muted-light">LATENCY:</span>
      <span className="text-sys-red text-glow-red font-bold tabular-nums">
        {latency}ms
      </span>
    </div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textTopRef = useRef<HTMLDivElement>(null);
  const textBottomRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        textTopRef.current,
        { y: 120, opacity: 0, skewY: 5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.4, delay: 0.3 }
      )
        .fromTo(
          textBottomRef.current,
          { y: 120, opacity: 0, skewY: 5 },
          { y: 0, opacity: 1, skewY: 0, duration: 1.4 },
          "-=1.0"
        )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.6"
        )
        .fromTo(
          badgeRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          counterRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-void"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Massive outline text - behind the glass */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-[1] pointer-events-none select-none">
        <div ref={textTopRef} className="overflow-hidden">
          <h1 className="font-display text-hero text-outline text-chrome-light tracking-tighter whitespace-nowrap">
            ROHNIT
          </h1>
        </div>
        <div ref={textBottomRef} className="overflow-hidden -mt-2 md:-mt-6">
          <h1 className="font-display text-hero text-outline text-chrome-light tracking-tighter whitespace-nowrap">
            SHRIYAN
          </h1>
        </div>
      </div>

      {/* 3D Glass Object - overlays and refracts text */}
      <Scene />

      {/* Bottom HUD overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-12 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* Left: Subtitle + Badge */}
          <div className="space-y-4">
            <div ref={subtitleRef}>
              <p className="font-sans text-subtitle text-chrome-dark max-w-md">
                Software Engineer & AI Specialist.
                <br />
                <span className="text-foreground">
                  Turning complex data into sub-100ms experiences.
                </span>
              </p>
            </div>
            <div ref={badgeRef}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-sys-red/20 rounded bg-sys-red/5">
                <span className="font-mono text-[10px] text-sys-red tracking-[0.2em] uppercase">
                  Open to Work
                </span>
              </div>
            </div>
          </div>

          {/* Right: Latency counter */}
          <div ref={counterRef}>
            <LatencyCounter />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted">
          Scroll
        </span>
        <div className="w-px h-10 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-sys-red to-transparent animate-scan" />
        </div>
      </div>

      {/* Corner coordinates */}
      <div className="absolute top-6 left-6 z-20 font-mono text-[10px] text-muted tracking-widest">
        48.8566° N, 2.3522° E
      </div>
      <div className="absolute top-6 right-6 z-20 font-mono text-[10px] text-muted tracking-widest">
        2026.02
      </div>
    </section>
  );
}
