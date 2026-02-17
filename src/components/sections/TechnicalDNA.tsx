"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface MarqueeRow {
  label: string;
  items: string[];
  direction: "left" | "right";
  accent: string;
}

const rows: MarqueeRow[] = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "C++", "Java", "Python", "TypeScript", "C++", "Java"],
    direction: "left",
    accent: "text-neon-purple",
  },
  {
    label: "Core",
    items: [
      "Next.js",
      "FastAPI",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Next.js",
      "FastAPI",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],
    direction: "right",
    accent: "text-electric-blue",
  },
  {
    label: "AI/ML",
    items: [
      "Gemini API",
      "OpenCV",
      "MediaPipe",
      "RAG Pipelines",
      "Gemini API",
      "OpenCV",
      "MediaPipe",
      "RAG Pipelines",
    ],
    direction: "left",
    accent: "text-neon-purple",
  },
];

function MarqueeStrip({
  row,
  index,
}: {
  row: MarqueeRow;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: row.direction === "left" ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative overflow-hidden py-4 border-b border-white/5"
    >
      {/* Row label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pl-6">
        <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${row.accent}`}>
          {row.label}
        </span>
      </div>

      {/* Marquee container */}
      <div
        className={`flex whitespace-nowrap ${
          row.direction === "left" ? "animate-marquee" : "animate-marquee-reverse"
        }`}
      >
        {[...row.items, ...row.items].map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-6 mx-6 md:mx-10"
          >
            <span className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold text-foreground/10 hover:text-foreground/30 transition-colors duration-500 select-none">
              {item}
            </span>
            <span className={`text-lg ${row.accent} opacity-30`}>◆</span>
          </div>
        ))}
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </motion.div>
  );
}

export function TechnicalDNA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  return (
    <section id="stack" ref={sectionRef} className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-blue mb-4 block">
            Technical DNA
          </span>
          <h2 className="text-heading font-sans font-bold tracking-tight">
            The tools I{" "}
            <span className="gradient-text">think in.</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-0">
        {rows.map((row, i) => (
          <MarqueeStrip key={row.label} row={row} index={i} />
        ))}
      </div>
    </section>
  );
}
