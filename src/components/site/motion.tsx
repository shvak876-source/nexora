"use client";

// Scroll- and pointer-driven motion pieces. Every effect renders its final state
// when the viewer prefers reduced motion.

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useReduced } from "@/lib/a11y";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Thin gradient bar at the top that tracks page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-right bg-gradient-to-l from-cyan via-violet to-accent shadow-[0_0_12px_var(--violet)]"
    />
  );
}

/** Words rise one by one from behind a mask when scrolled into view. */
export function WordsReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduced = useReduced();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((raw, i) => {
        const glow = raw.startsWith("*") && raw.endsWith("*");
        const w = glow ? raw.slice(1, -1) : raw;
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span
            className={cn("inline-block", glow && "text-glow")}
            initial={reduced ? false : { y: "105%", rotate: 4 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: delay + i * 0.06, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && "\u00a0"}
          </span>
        );
      })}
    </span>
  );
}

/** A pinned sentence whose words light up as the page scrolls past. */
export function ScrollHighlight({ text, glowFrom }: { text: string; glowFrom: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = text.split(" ");
  return (
    <div ref={ref} className={cn("relative", reduced ? "" : "h-[220vh]")}>
      <div className={cn("flex items-center justify-center px-4 sm:px-6", reduced ? "py-32" : "sticky top-0 h-svh")}>
        <p className="mx-auto max-w-[1000px] text-center font-display text-[clamp(34px,6vw,80px)] leading-[1.12] font-black tracking-tight">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} glow={i >= glowFrom} reduced={!!reduced}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  glow,
  reduced,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  glow: boolean;
  reduced: boolean;
}) {
  // Light up within the first 85% of the pin so the last word lands before release.
  const opacity = useTransform(progress, [range[0] * 0.85, range[1] * 0.85], [0.12, 1]);
  const blur = useTransform(progress, [range[0] * 0.85, range[1] * 0.85], [6, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <>
      <motion.span style={reduced ? undefined : { opacity, filter }} className={cn("inline-block", glow && "text-glow")}>
        {children}
      </motion.span>{" "}
    </>
  );
}

/** Pulls its child toward the pointer. */
export function Magnetic({ children, strength = 0.3, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Tilts toward the pointer in 3D. */
export function Tilt({ children, className, max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  return (
    <div className={cn("[perspective:1200px]", className)}>
      <motion.div
        ref={ref}
        className="h-full [transform-style:preserve-3d]"
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          if (reduced || e.pointerType !== "mouse") return;
          const r = ref.current!.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry.set(px * max * 2);
          rx.set(-py * max * 2);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Marquee row that speeds up and flips direction with scroll velocity. */
export function VelocityRow({ children, baseVelocity }: { children: React.ReactNode; baseVelocity: number }) {
  const reduced = useReduced();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(0, 50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * Math.abs(move) * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  return (
    <motion.div className="flex w-max" style={{ x }}>
      {children}
      <div aria-hidden className="flex">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Pins a track and slides it sideways while the page scrolls down.
 * RTL: the track overflows to the left, so it moves right (positive x).
 */
export function HorizontalScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, distance]);
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <div ref={outer} className={cn("relative", className)} style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 px-[max(24px,calc((100vw-1180px)/2+24px))]">
          {children}
        </motion.div>
        <div className="mx-auto mt-12 h-px w-full max-w-[1132px] bg-white/10 px-6">
          <motion.div style={{ scaleX: fill }} className="h-full origin-right bg-gradient-to-l from-cyan via-violet to-accent shadow-[0_0_12px_var(--violet)]" />
        </div>
      </div>
    </div>
  );
}

/** Cards that pin and stack, each one shrinking a little as the next slides over it. */
export function StackCards({ items }: { items: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="relative grid gap-6">
      {items.map((item, i) => (
        <StackCard key={i} i={i} n={items.length} progress={scrollYProgress}>
          {item}
        </StackCard>
      ))}
    </div>
  );
}

function StackCard({ children, i, n, progress }: { children: React.ReactNode; i: number; n: number; progress: MotionValue<number> }) {
  const reduced = useReduced();
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.035]);
  const brightness = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.08]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);
  return (
    <div className="sticky" style={{ top: `calc(120px + ${i * 22}px)` }}>
      <motion.div style={reduced ? undefined : { scale, filter }} className="origin-top">
        {children}
      </motion.div>
    </div>
  );
}

/** Section background that opens from a rounded window to full bleed as it scrolls in. */
export function ClipReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 15%"] });
  const inset = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const clipPath = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${(i as number) * 0.6}% 0% round ${r}px)`);
  return (
    <motion.div ref={ref} style={reduced ? undefined : { clipPath }} className={className}>
      {children}
    </motion.div>
  );
}

/** Moves its child vertically at a different speed than the page. */
export function Parallax({ children, offset = 80, className }: { children: React.ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
