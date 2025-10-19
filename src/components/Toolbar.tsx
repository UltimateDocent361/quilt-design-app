import React, { useState } from "react";

type Props = {
  rows: number;
  cols: number;
  onNewGrid(rows: number, cols: number): void;
  onClear(): void;
  onSave(): void;
  onLoad(): void;
  onExportPNG(): void;
};

const Toolbar: React.FC<Props> = ({ rows, cols, onNewGrid, onClear, onSave, onLoad, onExportPNG }) => {
  const [r, setR] = useState(rows);
  const [c, setC] = useState(cols);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-sm text-slate-600">Rows</label>
        <input
          type="number"
          value={r}
          min={2}
          max={200}
          onChange={(e) => setR(parseInt(e.target.value || "0", 10))}
          className="border rounded-md px-2 py-1 w-24"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-600">Cols</label>
        <input
          type="number"
          value={c}
          min={2}
          max={200}
          onChange={(e) => setC(parseInt(e.target.value || "0", 10))}
          className="border rounded-md px-2 py-1 w-24"
        />
      </div>

      <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white" onClick={() => onNewGrid(r, c)}>
        New Grid
      </button>

      <button className="px-3 py-2 rounded-lg bg-slate-200" onClick={onClear}>Clear</button>
      <button className="px-3 py-2 rounded-lg bg-slate-200" onClick={onSave}>Save</button>
      <button className="px-3 py-2 rounded-lg bg-slate-200" onClick={onLoad}>Load</button>
      <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={onExportPNG}>Export PNG</button>
    </div>
  );
};

export default Toolbar;
