"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Role {
  company: string;
  badge?: string;
  title: string;
  period: string;
  location: string;
  achievements: {
    headline: string;
    description: string;
    stat?: string;
  }[];
}

const experience: Role[] = [
  {
    company: "TringBox",
    badge: "NVIDIA Inception",
    title: "Software Development Intern",
    period: "Jul 2025 – Oct 2025",
    location: "Remote",
    achievements: [
      {
        headline: "Revolutionized IoT Data Infrastructure",
        description:
          "Spearheaded the design of a real-time MQTT event pipeline to replace a bottlenecked REST API architecture—enabling real-time device monitoring for a fleet of IoT hardware previously limited by polling delays.",
        stat: "95% less API volume • Sub-100ms latency",
      },
      {
        headline: "Automated a 3-Hour Billing Nightmare",
        description:
          "Orchestrated async integrations with ZOHO Books REST APIs, transforming a tedious monthly invoice workflow into a 5-minute automated process. Eliminated billing errors and freed finance bandwidth.",
        stat: "3+ hours → 5 minutes",
      },
      {
        headline: "Accelerated Dashboard Software",
        description:
          "Engineered server-side rendered analytics dashboards (Next.js + Node.js), reducing churn risk by giving stakeholders instant visibility into IoT metrics.",
        stat: "40% faster FCP • 50+ users",
      },
      {
        headline: "Hardened Database Under Load",
        description:
          "Optimized MongoDB query patterns and indexing strategy to sustain performance under concurrent traffic spikes—ensuring zero degradation during peak IoT event bursts.",
      },
    ],
  },
  {
    company: "Qrossway",
    title: "Contract Software Engineer",
    period: "Feb 2024 – Jan 2025",
    location: "Remote",
    achievements: [
      {
        headline: "Architected a CRM Platform from Zero",
        description:
          "Designed and built a full-stack real estate CRM (FastAPI + Next.js) to manage property listings and agent workflows—replacing fragmented spreadsheets with a unified system.",
        stat: "1000s of listings • Multi-agent collab",
      },
      {
        headline: "Unlocked Faster Search Queries",
        description:
          "Reengineered PostgreSQL schemas and indexing, eliminating frustrating lag for agents filtering high-volume property inventories under deadline pressure.",
        stat: "35% faster queries",
      },
      {
        headline: "Slashed Cloud Storage Costs",
        description:
          "Built an image processing pipeline (Sharp.js) compressing uploads from 2.5MB → 400KB—saving thousands in annualized cloud costs without sacrificing image quality.",
        stat: "80% cost reduction",
      },
    ],
  },
];

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Role["achievements"][0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative pl-6 border-l border-white/10 hover:border-system-red/50 transition-colors duration-500"
    >
      {/* Dot */}
      <div className="absolute left-0 top-1 w-2 h-2 -translate-x-[5px] rounded-full bg-white/20 group-hover:bg-system-red transition-colors duration-500" />

      {/* Content */}
      <div className="space-y-2">
        <h4 className="text-lg font-display font-bold text-foreground group-hover:text-chrome-light transition-colors duration-300">
          {achievement.headline}
        </h4>
        <p className="text-sm text-muted leading-relaxed">
          {achievement.description}
        </p>
        {achievement.stat && (
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded bg-system-red/10 border border-system-red/20">
            <span className="text-system-red font-mono text-xs font-medium">
              {achievement.stat}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RoleCard({ role, index }: { role: Role; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative p-8 md:p-10 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-all duration-500"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl md:text-3xl font-display font-black chrome-text">
              {role.company}
            </h3>
            {role.badge && (
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-system-red/10 text-system-red border border-system-red/20 rounded">
                {role.badge}
              </span>
            )}
          </div>
          <p className="text-chrome font-medium">{role.title}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-muted tracking-wider">
            {role.period}
          </p>
          <p className="font-mono text-xs text-muted/60 tracking-wider">
            {role.location}
          </p>
        </div>
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {role.achievements.map((achievement, i) => (
          <AchievementCard
            key={achievement.headline}
            achievement={achievement}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-32 px-6 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-system-red mb-4 block">
            Experience
          </span>
          <h2 className="text-heading font-display font-black tracking-tight">
            Where I&apos;ve made{" "}
            <span className="chrome-text">impact.</span>
          </h2>
        </motion.div>

        {/* Experience cards */}
        <div className="space-y-8">
          {experience.map((role, i) => (
            <RoleCard key={role.company} role={role} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
