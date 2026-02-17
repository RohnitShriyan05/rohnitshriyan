"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  headline: string;
  subtext: string;
  tech: string[];
  accentColor: string;
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    id: "cellabyte",
    headline: "Natural Language to SQL.",
    subtext:
      "Privacy-preserving RAG pipeline using Gemini LLM. Schema masking and unified connectors for Postgres/Mongo.",
    tech: ["Python", "Gemini API", "SQL Validation"],
    accentColor: "#c0c0c0",
    liveUrl: "https://celabyte-dashboard.vercel.app",
    githubUrl: "https://github.com/RohnitShriyan05/celabyte",
  },
  {
    id: "neura-adapt",
    headline: "Attention Analytics.",
    subtext:
      "Real-time gaze tracking and emotion analysis pipeline using OpenCV. 70% reduction in manual review time.",
    tech: ["Python", "OpenCV", "MediaPipe"],
    accentColor: "#FF3333",
    liveUrl: "https://doraemon-pearl.vercel.app",
    githubUrl: "https://github.com/RohnitShriyan05/NeuraAdapt-AI-main",
  },
];

function WireframeVisual() {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className="w-full h-full max-w-[250px] mx-auto opacity-40 group-hover:opacity-70 transition-opacity duration-700"
    >
      <rect 
        x="40" y="40" width="120" height="120" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="0.5"
        className="group-hover:stroke-system-red transition-colors duration-500"
      />
      <line x1="40" y1="40" x2="70" y2="20" stroke="currentColor" strokeWidth="0.5" className="group-hover:opacity-0 transition-opacity duration-500" />
      <line x1="160" y1="40" x2="190" y2="20" stroke="currentColor" strokeWidth="0.5" className="group-hover:opacity-0 transition-opacity duration-500" />
      <line x1="160" y1="160" x2="190" y2="140" stroke="currentColor" strokeWidth="0.5" className="group-hover:opacity-0 transition-opacity duration-500" />
      <line x1="70" y1="20" x2="190" y2="20" stroke="currentColor" strokeWidth="0.5" className="group-hover:opacity-0 transition-opacity duration-500" />
      <line x1="190" y1="20" x2="190" y2="140" stroke="currentColor" strokeWidth="0.5" className="group-hover:opacity-0 transition-opacity duration-500" />
      <rect x="60" y="60" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.3" className="group-hover:opacity-0 transition-opacity duration-300" />
      <rect x="80" y="80" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="group-hover:opacity-0 transition-opacity duration-200" />
    </svg>
  );
}

function DatabaseVisual() {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className="w-full h-full max-w-[250px] mx-auto opacity-40 group-hover:opacity-70 transition-opacity duration-700"
    >
      <ellipse cx="100" cy="40" rx="50" ry="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <line x1="50" y1="40" x2="50" y2="160" stroke="currentColor" strokeWidth="0.5" />
      <line x1="150" y1="40" x2="150" y2="160" stroke="currentColor" strokeWidth="0.5" />
      <ellipse cx="100" cy="160" rx="50" ry="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="30" cy="80" r="5" fill="none" stroke="#c0c0c0" strokeWidth="0.5" className="group-hover:fill-chrome transition-all duration-500" />
      <line x1="35" y1="80" x2="50" y2="80" stroke="#c0c0c0" strokeWidth="0.3" />
      <circle cx="170" cy="100" r="5" fill="none" stroke="#c0c0c0" strokeWidth="0.5" className="group-hover:fill-chrome transition-all duration-500" />
      <line x1="150" y1="100" x2="165" y2="100" stroke="#c0c0c0" strokeWidth="0.3" />
      <circle cx="30" cy="140" r="5" fill="none" stroke="#c0c0c0" strokeWidth="0.5" className="group-hover:fill-chrome transition-all duration-500" />
      <line x1="35" y1="140" x2="50" y2="140" stroke="#c0c0c0" strokeWidth="0.3" />
    </svg>
  );
}

function PointCloudFace() {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className="w-full h-full max-w-[250px] mx-auto opacity-40 group-hover:opacity-70 transition-opacity duration-700"
    >
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 60 + Math.sin(i * 0.5) * 20;
        const x = 100 + Math.cos(angle) * radius * 0.8;
        const y = 100 + Math.sin(angle) * radius;
        return (
          <circle 
            key={i}
            cx={x} 
            cy={y} 
            r="1.5" 
            fill="currentColor"
            className="group-hover:fill-system-red transition-colors duration-500"
            style={{ transitionDelay: `${i * 10}ms` }}
          />
        );
      })}
      <circle cx="75" cy="90" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="125" cy="90" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <line x1="100" y1="100" x2="100" y2="130" stroke="currentColor" strokeWidth="0.3" />
      <path d="M 80 145 Q 100 155 120 145" fill="none" stroke="currentColor" strokeWidth="0.3" />
    </svg>
  );
}

const visuals = [WireframeVisual, DatabaseVisual, PointCloudFace];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function HorizontalProjects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = projects.length - 1;
      if (next >= projects.length) next = 0;
      return next;
    });
  };

  const project = projects[currentIndex];
  const Visual = visuals[currentIndex];

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-24 md:py-32 px-6 bg-background overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-system-red mb-4 block">
            Selected Work
          </span>
          <h2 className="text-heading font-display font-black tracking-tight">
            Projects that{" "}
            <span className="chrome-text">deliver results.</span>
          </h2>
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Main slide */}
          <div className="relative min-h-[450px] md:min-h-[400px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="group w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  {/* Visual */}
                  <div className="order-2 lg:order-1 h-[200px] lg:h-[300px] flex items-center justify-center text-chrome">
                    <Visual />
                  </div>

                  {/* Content */}
                  <div className="order-1 lg:order-2 space-y-6">
                    {/* Project label */}
                    <div className="flex items-center gap-4">
                      <span 
                        className="font-mono text-xs tracking-[0.3em] uppercase"
                        style={{ color: project.accentColor }}
                      >
                        Project {String(currentIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="h-[1px] flex-1 bg-white/10" />
                    </div>

                    {/* Headline */}
                    <h3 className="text-3xl md:text-5xl font-display font-black tracking-tight">
                      <span className="chrome-text">{project.headline}</span>
                    </h3>

                    {/* Subtext */}
                    <p className="text-base md:text-lg text-muted leading-relaxed max-w-lg">
                      {project.subtext}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-xs tracking-wider px-3 py-1.5 border border-white/10 text-chrome/70 rounded hover:border-system-red/50 hover:text-chrome transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-system-red/30 text-chrome hover:bg-system-red/10 hover:border-system-red rounded transition-all duration-300 font-mono text-xs tracking-wider"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-chrome hover:border-chrome hover:bg-white/5 rounded transition-all duration-300 font-mono text-xs tracking-wider"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
            {/* Dots */}
            <div className="flex items-center gap-3">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "bg-system-red w-8"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(-1)}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-muted hover:text-foreground hover:border-system-red/50 transition-all duration-300"
                aria-label="Previous project"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-muted hover:text-foreground hover:border-system-red/50 transition-all duration-300"
                aria-label="Next project"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
