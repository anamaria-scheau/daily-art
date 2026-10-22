import { ArticError, buildSearchUrl, fetchRandomArtwork } from './articClient';

const IIIF = 'https://www.artic.edu/iiif/2';

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);

const goodBody = {
  data: [
    {
      id: 7,
      title: 'Water Lilies',
      artist_display: 'Claude Monet\nFrench, 1840–1926',
      date_display: '1906',
      medium_display: 'Oil on canvas',
      image_id: 'lily-1',
    },
  ],
  config: { iiif_url: IIIF },
};

const noImageBody = {
  data: [{ id: 1, title: 'No image', image_id: null }],
  config: { iiif_url: IIIF },
};

const asFetch = (mock: jest.Mock) => mock as unknown as typeof fetch;

describe('buildSearchUrl', () => {
  it('asks only for public domain artworks, one per page', () => {
    const url = decodeURIComponent(buildSearchUrl(5));
    expect(url).toContain('query[term][is_public_domain]=true');
    expect(url).toContain('limit=1');
    expect(url).toContain('page=5');
  });
});

describe('fetchRandomArtwork', () => {
  it('returns the artwork when the first answer is usable', async () => {
    const fetchFn = jest.fn().mockResolvedValue(jsonResponse(goodBody));

    const artwork = await fetchRandomArtwork({
      fetchFn: asFetch(fetchFn),
      random: () => 0,
    });

    expect(artwork.title).toBe('Water Lilies');
    expect(artwork.imageUrl).toBe(`${IIIF}/lily-1/full/843,/0/default.jpg`);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('tries another page when the artwork has no image', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse(noImageBody))
      .mockResolvedValueOnce(jsonResponse(goodBody));
    const random = jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(0.5);

    const artwork = await fetchRandomArtwork({
      fetchFn: asFetch(fetchFn),
      random,
    });

    expect(artwork.title).toBe('Water Lilies');
    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(decodeURIComponent(fetchFn.mock.calls[1][0])).toContain('page=501');
  });

  it('gives up after three answers without an image', async () => {
    const fetchFn = jest.fn().mockResolvedValue(jsonResponse(noImageBody));

    await expect(
      fetchRandomArtwork({ fetchFn: asFetch(fetchFn), random: () => 0 })
    ).rejects.toBeInstanceOf(ArticError);
    expect(fetchFn).toHaveBeenCalledTimes(3);
  });

  it('turns a network failure into a friendly error', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('Network request failed'));

    const promise = fetchRandomArtwork({ fetchFn: asFetch(fetchFn) });

    await expect(promise).rejects.toBeInstanceOf(ArticError);
    await expect(promise).rejects.toThrow('Could not reach the museum');
  });

  it('reports the HTTP status when the server answers with an error', async () => {
    const fetchFn = jest.fn().mockResolvedValue(jsonResponse({}, 500));

    await expect(
      fetchRandomArtwork({ fetchFn: asFetch(fetchFn) })
    ).rejects.toThrow('status 500');
  });

  it('reports an answer that is not valid JSON', async () => {
    const broken = {
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    } as unknown as Response;
    const fetchFn = jest.fn().mockResolvedValue(broken);

    await expect(
      fetchRandomArtwork({ fetchFn: asFetch(fetchFn) })
    ).rejects.toThrow('could not read');
  });

  it('does not hide a cancelled request as a network error', async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchFn = jest.fn().mockRejectedValue(new Error('Aborted'));

    const promise = fetchRandomArtwork({
      fetchFn: asFetch(fetchFn),
      signal: controller.signal,
    });

    await expect(promise).rejects.toThrow('Aborted');
    await expect(promise).rejects.not.toBeInstanceOf(ArticError);
  });
});