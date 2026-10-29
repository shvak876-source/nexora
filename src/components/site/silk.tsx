"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Flowing "silk" made of domain-warped noise, tinted with the brand palette.
// Runs on the GPU, pauses when offscreen or when the tab is hidden, follows the
// pointer a little, and renders a single still frame under reduced motion.

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

vec3 c0 = vec3(0.020, 0.024, 0.043); // background
vec3 c1 = vec3(0.231, 0.510, 0.965); // blue
vec3 c2 = vec3(0.545, 0.361, 0.965); // violet
vec3 c3 = vec3(0.133, 0.827, 0.933); // cyan

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;
  float t = uTime * 0.06;
  p += (uMouse - 0.5) * 0.18;

  vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t + 4.2));
  vec2 r = vec2(fbm(p * 1.4 + 2.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.4 + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.2 + 2.4 * r);

  // silk folds: sharpen the warped field into soft ridges
  float folds = smoothstep(0.35, 0.95, f) * 0.9 + 0.25 * sin(10.0 * f + t * 6.0) * smoothstep(0.4, 0.9, f);

  vec3 col = mix(c0, c1, clamp(f * f * 2.2, 0.0, 1.0));
  col = mix(col, c2, clamp(length(q) * 0.9, 0.0, 1.0) * 0.75);
  col = mix(col, c3, clamp(r.x * r.x * 0.9, 0.0, 1.0) * 0.35);
  col += folds * 0.18 * vec3(0.75, 0.8, 1.0);

  // keep the top-center darker so the headline stays readable, fade the bottom out
  float vignette = smoothstep(1.25, 0.2, length((uv - vec2(0.5, 0.62)) * vec2(1.1, 1.6)));
  col *= mix(0.25, 1.0, vignette);
  col *= smoothstep(0.0, 0.45, uv.y);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export function SilkBackground({ className, fallback }: { className?: string; fallback?: React.ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = canvas.current!;
    const gl = el.getContext("webgl", { antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return setFailed(true);
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return setFailed(true);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return setFailed(true);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let visible = true;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      // Render below device resolution: the image is soft by design and this keeps it cheap.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * 0.6;
      el.width = Math.max(1, Math.floor(el.clientWidth * dpr));
      el.height = Math.max(1, Math.floor(el.clientHeight * dpr));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uRes, el.width, el.height);
      if (reduced) draw(8000);
    };

    const draw = (ms: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, ms / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      if (visible && !document.hidden) draw(performance.now() - start);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (failed) return <>{fallback}</>;
  return <canvas ref={canvas} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
