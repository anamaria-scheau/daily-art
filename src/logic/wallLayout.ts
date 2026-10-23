export type TileLayout = {
  columns: number;
  rows: number;
  tileWidth: number;
  tileHeight: number;
};

const EMPTY: TileLayout = { columns: 0, rows: 0, tileWidth: 0, tileHeight: 0 };

// Tries every number of columns and keeps the arrangement with the biggest
// tiles. `aspect` is tile width divided by tile height.
export function fitTiles(
  count: number,
  width: number,
  height: number,
  aspect: number = 0.8
): TileLayout {
  if (count <= 0) return EMPTY;

  let best: TileLayout = EMPTY;
  for (let columns = 1; columns <= count; columns += 1) {
    const rows = Math.ceil(count / columns);
    const tileWidth = Math.min(width / columns, (height / rows) * aspect);
    if (tileWidth > best.tileWidth) {
      best = { columns, rows, tileWidth, tileHeight: tileWidth / aspect };
    }
  }
  return best;
}