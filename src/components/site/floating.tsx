"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Accessibility, RotateCcw, X } from "lucide-react";
import { contact } from "@/content";
import { resetA11y, setA11y, useA11y, useReduced } from "@/lib/a11y";
import { cn } from "@/lib/utils";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} fill="currentColor">
      <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.17 1.62 5.99L4 29l8.26-1.6a12.1 12.1 0 0 0 3.78.6C22.68 28 28 22.64 28 16.03 28 9.42 22.68 3 16.04 3Zm0 22.86c-1.2 0-2.38-.2-3.5-.6l-.25-.09-4.9.95.98-4.73-.16-.26a9.84 9.84 0 0 1-1.52-5.16c0-5.43 4.43-9.85 9.35-9.85 5.2 0 9.66 4.42 9.66 9.91 0 5.42-4.44 9.83-9.66 9.83Zm5.4-7.37c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.94 1.15-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.45.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.49.1-.2.05-.37-.03-.51-.07-.15-.67-1.6-.92-2.2-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.01-1.04 2.47 0 1.45 1.06 2.86 1.21 3.06.15.2 2.09 3.18 5.06 4.46.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

/** Floating WhatsApp button on every page; lifts above the mobile action bar. */
export function WhatsAppFab() {
  const [hint, setHint] = useState(false);
  const reduced = useReduced();
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 4000);
    const off = setTimeout(() => setHint(false), 11000);
    return () => {
      clearTimeout(t);
      clearTimeout(off);
    };
  }, []);
  const href = contact.whatsappNumber
    ? `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappText)}`
    : "/#contact";
  return (
    <div className="fixed end-4 bottom-[calc(88px+env(safe-area-inset-bottom))] z-50 flex items-center gap-3 sm:end-6 sm:bottom-6">
      <AnimatePresence>
        {hint && (
          <motion.span
            initial={reduced ? false : { opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6 }}
            className="glass hidden rounded-2xl rounded-be-sm bg-[#0a0e19]/90 px-4 py-2.5 text-sm font-semibold whitespace-nowrap shadow-xl sm:block"
            aria-hidden
          >
            שאלה? כתבו לנו בוואטסאפ
          </motion.span>
        )}
      </AnimatePresence>
      <motion.a
        data-fab
        href={href}
        target={contact.whatsappNumber ? "_blank" : undefined}
        rel={contact.whatsappNumber ? "noopener noreferrer" : undefined}
        aria-label="שליחת הודעה בוואטסאפ"
        initial={reduced ? false : { scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.2 }}
        whileHover={reduced ? undefined : { scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgb(37_211_102/0.7)] sm:size-16"
      >
        <span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366] [animation:fab-ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <WhatsAppGlyph className="relative size-8 sm:size-9" />
      </motion.a>
    </div>
  );
}

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 text-start text-[15px] font-semibold transition-colors",
        on ? "border-primary bg-primary/15" : "border-white/10 bg-white/[0.03] hover:border-white/25",
      )}
    >
      {label}
      <span className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", on ? "bg-primary" : "bg-white/15")}>
        <span className={cn("absolute top-1 size-4 rounded-full bg-white transition-[inset-inline-start]", on ? "start-5" : "start-1")} />
      </span>
    </button>
  );
}

const textSizes = ["רגיל", "גדול", "גדול מאוד"] as const;

/** Accessibility menu: text size, contrast, stop animations, link underlines, readable font. */
export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const prefs = useA11y();
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed start-4 bottom-[calc(88px+env(safe-area-inset-bottom))] z-50 sm:start-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id="a11y-panel"
            role="dialog"
            aria-label="הגדרות נגישות"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="glass absolute start-0 bottom-[calc(100%+12px)] grid w-[min(320px,calc(100vw-32px))] gap-2.5 rounded-3xl bg-[#0a0e19]/95 p-4 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)]"
          >
            <div className="mb-1 flex items-center justify-between">
              <b className="text-lg">נגישות</b>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="סגירת תפריט הנגישות"
                className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid gap-1.5">
              <span className="text-sm font-semibold text-muted-foreground">גודל טקסט</span>
              <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="גודל טקסט">
                {textSizes.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={prefs.textScale === i}
                    onClick={() => setA11y({ textScale: i as 0 | 1 | 2 })}
                    className={cn(
                      "min-h-11 cursor-pointer rounded-xl border text-sm font-bold",
                      prefs.textScale === i ? "border-primary bg-primary/15" : "border-white/10 bg-white/[0.03]",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Toggle on={prefs.noMotion} label="עצירת אנימציות" onClick={() => setA11y({ noMotion: !prefs.noMotion })} />
            <Toggle on={prefs.contrast} label="ניגודיות גבוהה" onClick={() => setA11y({ contrast: !prefs.contrast })} />
            <Toggle on={prefs.links} label="הדגשת קישורים" onClick={() => setA11y({ links: !prefs.links })} />
            <Toggle on={prefs.readable} label="גופן קריא" onClick={() => setA11y({ readable: !prefs.readable })} />
            <div className="mt-1 flex items-center justify-between gap-2 text-sm">
              <button type="button" onClick={resetA11y} className="flex min-h-10 cursor-pointer items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground">
                <RotateCcw className="size-4" />
                איפוס
              </button>
              <Link href="/accessibility/" className="min-h-10 content-center font-semibold text-primary underline-offset-4 hover:underline">
                הצהרת נגישות
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        className="grid size-12 cursor-pointer place-items-center rounded-full bg-blue text-white shadow-[0_10px_30px_-8px_var(--blue)] ring-2 ring-white/20 transition-transform hover:scale-105 sm:size-13"
      >
        <Accessibility className="size-6" />
      </button>
    </div>
  );
}
