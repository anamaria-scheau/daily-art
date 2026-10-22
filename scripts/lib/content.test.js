const {
  parseSections,
  toParagraphs,
  toBullets,
  buildArtwork,
  buildMovement,
  findDuplicates,
  renderImagesModule,
} = require('./content');

describe('toParagraphs', () => {
  it('splits text on blank lines', () => {
    expect(toParagraphs('One.\n\nTwo.')).toEqual(['One.', 'Two.']);
  });

  it('trims whitespace and ignores extra blank lines', () => {
    expect(toParagraphs('  One.  \n\n\n\n  Two.  \n')).toEqual(['One.', 'Two.']);
  });
});

describe('toBullets', () => {
  it('returns the text of each "- " line', () => {
    expect(toBullets('- First\n- Second')).toEqual(['First', 'Second']);
  });

  it('ignores lines that are not bullets', () => {
    expect(toBullets('Intro\n- Only')).toEqual(['Only']);
  });
});

describe('parseSections', () => {
  it('maps each "## Title" heading to its text', () => {
    const body = '## Story\n\nOnce upon a time.\n\n## Context\n\nLong ago.';
    expect(parseSections(body)).toEqual({
      Story: 'Once upon a time.',
      Context: 'Long ago.',
    });
  });

  it('handles Windows line endings', () => {
    expect(parseSections('## Story\r\n\r\nHello.')).toEqual({ Story: 'Hello.' });
  });
});

describe('findDuplicates', () => {
  it('returns nothing when all values are unique', () => {
    expect(findDuplicates('id', ['a', 'b'])).toEqual([]);
  });

  it('reports each repeated value', () => {
    expect(findDuplicates('id', ['a', 'b', 'a'])).toEqual(['duplicate id: a']);
  });
});

const validData = {
  id: 'mona-lisa',
  position: 1,
  title: 'Mona Lisa',
  artist: 'Leonardo da Vinci',
  year: 'c. 1503',
  imageFile: 'mona-lisa.png',
  imageCredit: 'Public domain',
  medium: 'Oil on poplar panel',
  dimensions: '77 × 53 cm',
  location: 'Louvre Museum, Paris',
};

const validBody = [
  '## Description',
  '',
  'A hook.',
  '',
  '## Story',
  '',
  'First.',
  '',
  'Second.',
  '',
  '## Look closer',
  '',
  '- One',
  '- Two',
  '',
  '## Context',
  '',
  'Context text.',
  '',
  '## Artist',
  '',
  'Bio.',
  '',
  '## When this was painted',
  '',
  'Then.',
].join('\n');

describe('buildArtwork', () => {
  it('builds an artwork with paragraphs and bullets', () => {
    const result = buildArtwork(validData, validBody, 'x.md');
    expect(result.errors).toEqual([]);
    expect(result.artwork.story).toEqual(['First.', 'Second.']);
    expect(result.artwork.lookCloser).toEqual(['One', 'Two']);
    expect(result.artwork.imageKey).toBe('mona-lisa');
    expect(result.artwork.details.location).toBe('Louvre Museum, Paris');
  });

  it('reports a missing field', () => {
    const { title, ...withoutTitle } = validData;
    const result = buildArtwork(withoutTitle, validBody, 'x.md');
    expect(result.errors).toContain('x.md: missing field "title"');
  });

  it('reports a missing section', () => {
    const withoutStory = validBody.replace('## Story', '## Something else');
    const result = buildArtwork(validData, withoutStory, 'x.md');
    expect(result.errors).toContain('x.md: missing section "## Story"');
  });

  it('rejects a "Look closer" section without bullets', () => {
    const noBullets = validBody.replace('- One\n- Two', 'Just a sentence.');
    const result = buildArtwork(validData, noBullets, 'x.md');
    expect(result.errors).toContain(
      'x.md: section "Look closer" needs at least one "- " bullet'
    );
  });
});

describe('buildMovement', () => {
  const data = { id: 'baroque', order: 4, name: 'Baroque', yearRange: 'c. 1600–1750' };

  it('builds a movement and trims the description', () => {
    const result = buildMovement(data, '\n\nDramatic art.\n\n', 'm.md');
    expect(result.errors).toEqual([]);
    expect(result.movement).toEqual({
      id: 'baroque',
      order: 4,
      name: 'Baroque',
      yearRange: 'c. 1600–1750',
      description: 'Dramatic art.',
    });
  });

  it('reports a missing description', () => {
    const result = buildMovement(data, '   ', 'm.md');
    expect(result.errors.length).toBe(1);
  });
});

describe('renderImagesModule', () => {
  it('lists the images alphabetically with the auto-generated header', () => {
    const output = renderImagesModule({ b: 'b.png', a: 'a.jpg' });
    expect(output).toContain('AUTO-GENERATED');
    expect(output.indexOf("'a'")).toBeLessThan(output.indexOf("'b'"));
    expect(output).toContain("require('../../assets/artworks/a.jpg')");
  });
});