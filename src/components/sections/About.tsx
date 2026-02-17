"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: "1600+",
    label: "LeetCode Rating",
    sublabel: "Top 20%",
    accent: "text-neon-purple",
  },
  {
    value: "Top 1.6%",
    label: "ATF Fellowship",
    sublabel: "Finalist",
    accent: "text-electric-blue",
  },
  {
    value: "B.Tech CSE",
    label: "AI Specialization",
    sublabel: "Manipal Institute of Technology",
    accent: "text-neon-purple",
  },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/rohnit-shriyan",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/rohnit-shriyan",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:rohnitshriyan23@gmail.com",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
];

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  return (
    <section id="about" ref={sectionRef} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple mb-4 block">
            About
          </span>
          <h2 className="text-heading font-sans font-bold tracking-tight max-w-3xl">
            Building systems that{" "}
            <span className="gradient-text">learn and scale.</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-8 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-all duration-500"
            >
              <div
                className={`text-4xl md:text-5xl font-sans font-bold mb-2 ${stat.accent}`}
              >
                {stat.value}
              </div>
              <div className="text-foreground font-sans font-medium mb-1">
                {stat.label}
              </div>
              <div className="font-mono text-xs text-muted">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>

        {/* About text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <p className="text-lg text-muted leading-relaxed mb-6">
            I&apos;m a Computer Science Engineer specializing in AI and Backend
            Optimization, currently studying at{" "}
            <span className="text-foreground font-medium">
              Manipal Institute of Technology
            </span>
            . I focus on building intelligent systems that process data
            efficiently and deliver results in milliseconds.
          </p>
          <p className="text-lg text-muted leading-relaxed">
            From NL-to-SQL engines powered by LLMs to real-time IoT pipelines,
            I&apos;m passionate about the intersection of{" "}
            <span className="text-neon-purple">artificial intelligence</span>{" "}
            and{" "}
            <span className="text-electric-blue">
              high-performance architecture
            </span>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="relative py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          {/* Left: CTA */}
          <div>
            <h3 className="text-3xl md:text-5xl font-sans font-bold tracking-tight mb-6">
              Let&apos;s build something{" "}
              <span className="gradient-text">extraordinary.</span>
            </h3>
            <p className="text-muted text-lg mb-8 max-w-md">
              Always open to discussing new projects, creative ideas, or
              opportunities to be part of something great.
            </p>
            <a
              href="mailto:rohnitshriyan23@gmail.com"
              className="inline-flex items-center gap-3 font-mono text-sm tracking-wider uppercase px-8 py-4 bg-neon-purple text-white rounded-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-500"
            >
              <span>rohnitshriyan23@gmail.com</span>
              <svg
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
              </svg>
            </a>
          </div>

          {/* Right: Socials */}
          <div className="flex flex-col justify-end">
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-muted hover:text-foreground hover:border-neon-purple/50 hover:bg-neon-purple/5 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <span className="font-mono text-xs text-muted tracking-wider">
            © 2026 Rohnit Shriyan. All rights reserved.
          </span>
          <span className="font-mono text-xs text-muted/50 tracking-wider">
            Designed & built with Next.js, Three.js & Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
}
