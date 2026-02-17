"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Project {
  title: string;
  tag: string;
  stat?: string;
  description: string;
  accent: "purple" | "blue";
  size: "large" | "small";
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    title: "Cellabyte",
    tag: "AI / NL-to-SQL",
    description:
      "Natural language-to-SQL system using Gemini LLM. Includes privacy-preserving RAG pipeline and unified backend connectors.",
    accent: "purple",
    size: "large",
    liveUrl: "https://celabyte-dashboard.vercel.app",
    githubUrl: "https://github.com/RohnitShriyan05/celabyte",
  },
  {
    title: "Neura Adapt",
    tag: "Computer Vision / EdTech",
    description:
      "Real-time gaze tracking and engagement analysis pipeline using OpenCV and MediaPipe.",
    accent: "blue",
    size: "small",
    liveUrl: "https://doraemon-pearl.vercel.app",
    githubUrl: "https://github.com/RohnitShriyan05/NeuraAdapt-AI-main",
  },
  {
    title: "TringBox",
    tag: "IoT / Optimization",
    stat: "Cut API volume by 95%",
    description:
      "Implemented real-time MQTT pipelines and reduced event latency to sub-100ms.",
    accent: "purple",
    size: "small",
  },
  {
    title: "Qrossway",
    tag: "Full Stack / Architecture",
    stat: "Reduced storage costs by 80%",
    description:
      "Architected a CRM with FastAPI/Next.js and optimized PostgreSQL schemas for 35% faster queries.",
    accent: "blue",
    size: "large",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / centerY * -8);
    setRotateY((x - centerX) / centerX * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const isPurple = project.accent === "purple";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${
        project.size === "large" ? "md:col-span-2" : "md:col-span-1"
      }`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="perspective-card h-full"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className={`relative h-full min-h-[320px] p-8 rounded-2xl border transition-all duration-500 overflow-hidden group cursor-pointer ${
            isPurple
              ? "border-neon-purple/10 hover:border-neon-purple/30"
              : "border-electric-blue/10 hover:border-electric-blue/30"
          } bg-surface`}
        >
          {/* Hover gradient glow */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
              isPurple
                ? "bg-gradient-to-br from-neon-purple/5 via-transparent to-transparent"
                : "bg-gradient-to-br from-electric-blue/5 via-transparent to-transparent"
            }`}
          />

          {/* Corner accent */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
              isPurple
                ? "bg-gradient-to-bl from-neon-purple/10 to-transparent"
                : "bg-gradient-to-bl from-electric-blue/10 to-transparent"
            }`}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              {/* Tag */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`font-mono text-[11px] tracking-widest uppercase ${
                    isPurple ? "text-neon-purple" : "text-electric-blue"
                  }`}
                >
                  {project.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-sans font-bold text-foreground mb-3 tracking-tight">
                {project.title}
              </h3>

              {/* Stat */}
              {project.stat && (
                <div
                  className={`inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full ${
                    isPurple
                      ? "bg-neon-purple/10 text-neon-purple-light"
                      : "bg-electric-blue/10 text-electric-blue-light"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span className="font-mono text-xs font-medium">
                    {project.stat}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-muted leading-relaxed max-w-md">
                {project.description}
              </p>
            </div>

            {/* Links */}
            {(project.liveUrl || project.githubUrl) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider border transition-all duration-300 ${
                      isPurple
                        ? "border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10"
                        : "border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider border border-white/20 text-muted hover:text-foreground hover:bg-white/5 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            )}

            {/* Bottom arrow */}
            <div className="mt-6 flex items-center gap-2 text-muted group-hover:text-foreground transition-colors duration-300">
              <span className="font-mono text-xs tracking-wider uppercase">
                View Details
              </span>
              <motion.svg
                animate={isHovered ? { x: 4 } : { x: 0 }}
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </motion.svg>
            </div>
          </div>

          {/* Animated border highlight */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ${
              isPurple ? "bg-neon-purple/50" : "bg-electric-blue/50"
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  return (
    <section id="work" ref={sectionRef} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple mb-4 block">
            Selected Work
          </span>
          <h2 className="text-heading font-sans font-bold tracking-tight">
            Projects that{" "}
            <span className="gradient-text">push boundaries.</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
