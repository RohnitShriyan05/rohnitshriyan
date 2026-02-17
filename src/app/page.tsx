import dynamic from "next/dynamic";

const HeroLiquid = dynamic(
  () => import("@/components/sections/HeroLiquid").then((mod) => mod.HeroLiquid),
  { ssr: false }
);

const HorizontalProjects = dynamic(
  () => import("@/components/sections/HorizontalProjects").then((mod) => mod.HorizontalProjects),
  { ssr: false }
);

const Experience = dynamic(
  () => import("@/components/sections/Experience").then((mod) => mod.Experience),
  { ssr: false }
);

const TerminalFooter = dynamic(
  () => import("@/components/sections/TerminalFooter").then((mod) => mod.TerminalFooter),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative bg-background">
      <HeroLiquid />
      <Experience />
      <HorizontalProjects />
      <TerminalFooter />
    </main>
  );
}
