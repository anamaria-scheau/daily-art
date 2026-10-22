import { RemoteArtwork, parseArticResponse, pickRandomPage } from '../logic/artic';

const SEARCH_URL = 'https://api.artic.edu/api/v1/artworks/search';
const FIELDS = 'id,title,artist_display,date_display,medium_display,image_id';
const MAX_ATTEMPTS = 3;

export class ArticError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArticError';
    Object.setPrototypeOf(this, ArticError.prototype);
  }
}

export function buildSearchUrl(page: number): string {
  const params: Record<string, string> = {
    'query[term][is_public_domain]': 'true',
    fields: FIELDS,
    limit: '1',
    page: String(page),
  };
  const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return `${SEARCH_URL}?${query}`;
}

type Options = {
  fetchFn?: typeof fetch;
  random?: () => number;
  signal?: AbortSignal;
};

export async function fetchRandomArtwork(
  options: Options = {}
): Promise<RemoteArtwork> {
  const { fetchFn = fetch, random = Math.random, signal } = options;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const url = buildSearchUrl(pickRandomPage(random));

    let response: Response;
    try {
      response = await fetchFn(url, {
        signal,
        headers: { 'AIC-User-Agent': 'daily-art-learning-project' },
      });
    } catch (error) {
      if (signal?.aborted) throw error;
      throw new ArticError(
        'Could not reach the museum. Check your internet connection.'
      );
    }

    if (!response.ok) {
      throw new ArticError(
        `The museum server answered with status ${response.status}.`
      );
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      throw new ArticError('The museum sent an answer we could not read.');
    }

    const artwork = parseArticResponse(json);
    if (artwork) return artwork;
    // No usable image on that page: try another random page.
  }

  throw new ArticError('Could not find an artwork with an image. Try again.');
}