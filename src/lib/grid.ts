export type RGBHex = string; // e.g. "#ff00aa"

export function makeGrid(rows: number, cols: number, fill: RGBHex = "#ffffff") {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export function cloneGrid(grid: RGBHex[][]) {
  return grid.map((r) => r.slice());
}

export function setCell(grid: RGBHex[][], row: number, col: number, color: RGBHex) {
  if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length) return grid;
  const next = cloneGrid(grid);
  next[row][col] = color;
  return next;
}
