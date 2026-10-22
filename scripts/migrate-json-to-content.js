const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const movements = require('../src/data/movements.json');
const assetFiles = fs.readdirSync(path.join(ROOT, 'assets', 'artworks'));

// JSON strings are valid YAML double-quoted strings
const q = (value) => JSON.stringify(String(value));

for (const movement of movements) {
  const dir = path.join(ROOT, 'content', movement.id);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, '_movement.md'),
    [
      '---',
      `id: ${q(movement.id)}`,
      `order: ${movement.order}`,
      `name: ${q(movement.name)}`,
      `yearRange: ${q(movement.yearRange)}`,
      '---',
      '',
      movement.description,
      '',
    ].join('\n')
  );

  movement.artworks.forEach((artwork, index) => {
    const imageFile = assetFiles.find((f) => f.startsWith(artwork.imageKey + '.'));
    if (!imageFile) throw new Error(`No image for ${artwork.imageKey}`);

    const text = [
      '---',
      `id: ${q(artwork.id)}`,
      `position: ${index + 1}`,
      `title: ${q(artwork.title)}`,
      `artist: ${q(artwork.artist)}`,
      `year: ${q(artwork.year)}`,
      `imageFile: ${q(imageFile)}`,
      `imageCredit: ${q(artwork.imageCredit)}`,
      `medium: ${q(artwork.details.medium)}`,
      `dimensions: ${q(artwork.details.dimensions)}`,
      `location: ${q(artwork.details.location)}`,
      '---',
      '',
      '## Description',
      '',
      artwork.description,
      '',
      '## Story',
      '',
      artwork.story.join('\n\n'),
      '',
      '## Look closer',
      '',
      artwork.lookCloser.map((tip) => `- ${tip}`).join('\n'),
      '',
      '## Context',
      '',
      artwork.context.join('\n\n'),
      '',
      '## Artist',
      '',
      artwork.artistBio,
      '',
      '## When this was painted',
      '',
      artwork.artistAtTheTime,
      '',
    ].join('\n');

    fs.writeFileSync(path.join(dir, `${artwork.id}.md`), text);
  });
}

console.log('Done. Check the content/ folder.');