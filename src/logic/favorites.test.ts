import {
  groupFavoritesByMovement,
  parseFavorites,
  toggleFavorite,
} from './favorites';
import { Artwork, Movement } from '../types/movement';

const artwork = (id: string) => ({ id } as Artwork);
const movement = (id: string, order: number, artworkIds: string[]) =>
  ({ id, order, name: id, artworks: artworkIds.map(artwork) } as Movement);

describe('toggleFavorite', () => {
  it('adds an artwork that is not a favorite yet', () => {
    expect(toggleFavorite(['a'], 'b')).toEqual(['a', 'b']);
  });

  it('removes an artwork that is already a favorite', () => {
    expect(toggleFavorite(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('does not modify the list it receives', () => {
    const original = ['a'];
    toggleFavorite(original, 'b');
    expect(original).toEqual(['a']);
  });
});

describe('parseFavorites', () => {
  it('returns an empty list for missing data', () => {
    expect(parseFavorites(null)).toEqual([]);
  });

  it('returns an empty list for broken JSON', () => {
    expect(parseFavorites('{not json')).toEqual([]);
  });

  it('returns an empty list when the data is not an array', () => {
    expect(parseFavorites('{"a":1}')).toEqual([]);
  });

  it('keeps only strings and removes duplicates', () => {
    expect(parseFavorites('["a", 5, "b", "a", null]')).toEqual(['a', 'b']);
  });
});

describe('groupFavoritesByMovement', () => {
  const movements = [
    movement('impressionism', 2, ['monet', 'renoir']),
    movement('renaissance', 1, ['mona-lisa', 'arnolfini']),
    movement('baroque', 3, ['caravaggio']),
  ];

  it('groups favorites by movement, in timeline order', () => {
    const groups = groupFavoritesByMovement(['monet', 'mona-lisa'], movements);
    expect(groups.map((g) => g.movement.id)).toEqual([
      'renaissance',
      'impressionism',
    ]);
  });

  it('skips movements without favorites', () => {
    const groups = groupFavoritesByMovement(['monet'], movements);
    expect(groups).toHaveLength(1);
  });

  it('keeps the order in which artworks were favorited', () => {
    const groups = groupFavoritesByMovement(['renoir', 'monet'], movements);
    expect(groups[0].artworks.map((a) => a.id)).toEqual(['renoir', 'monet']);
  });

  it('ignores ids that no longer exist in the dataset', () => {
    const groups = groupFavoritesByMovement(['ghost', 'monet'], movements);
    expect(groups).toHaveLength(1);
    expect(groups[0].artworks.map((a) => a.id)).toEqual(['monet']);
  });

  it('returns an empty list when there are no favorites', () => {
    expect(groupFavoritesByMovement([], movements)).toEqual([]);
  });
});