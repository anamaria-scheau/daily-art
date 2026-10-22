import { buildImageUrl, parseArticResponse, pickRandomPage } from './artic';

const IIIF = 'https://www.artic.edu/iiif/2';

const answer = (item: Record<string, unknown>) => ({
  data: [item],
  config: { iiif_url: IIIF },
});

const valid = {
  id: 27992,
  title: 'A Sunday on La Grande Jatte',
  artist_display: 'Georges Seurat\nFrench, 1859–1891',
  date_display: '1884–86',
  medium_display: 'Oil on canvas',
  image_id: 'abc-123',
};

describe('buildImageUrl', () => {
  it('builds the 843px IIIF url', () => {
    expect(buildImageUrl(IIIF, 'abc-123')).toBe(
      'https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg'
    );
  });

  it('does not double the slash when the base ends with one', () => {
    expect(buildImageUrl(`${IIIF}/`, 'abc-123')).toBe(
      'https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg'
    );
  });
});

describe('pickRandomPage', () => {
  it('returns page 1 for the lowest random value', () => {
    expect(pickRandomPage(() => 0)).toBe(1);
  });

  it('never goes past the maximum page', () => {
    expect(pickRandomPage(() => 0.999999, 1000)).toBe(1000);
  });
});

describe('parseArticResponse', () => {
  it('maps a valid answer to an artwork', () => {
    expect(parseArticResponse(answer(valid))).toEqual({
      id: 27992,
      title: 'A Sunday on La Grande Jatte',
      artist: 'Georges Seurat',
      year: '1884–86',
      medium: 'Oil on canvas',
      imageUrl: 'https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg',
    });
  });

  it('keeps only the first line of the artist text', () => {
    expect(parseArticResponse(answer(valid))?.artist).toBe('Georges Seurat');
  });

  it('uses friendly fallbacks for missing text', () => {
    const result = parseArticResponse(
      answer({ id: 1, image_id: 'x', title: null, artist_display: null })
    );
    expect(result?.title).toBe('Untitled');
    expect(result?.artist).toBe('Unknown artist');
    expect(result?.year).toBe('');
  });

  it('falls back to the default IIIF address when config is missing', () => {
    const result = parseArticResponse({ data: [valid] });
    expect(result?.imageUrl).toBe(
      'https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg'
    );
  });

  it('returns null when the artwork has no image', () => {
    expect(parseArticResponse(answer({ ...valid, image_id: null }))).toBeNull();
  });

  it('returns null for an empty list', () => {
    expect(parseArticResponse({ data: [] })).toBeNull();
  });

  it('returns null for answers with the wrong shape', () => {
    expect(parseArticResponse(null)).toBeNull();
    expect(parseArticResponse('nope')).toBeNull();
    expect(parseArticResponse({ data: 'nope' })).toBeNull();
  });
});