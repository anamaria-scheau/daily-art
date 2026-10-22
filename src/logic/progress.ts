export function nextProgressIndex(current: number, total: number): number {
  return (current + 1) % total;
}