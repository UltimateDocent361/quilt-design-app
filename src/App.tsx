import { useEffect, useRef, useState } from "react";
import GridCanvas from "./components/GridCanvas";
import Palette from "./components/Palette";
import Toolbar from "./components/Toolbar";
import type { RGBHex } from "./lib/grid";
import { makeGrid, setCell } from "./lib/grid";

// Map common quilt block sizes (inches) to a reasonable pixel size per cell.
// Tweak DPI if you want bigger/smaller on screen.
const DPI = 3; // pixels per "inch" for on-screen scale (tweak to taste)
const BLOCK_PRESETS = [6, 8, 9, 10, 12, 16] as const;
const toPixels = (inches: number) => inches * DPI;

const DEFAULT_COLORS: RGBHex[] = [
  "#000000", "#ffffff", "#ef4444", "#f59e0b", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6",
  "#f97316", "#10b981", "#84cc16", "#ec4899", "#94a3b8"
];

const LS_KEY = "quilt-grid-v1";

function App() {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);
  const [cellSize, setCellSize] = useState(24);
  const [currentColor, setCurrentColor] = useState<RGBHex>("#000000");
  const [grid, setGrid] = useState<RGBHex[][]>(() => makeGrid(20, 20, "#ffffff"));

    const [blockPreset, setBlockPreset] = useState<number | "custom">(() => {
    const match = BLOCK_PRESETS.find(n => toPixels(n) === cellSize);
    return match ?? "custom";
  });

  useEffect(() => {
    const match = BLOCK_PRESETS.find(n => toPixels(n) === cellSize);
    setBlockPreset(match ?? "custom");
  }, [cellSize]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null); // we'll grab it from GridCanvas via DOM

  // Attach a ref to the actual <canvas> element for export (simple query)
  useEffect(() => {
    const el = document.querySelector("canvas");
    if (el instanceof HTMLCanvasElement) canvasRef.current = el;
  }, [rows, cols, cellSize, grid]);

  const handlePaint = (r: number, c: number, color: RGBHex) => {
    setGrid((g) => setCell(g, r, c, color));
  };

  const handleNewGrid = (r: number, c: number) => {
    setRows(r);
    setCols(c);
    setGrid(makeGrid(r, c, "#ffffff"));
  };

  const handleClear = () => setGrid(makeGrid(rows, cols, "#ffffff"));

  const handleSave = () => {
    const payload = { rows, cols, cellSize, grid };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
    alert("Saved!");
  };

  const handleLoad = () => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) { alert("No save found."); return; }
    try {
      const { rows: r, cols: c, cellSize: size, grid: g } = JSON.parse(raw);
      setRows(r); setCols(c); setCellSize(size); setGrid(g);
    } catch {
      alert("Saved data is invalid.");
    }
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) { alert("Canvas not found"); return; }
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quilt-design.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");

    const [blockPreset, setBlockPreset] = useState<number | "custom">(() => {
  const match = BLOCK_PRESETS.find(n => toPixels(n) === cellSize);
  return match ?? "custom";
});

// keep the dropdown in sync if user types a custom px size that matches a preset
useEffect(() => {
  const match = BLOCK_PRESETS.find(n => toPixels(n) === cellSize);
  setBlockPreset(match ?? "custom");
}, [cellSize]);

  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
<header className="flex items-center justify-between">
  <h1 className="text-2xl md:text-3xl font-bold">Quilt Design App (MVP)</h1>

  <div className="flex items-end gap-4">
    {/* Block Size (with Custom in the list) */}
    <div>
      <label className="block text-sm font-medium text-slate-700">Block Size (inches)</label>
      <select
        className="border rounded px-2 py-1"
        value={blockPreset === "custom" ? "custom" : String(blockPreset)}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "custom") {
            setBlockPreset("custom");
            return;
          }
          const inches = parseInt(v, 10);
          setBlockPreset(inches);
          setCellSize(toPixels(inches));
        }}
      >
        {BLOCK_PRESETS.map((n) => (
          <option key={n} value={n}>{n}"</option>
        ))}
        <option value="custom">Custom</option>
      </select>
    </div>

    {/* Show custom pixel input ONLY when Custom is selected */}
    {blockPreset === "custom" && (
      <div>
        <label className="block text-sm font-medium text-slate-700">Custom Size (px)</label>
        <input
          type="number"
          min={8}
          max={60}
          value={cellSize}
          onChange={(e) => setCellSize(parseInt(e.target.value || "0", 10))}
          className="border rounded px-2 py-1 w-24"
        />
        <p className="text-[11px] text-slate-500 mt-1">Tip: {DPI}px ≈ 1"</p>
      </div>
    )}
  </div>
</header>

        <Toolbar
          rows={rows}
          cols={cols}
          onNewGrid={handleNewGrid}
          onClear={handleClear}
          onSave={handleSave}
          onLoad={handleLoad}
          onExportPNG={handleExportPNG}
        />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Palette</h2>
          <Palette colors={DEFAULT_COLORS} current={currentColor} onPick={setCurrentColor} />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Canvas</h2>
          <GridCanvas
            grid={grid}
            cellSize={cellSize}
            currentColor={currentColor}
            onPaint={handlePaint}
          />
          <p className="text-sm text-slate-600">Tip: click and drag to paint.</p>
        </section>
      </div>
    </div>
  );
}

export default App;
