"use client";

import { useEffect, useState, useRef } from "react";

interface TerminalLine {
  type: "command" | "output" | "link" | "stat";
  content: string;
  href?: string;
  delay: number;
}

const terminalLines: TerminalLine[] = [
  { type: "command", content: "rohnit.connect()", delay: 0 },
  { type: "output", content: "Establishing connections...", delay: 400 },
  { type: "link", content: "[200 OK] LinkedIn", href: "https://linkedin.com/in/rohnit-shriyan", delay: 800 },
  { type: "link", content: "[200 OK] GitHub", href: "https://github.com/rohnit-shriyan", delay: 1000 },
  { type: "link", content: "[200 OK] Email: rohnitshriyan23@gmail.com", href: "mailto:rohnitshriyan23@gmail.com", delay: 1200 },
  { type: "output", content: "", delay: 1400 },
  { type: "command", content: "rohnit.getStats()", delay: 1600 },
  { type: "stat", content: "LeetCode: Top 20% (1600+ Rating) | 400+ Problems Solved", delay: 2000 },
  { type: "stat", content: "ATF Fellowship: Top 1.6% Finalist", delay: 2200 },
  { type: "output", content: "", delay: 2400 },
  { type: "output", content: "Ready for new connections...", delay: 2600 },
];

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      setComplete(true);
      onComplete?.();
    }
  }, [displayed, text, onComplete]);

  return (
    <span>
      {displayed}
      {!complete && <span className="animate-blink">▋</span>}
    </span>
  );
}

function TerminalLineComponent({ line, isVisible }: { line: TerminalLine; isVisible: boolean }) {
  if (!isVisible) return null;

  if (line.type === "command") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-system-red">{">"}</span>
        <span className="text-chrome">
          <TypewriterText text={line.content} />
        </span>
      </div>
    );
  }

  if (line.type === "output") {
    return (
      <div className="text-muted">
        {line.content}
      </div>
    );
  }

  if (line.type === "link") {
    return (
      <a
        href={line.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-chrome hover:text-system-red transition-colors duration-300 group"
      >
        <span className="text-green-500">[200 OK]</span>{" "}
        <span className="group-hover:underline underline-offset-4">
          {line.content.replace("[200 OK] ", "")}
        </span>
      </a>
    );
  }

  if (line.type === "stat") {
    return (
      <div className="text-chrome/80 pl-4">
        → {line.content}
      </div>
    );
  }

  return null;
}

export function TerminalFooter() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            terminalLines.forEach((line, index) => {
              setTimeout(() => {
                setVisibleLines((prev) => [...prev, index]);
              }, line.delay);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative py-20 px-6 bg-background border-t border-white/5"
    >
      <div className="max-w-4xl mx-auto">
        {/* Terminal window */}
        <div className="terminal rounded-lg overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-system-red/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="font-mono text-xs text-muted ml-4">
              ~/rohnit-shriyan — zsh
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-2 min-h-[300px] font-mono text-sm">
            {terminalLines.map((line, index) => (
              <TerminalLineComponent
                key={index}
                line={line}
                isVisible={visibleLines.includes(index)}
              />
            ))}
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="font-mono text-xs text-muted tracking-wider">
            © 2026 Rohnit Shriyan. Precision engineered.
          </div>
          <div className="font-mono text-xs text-muted/50 tracking-wider">
            Built with Next.js • Three.js • GSAP
          </div>
        </div>
      </div>
    </footer>
  );
}
