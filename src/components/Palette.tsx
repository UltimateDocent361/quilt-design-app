import React from "react";
import type { RGBHex } from "../lib/grid";

type Props = {
  colors: RGBHex[];
  current: RGBHex;
  onPick(c: RGBHex): void;
};

const swatchClass =
  "w-8 h-8 rounded-md border border-black/10 hover:scale-105 transition-transform cursor-pointer";

const Palette: React.FC<Props> = ({ colors, current, onPick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c}
          title={c}
          onClick={() => onPick(c)}
          className={`${swatchClass} ${c === current ? "ring-2 ring-indigo-500" : ""}`}
          style={{ background: c }}
        />
      ))}
    </div>
  );
};

export default Palette;
