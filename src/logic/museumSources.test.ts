import { findMuseum, groupBySource } from './museumSources';

describe('findMuseum', () => {
  it('recognizes a museum from its location text', () => {
    expect(findMuseum('Louvre Museum, Paris')?.id).toBe('louvre');
  });

  it('ignores accents and capital letters', () => {
    expect(findMuseum("Musée d'Orsay, Paris")?.id).toBe('orsay');
    expect(findMuseum("MUSEE D'ORSAY")?.id).toBe('orsay');
  });

  it('tells the two National Galleries apart', () => {
    expect(findMuseum('National Gallery, London')?.id).toBe('national-gallery');
    expect(findMuseum('National Gallery of Art, Washington')?.id).toBe(
      'national-gallery-of-art'
    );
  });

  it('matches whole words only', () => {
    expect(findMuseum('Private estate collection')).toBeNull();
  });

  it('returns null for an unknown place', () => {
    expect(findMuseum('Church of San Luigi dei Francesi, Rome')).toBeNull();
  });
});

describe('groupBySource', () => {
  it('groups artworks that hang in the same museum', () => {
    const sources = groupBySource([
      { title: 'Mona Lisa', location: 'Louvre Museum, Paris' },
      { title: 'Liberty', location: 'Musée du Louvre' },
    ]);
    expect(sources).toHaveLength(1);
    expect(sources[0].name).toBe('Louvre Museum');
    expect(sources[0].artworkTitles).toEqual(['Mona Lisa', 'Liberty']);
    expect(sources[0].url).toBeDefined();
  });

  it('keeps different museums apart, in order of first appearance', () => {
    const sources = groupBySource([
      { title: 'A', location: 'Louvre' },
      { title: 'B', location: 'Uffizi Gallery, Florence' },
      { title: 'C', location: 'Louvre' },
    ]);
    expect(sources.map((source) => source.name)).toEqual([
      'Louvre Museum',
      'Uffizi Gallery',
    ]);
  });

  it('shows an unknown place as plain text without a link', () => {
    const [source] = groupBySource([
      { title: 'The Calling', location: 'San Luigi dei Francesi, Rome' },
    ]);
    expect(source.name).toBe('San Luigi dei Francesi, Rome');
    expect(source.url).toBeUndefined();
  });

  it('names an empty location "Unknown location"', () => {
    const [source] = groupBySource([{ title: 'X', location: '  ' }]);
    expect(source.name).toBe('Unknown location');
  });

  it('returns nothing for no artworks', () => {
    expect(groupBySource([])).toEqual([]);
  });
});