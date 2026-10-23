import { fitTiles } from './wallLayout';

describe('fitTiles', () => {
  it('returns an empty layout for no artworks', () => {
    expect(fitTiles(0, 200, 300)).toEqual({
      columns: 0,
      rows: 0,
      tileWidth: 0,
      tileHeight: 0,
    });
  });

  it('gives a single artwork as much room as the wall allows', () => {
    expect(fitTiles(1, 100, 200, 0.8)).toEqual({
      columns: 1,
      rows: 1,
      tileWidth: 100,
      tileHeight: 125,
    });
  });

  it('uses a 2 by 2 grid for four artworks on a square wall', () => {
    expect(fitTiles(4, 200, 200, 1)).toEqual({
      columns: 2,
      rows: 2,
      tileWidth: 100,
      tileHeight: 100,
    });
  });

  it('puts three artworks in one row on a wide wall', () => {
    const layout = fitTiles(3, 300, 100, 1);
    expect(layout.columns).toBe(3);
    expect(layout.rows).toBe(1);
  });

  it('always fits every artwork inside the wall', () => {
    for (let count = 1; count <= 40; count += 1) {
      const { columns, rows, tileWidth, tileHeight } = fitTiles(count, 160, 260);
      expect(columns * rows).toBeGreaterThanOrEqual(count);
      expect(columns * tileWidth).toBeLessThanOrEqual(160 + 0.001);
      expect(rows * tileHeight).toBeLessThanOrEqual(260 + 0.001);
    }
  });

  it('never makes the tiles bigger when an artwork is added', () => {
    let previous = Infinity;
    for (let count = 1; count <= 40; count += 1) {
      const { tileWidth } = fitTiles(count, 160, 260);
      expect(tileWidth).toBeLessThanOrEqual(previous + 0.001);
      previous = tileWidth;
    }
  });
});