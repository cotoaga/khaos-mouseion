'use client';

import { useEffect, useRef } from 'react';

// 16 vertices of a unit 4D hypercube (all combinations of ±1)
const V4: [number, number, number, number][] = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) for (const w of [-1, 1])
  V4.push([x, y, z, w]);

// 32 edges: pairs of vertices differing in exactly one coordinate
const EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) {
  let d = 0; for (let k = 0; k < 4; k++) if (V4[i][k] !== V4[j][k]) d++;
  if (d === 1) EDGES.push([i, j]);
}

type V4T = [number, number, number, number];

const rotXW = ([x, y, z, w]: V4T, a: number): V4T => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - w * s, y, z, x * s + w * c];
};

const rotYZ = ([x, y, z, w]: V4T, a: number): V4T => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c, w];
};

// 4D → 3D perspective (w-axis vanishing), then 3D → 2D perspective (z-axis vanishing)
const project = ([x, y, z, w]: V4T): [number, number] => {
  const f4 = 1 / (2.5 - w);
  const x3 = x * f4, y3 = y * f4, z3 = z * f4;
  const f3 = 1 / (4 - z3);
  return [x3 * f3, y3 * f3];
};

interface Props {
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedTesseract({
  color = '#00A86B',
  strokeWidth = 1.5,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let raf: number;
    let t0: number | null = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const ctx = canvas.getContext('2d')!;

    const drawFrame = (t: number) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Two incommensurate rotation rates → aperiodic, characteristic tesseract motion
      const pts = V4.map(v => project(rotYZ(rotXW(v, t * 0.5), t * 0.31)));

      const scale = Math.min(w, h) * 0.3;
      const cx = w / 2, cy = h / 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';

      for (const [a, b] of EDGES) {
        ctx.beginPath();
        ctx.moveTo(cx + pts[a][0] * scale, cy - pts[a][1] * scale);
        ctx.lineTo(cx + pts[b][0] * scale, cy - pts[b][1] * scale);
        ctx.stroke();
      }
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mq.matches) {
      // Static snapshot for reduced-motion users
      resize();
      drawFrame(0.6);
    } else {
      const frame = (ts: number) => {
        if (t0 === null) t0 = ts;
        drawFrame((ts - t0) / 1000);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color, strokeWidth]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block', ...style }}
    />
  );
}
