"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { AppWindow, BarChart3, CreditCard, MapPin, MessageCircle, Smartphone } from "lucide-react";
import { SectionHead } from "./primitives";
import { cn } from "@/lib/utils";
import { useReduced } from "@/lib/a11y";

const nodes = [
  { icon: AppWindow, label: "אתר", note: "פנייה חדשה" },
  { icon: BarChart3, label: "מערכת ניהול", note: "לקוח נשמר" },
  { icon: CreditCard, label: "סליקה", note: "תשלום התקבל" },
  { icon: MessageCircle, label: "וואטסאפ", note: "תזכורת נשלחה" },
  { icon: Smartphone, label: "אפליקציה", note: "הזמנה חדשה" },
  { icon: MapPin, label: "גוגל", note: "גולש מצא אתכם" },
];

type Path = { d: string; delay: number; duration: number };

/** Curved paths from each node's center into the hub, re-measured on resize. */
function useBeamPaths(container: React.RefObject<HTMLDivElement | null>, hub: React.RefObject<HTMLDivElement | null>, items: React.RefObject<(HTMLDivElement | null)[]>) {
  const [paths, setPaths] = useState<Path[]>([]);
  useLayoutEffect(() => {
    const measure = () => {
      const c = container.current?.getBoundingClientRect();
      const h = hub.current?.getBoundingClientRect();
      if (!c || !h) return;
      const hx = h.left + h.width / 2 - c.left;
      const hy = h.top + h.height / 2 - c.top;
      setPaths(
        (items.current ?? []).map((el, i) => {
          if (!el) return { d: "", delay: 0, duration: 0 };
          const r = el.getBoundingClientRect();
          const x = r.left + r.width / 2 - c.left;
          const y = r.top + r.height / 2 - c.top;
          const dx = hx - x;
          const dy = hy - y;
          const d =
            Math.abs(dx) > Math.abs(dy)
              ? `M ${x} ${y} C ${x + dx * 0.55} ${y}, ${hx - dx * 0.45} ${hy}, ${hx} ${hy}`
              : `M ${x} ${y} C ${x} ${y + dy * 0.55}, ${hx} ${hy - dy * 0.45}, ${hx} ${hy}`;
          return { d, delay: i * 0.45, duration: 2.6 + (i % 3) * 0.4 };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (container.current) ro.observe(container.current);
    return () => ro.disconnect();
  }, [container, hub, items]);
  return paths;
}

function Node({
  n,
  i,
  inView,
  reduced,
  setRef,
}: {
  n: (typeof nodes)[number];
  i: number;
  inView: boolean;
  reduced: boolean;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <motion.div
      ref={setRef}
      initial={reduced ? false : { opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 grid justify-items-center gap-2 text-center"
    >
      <span className="glass grid size-14 place-items-center rounded-2xl text-primary shadow-[0_0_30px_-10px_var(--blue)] sm:size-16">
        <n.icon aria-hidden className="size-6 sm:size-7" />
      </span>
      <span className="text-[15px] font-bold">{n.label}</span>
      <span className="hidden text-xs text-muted-foreground sm:block">{n.note}</span>
    </motion.div>
  );
}

export function Connections() {
  const container = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const paths = useBeamPaths(container, hub, items);
  const inView = useInView(container, { once: true, margin: "-120px" });
  const reduced = useReduced();
  const side = (from: number) => nodes.slice(from, from + 3);

  return (
    <section className="relative py-[clamp(80px,11vw,140px)]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionHead
          badge="הכל מתחבר"
          title="האתר, המערכת והאפליקציה *מדברים* *ביניהם.*"
          text="פנייה מהאתר נכנסת למערכת, התזכורת יוצאת בוואטסאפ והתשלום נרשם לבד. בלי להעתיק נתונים ידנית."
        />
        <div
          ref={container}
          role="img"
          aria-label="תרשים: אתר, מערכת ניהול, סליקה, וואטסאפ, אפליקציה וגוגל מחוברים כולם ל-Nexora"
          className="relative mx-auto grid max-w-[900px] grid-rows-[auto_auto_auto] gap-y-16 md:grid-cols-[1fr_auto_1fr] md:grid-rows-1 md:items-center md:gap-x-10"
        >
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="beam-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0" />
                <stop offset="40%" stopColor="var(--cyan)" />
                <stop offset="75%" stopColor="var(--violet)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            {paths.map((p, i) =>
              p.d ? (
                <g key={i}>
                  <path d={p.d} fill="none" stroke="rgb(255 255 255 / 0.09)" strokeWidth="1.5" />
                  {inView && !reduced && (
                    <path
                      d={p.d}
                      pathLength={1}
                      fill="none"
                      stroke="url(#beam-grad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="0.22 1"
                      style={{
                        filter: "drop-shadow(0 0 6px var(--violet))",
                        animation: `beam-flow ${p.duration}s linear ${p.delay}s infinite both`,
                      }}
                    />
                  )}
                </g>
              ) : null,
            )}
          </svg>

          <div className="grid grid-cols-3 gap-4 md:grid-cols-1 md:gap-12">
            {side(0).map((n, i) => (
              <Node key={n.label} n={n} i={i} inView={inView} reduced={!!reduced} setRef={(el) => {
                  items.current[i] = el;
                }} />
            ))}
          </div>

          <motion.div
            ref={hub}
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="relative z-10 grid place-items-center justify-self-center"
          >
            <span aria-hidden className="absolute size-44 rounded-full bg-violet/30 blur-[50px]" />
            <span aria-hidden className="absolute size-36 rounded-full border border-white/10 [animation:hub-ring_3s_ease-out_infinite]" />
            <span
              className={cn(
                "beam relative grid size-28 place-items-center rounded-[28px] bg-gradient-to-br from-blue via-violet to-accent font-display text-5xl font-black text-white",
                "shadow-[0_0_60px_-10px_var(--violet),inset_0_1px_0_rgb(255_255_255/0.35)]",
              )}
            >
              N
            </span>
            <span className="absolute -bottom-9 text-[15px] font-bold whitespace-nowrap">Nexora</span>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 md:grid-cols-1 md:gap-12">
            {side(3).map((n, i) => (
              <Node key={n.label} n={n} i={i + 3} inView={inView} reduced={!!reduced} setRef={(el) => {
                  items.current[i + 3] = el;
                }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
