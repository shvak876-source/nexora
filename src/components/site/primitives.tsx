"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const reduced = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y: 32, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/** Glass pill label above headings. */
export function Badge({ children, className, dot }: { children: React.ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn("glass beam inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-sm font-semibold text-foreground/90", className)}>
      {dot && <span aria-hidden className="size-2 rounded-full bg-ok [animation:pulse-ring_1.8s_ease-out_infinite]" />}
      {children}
    </span>
  );
}

export function SectionHead({
  badge,
  title,
  text,
  className,
  align = "center",
}: {
  badge: string;
  title: React.ReactNode;
  text?: string;
  className?: string;
  align?: "center" | "start";
}) {
  return (
    <Reveal className={cn("mb-14 grid gap-5", align === "center" ? "mx-auto max-w-3xl justify-items-center text-center" : "max-w-2xl", className)}>
      <Badge>{badge}</Badge>
      <h2 className="font-display text-[clamp(34px,5.2vw,64px)] leading-[1.05] font-black tracking-tight text-balance">{title}</h2>
      {text && <p className="max-w-[58ch] text-lg text-muted-foreground sm:text-xl">{text}</p>}
    </Reveal>
  );
}

const btnBase =
  "group inline-flex min-h-13 cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-base font-bold transition-[transform,box-shadow,background-color,border-color] duration-200 sm:text-[17px]";

export function CtaButton({
  href,
  children,
  variant = "accent",
  className,
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "glass";
  className?: string;
  arrow?: boolean;
}) {
  const styles = {
    accent:
      "shimmer bg-accent text-on-accent shadow-[0_0_0_1px_rgb(255_255_255/0.15)_inset,0_10px_40px_-8px_rgb(249_115_22/0.7)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2)_inset,0_16px_50px_-6px_rgb(249_115_22/0.85)]",
    glass: "glass text-foreground hover:border-white/25 hover:bg-white/[0.08]",
  }[variant];
  return (
    <a href={href} className={cn(btnBase, styles, className)}>
      {children}
      {arrow && <ArrowLeft aria-hidden className="size-[18px] transition-transform duration-200 group-hover:-translate-x-1" />}
    </a>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" aria-label="Nexora, לראש העמוד" className={cn("flex items-center gap-2.5", className)}>
      <span aria-hidden className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-blue via-violet to-accent shadow-[0_0_24px_-4px_var(--violet)]">
        <span className="font-display text-lg leading-none font-black text-white">N</span>
      </span>
      <b dir="ltr" className="font-display text-[22px] leading-none font-extrabold tracking-tight">Nexora</b>
    </a>
  );
}

/** Drifting aurora light, inspired by the 21st.dev "Aurora" backgrounds. */
export function Aurora({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} style={{ opacity: intensity }}>
      <div className="aurora-blob start-[-10%] top-[-20%] h-[60%] w-[55%] bg-blue [animation:drift-a_14s_ease-in-out_infinite]" />
      <div className="aurora-blob end-[-10%] top-[0%] h-[55%] w-[50%] bg-violet [animation:drift-b_12s_ease-in-out_infinite]" />
      <div className="aurora-blob start-[25%] top-[30%] h-[45%] w-[40%] bg-cyan opacity-30 [animation:drift-c_16s_ease-in-out_infinite]" />
    </div>
  );
}

/** Glass card whose glow follows the pointer. */
export function GlowCard({
  children,
  className,
  beam,
}: {
  children: React.ReactNode;
  className?: string;
  beam?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "glass group/card relative overflow-hidden rounded-3xl transition-[border-color,transform] duration-300 hover:border-white/20",
        beam && "beam",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 [background:radial-gradient(500px_circle_at_var(--mx,50%)_var(--my,0%),rgb(96_165_250/0.16),transparent_55%)]"
      />
      {children}
    </div>
  );
}

/** Counts up once when scrolled into view, inspired by the 21st.dev "Number Ticker". */
export function NumberTicker({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const c = animate(0, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduced, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}
