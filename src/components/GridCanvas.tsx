import React, { useEffect, useRef, useState } from "react";
import type { RGBHex } from "../lib/grid";

type Props = {
  grid: RGBHex[][];
  cellSize: number;         // pixels
  currentColor: RGBHex;
  onPaint(row: number, col: number, color: RGBHex): void;
};

const GridCanvas: React.FC<Props> = ({ grid, cellSize, currentColor, onPaint }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDown, setIsDown] = useState(false);

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const width = cols * cellSize;
  const height = rows * cellSize;

  // draw grid
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    // fill cells
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        ctx.fillStyle = grid[r][col];
        ctx.fillRect(col * cellSize, r * cellSize, cellSize, cellSize);
      }
    }

    // draw grid lines (subtle)
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    for (let x = 0; x <= cols; x++) {
      const xx = x * cellSize + 0.5;
      ctx.beginPath();
      ctx.moveTo(xx, 0);
      ctx.lineTo(xx, height);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      const yy = y * cellSize + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.lineTo(width, yy);
      ctx.stroke();
    }
  }, [grid, rows, cols, cellSize, width, height]);

  const paintAtEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    onPaint(row, col, currentColor);
  };

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl shadow border border-slate-300 bg-white"
      style={{ width, height }}
      onMouseDown={(e) => {
        setIsDown(true);
        paintAtEvent(e);
      }}
      onMouseMove={(e) => {
        if (isDown) paintAtEvent(e);
      }}
      onMouseUp={() => setIsDown(false)}
      onMouseLeave={() => setIsDown(false)}
    />
  );
};

export default GridCanvas;
