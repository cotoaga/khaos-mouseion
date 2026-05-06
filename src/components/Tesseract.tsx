import React from 'react';

interface TesseractProps {
  size?: number | string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Schlegel projection: Ry(20°) + Rx(25°), viewBox 400×400
const outer: [number, number][] = [
  [85, 259], [254, 233], [254, 70], [85, 96],
  [146, 330], [315, 304], [315, 141], [146, 167],
];
const inner: [number, number][] = [
  [149, 226], [224, 215], [224, 142], [149, 154],
  [176, 258], [251, 246], [251, 174], [176, 185],
];
const cubeEdges: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

export default function Tesseract({
  size = 400,
  stroke = 'var(--green)',
  strokeWidth = 1.5,
  className,
  style,
}: TesseractProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {cubeEdges.map(([a, b], i) => (
        <line key={`o${i}`} x1={outer[a][0]} y1={outer[a][1]} x2={outer[b][0]} y2={outer[b][1]} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      ))}
      {cubeEdges.map(([a, b], i) => (
        <line key={`n${i}`} x1={inner[a][0]} y1={inner[a][1]} x2={inner[b][0]} y2={inner[b][1]} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      ))}
      {outer.map(([ox, oy], i) => (
        <line key={`c${i}`} x1={ox} y1={oy} x2={inner[i][0]} y2={inner[i][1]} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
