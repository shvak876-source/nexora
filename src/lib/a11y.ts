"use client";

// Viewer accessibility preferences from the accessibility menu. Applied as classes on
// <html> and remembered per browser. "Stop animations" also feeds useReduced(), so every
// motion effect on the site renders its final state.

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

export type A11yPrefs = {
  textScale: 0 | 1 | 2;
  contrast: boolean;
  noMotion: boolean;
  links: boolean;
  readable: boolean;
};

const KEY = "nexora-a11y";
const DEFAULTS: A11yPrefs = { textScale: 0, contrast: false, noMotion: false, links: false, readable: false };

let prefs: A11yPrefs = DEFAULTS;
const listeners = new Set<() => void>();

function apply() {
  const el = document.documentElement;
  el.classList.toggle("a11y-text-1", prefs.textScale === 1);
  el.classList.toggle("a11y-text-2", prefs.textScale === 2);
  el.classList.toggle("a11y-contrast", prefs.contrast);
  el.classList.toggle("a11y-no-motion", prefs.noMotion);
  el.classList.toggle("a11y-links", prefs.links);
  el.classList.toggle("a11y-readable", prefs.readable);
}

let loaded = false;
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) prefs = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  apply();
}

export function setA11y(patch: Partial<A11yPrefs>) {
  prefs = { ...prefs, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {}
  apply();
  listeners.forEach((l) => l());
}

export function resetA11y() {
  setA11y(DEFAULTS);
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useA11y(): A11yPrefs {
  return useSyncExternalStore(
    subscribe,
    () => prefs,
    () => DEFAULTS,
  );
}

/** True when the OS asks for reduced motion or the viewer turned animations off in the menu. */
export function useReduced(): boolean {
  const os = useReducedMotion();
  const { noMotion } = useA11y();
  return !!os || noMotion;
}
