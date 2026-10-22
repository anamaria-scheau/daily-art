const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const {
  buildArtwork,
  buildMovement,
  findDuplicates,
  renderImagesModule,
} = require('./lib/content');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const ASSETS_DIR = path.join(ROOT, 'assets', 'artworks');
const OUT_JSON = path.join(ROOT, 'src', 'data', 'movements.json');
const OUT_IMAGES = path.join(ROOT, 'src', 'data', 'images.ts');

function readMarkdown(file) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return { data, content };
}

function loadMovements() {
  const errors = [];
  const movements = [];
  const imageFiles = {};

  const dirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const dir of dirs) {
    const dirPath = path.join(CONTENT_DIR, dir.name);
    const movementPath = path.join(dirPath, '_movement.md');
    if (!fs.existsSync(movementPath)) {
      errors.push(`${dir.name}: missing _movement.md`);
      continue;
    }

    const movementFile = readMarkdown(movementPath);
    const builtMovement = buildMovement(
      movementFile.data,
      movementFile.content,
      `${dir.name}/_movement.md`
    );
    errors.push(...builtMovement.errors);

    const artworks = [];
    const files = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith('.md') && file !== '_movement.md');

    for (const file of files) {
      const source = `${dir.name}/${file}`;
      const artworkFile = readMarkdown(path.join(dirPath, file));
      const built = buildArtwork(artworkFile.data, artworkFile.content, source);
      errors.push(...built.errors);
      if (!built.artwork) continue;

      const imageFile = artworkFile.data.imageFile;
      if (!fs.existsSync(path.join(ASSETS_DIR, imageFile))) {
        errors.push(`${source}: image "${imageFile}" not found in assets/artworks`);
      }
      imageFiles[built.artwork.id] = imageFile;
      artworks.push(built);
    }

    if (builtMovement.movement) {
      artworks.sort((a, b) => a.position - b.position);
      movements.push({
        ...builtMovement.movement,
        artworks: artworks.map((item) => item.artwork),
      });
    }
  }

  return { errors, movements, imageFiles };
}

function main() {
  const { errors, movements, imageFiles } = loadMovements();

  errors.push(...findDuplicates('movement id', movements.map((m) => m.id)));
  errors.push(...findDuplicates('movement order', movements.map((m) => m.order)));
  errors.push(
    ...findDuplicates(
      'artwork id',
      movements.flatMap((m) => m.artworks.map((a) => a.id))
    )
  );

  if (errors.length > 0) {
    console.error('Content has problems:\n');
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  movements.sort((a, b) => a.order - b.order);
  fs.writeFileSync(OUT_JSON, JSON.stringify(movements, null, 2) + '\n');
  fs.writeFileSync(OUT_IMAGES, renderImagesModule(imageFiles));

  const artworkCount = movements.reduce((sum, m) => sum + m.artworks.length, 0);
  console.log(`Built ${movements.length} movements and ${artworkCount} artworks.`);
}

main();