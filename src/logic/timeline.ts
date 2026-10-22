export function indexFromOffset(
  offsetX: number,
  itemWidth: number,
  count: number
): number {
  const index = Math.round(offsetX / itemWidth);
  return Math.min(Math.max(index, 0), count - 1);
}