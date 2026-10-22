export const IMAGE_WIDTH = 843;
export const MAX_RANDOM_PAGE = 1000;
const DEFAULT_IIIF = 'https://www.artic.edu/iiif/2';

export type RemoteArtwork = {
  id: number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const text = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback;

export function buildImageUrl(iiifBase: string, imageId: string): string {
  return `${iiifBase.replace(/\/$/, '')}/${imageId}/full/${IMAGE_WIDTH},/0/default.jpg`;
}

export function pickRandomPage(
  random: () => number = Math.random,
  maxPage: number = MAX_RANDOM_PAGE
): number {
  return Math.floor(random() * maxPage) + 1;
}

// The server is outside our control, so we check every field we use.
export function parseArticResponse(json: unknown): RemoteArtwork | null {
  if (!isRecord(json) || !Array.isArray(json.data)) return null;

  const item: unknown = json.data[0];
  if (!isRecord(item)) return null;
  if (typeof item.id !== 'number') return null;
  if (typeof item.image_id !== 'string' || item.image_id === '') return null;

  const config = isRecord(json.config) ? json.config : {};
  const iiif =
    typeof config.iiif_url === 'string' ? config.iiif_url : DEFAULT_IIIF;
  const firstArtistLine = text(item.artist_display, '').split('\n')[0];

  return {
    id: item.id,
    title: text(item.title, 'Untitled'),
    artist: text(firstArtistLine, 'Unknown artist'),
    year: text(item.date_display, ''),
    medium: text(item.medium_display, ''),
    imageUrl: buildImageUrl(iiif, item.image_id),
  };
}