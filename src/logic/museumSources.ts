export type Museum = { id: string; name: string; url: string; pattern: RegExp };

export type MuseumSource = {
  key: string;
  name: string;
  url?: string;
  artworkTitles: string[];
};

const MUSEUMS: Museum[] = [
  { id: 'louvre', name: 'Louvre Museum', url: 'https://www.louvre.fr/en', pattern: /\blouvre\b/ },
  { id: 'orsay', name: "Musée d'Orsay", url: 'https://www.musee-orsay.fr/en', pattern: /\borsay\b/ },
  { id: 'orangerie', name: "Musée de l'Orangerie", url: 'https://www.musee-orangerie.fr/en', pattern: /\borangerie\b/ },
  { id: 'marmottan', name: 'Musée Marmottan Monet', url: 'https://www.marmottan.fr/en/', pattern: /\bmarmottan\b/ },
  { id: 'pompidou', name: 'Centre Pompidou', url: 'https://www.centrepompidou.fr/en/', pattern: /\bpompidou\b/ },
  { id: 'uffizi', name: 'Uffizi Gallery', url: 'https://www.uffizi.it/en', pattern: /\buffizi\b/ },
  { id: 'borghese', name: 'Galleria Borghese', url: 'https://galleriaborghese.beniculturali.it/en/', pattern: /\bborghese\b/ },
  { id: 'national-gallery-of-art', name: 'National Gallery of Art', url: 'https://www.nga.gov', pattern: /\bnational gallery of art\b/ },
  { id: 'national-gallery', name: 'The National Gallery', url: 'https://www.nationalgallery.org.uk', pattern: /\bnational gallery\b/ },
  { id: 'tate', name: 'Tate', url: 'https://www.tate.org.uk', pattern: /\btate\b/ },
  { id: 'rijksmuseum', name: 'Rijksmuseum', url: 'https://www.rijksmuseum.nl/en', pattern: /\brijksmuseum\b/ },
  { id: 'van-gogh-museum', name: 'Van Gogh Museum', url: 'https://www.vangoghmuseum.nl/en', pattern: /\bvan gogh museum\b/ },
  { id: 'mauritshuis', name: 'Mauritshuis', url: 'https://www.mauritshuis.nl/en/', pattern: /\bmauritshuis\b/ },
  { id: 'prado', name: 'Museo del Prado', url: 'https://www.museodelprado.es/en', pattern: /\bprado\b/ },
  { id: 'reina-sofia', name: 'Museo Reina Sofía', url: 'https://www.museoreinasofia.es/en', pattern: /\breina sofia\b/ },
  { id: 'thyssen', name: 'Museo Thyssen-Bornemisza', url: 'https://www.museothyssen.org/en', pattern: /\bthyssen\b/ },
  { id: 'met', name: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org', pattern: /\bmetropolitan museum\b/ },
  { id: 'moma', name: 'The Museum of Modern Art', url: 'https://www.moma.org', pattern: /\b(museum of modern art|moma)\b/ },
  { id: 'art-institute', name: 'Art Institute of Chicago', url: 'https://www.artic.edu', pattern: /\bart institute of chicago\b/ },
  { id: 'philadelphia', name: 'Philadelphia Museum of Art', url: 'https://philamuseum.org', pattern: /\bphiladelphia museum of art\b/ },
  { id: 'guggenheim', name: 'Guggenheim', url: 'https://www.guggenheim.org', pattern: /\bguggenheim\b/ },
  { id: 'getty', name: 'J. Paul Getty Museum', url: 'https://www.getty.edu', pattern: /\bgetty\b/ },
  { id: 'hermitage', name: 'The State Hermitage Museum', url: 'https://www.hermitagemuseum.org', pattern: /\bhermitage\b/ },
  { id: 'khm', name: 'Kunsthistorisches Museum', url: 'https://www.khm.at/en/', pattern: /\bkunsthistorisches\b/ },
  { id: 'belvedere', name: 'Belvedere', url: 'https://www.belvedere.at/en', pattern: /\bbelvedere\b/ },
  { id: 'gemaldegalerie', name: 'Gemäldegalerie, Berlin', url: 'https://www.smb.museum', pattern: /\bgemaldegalerie\b/ },
  { id: 'munch', name: 'MUNCH', url: 'https://www.munchmuseet.no/en/', pattern: /\bmunch\b/ },
];

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function findMuseum(location: string): Museum | null {
  const text = normalize(location);
  return MUSEUMS.find((museum) => museum.pattern.test(text)) ?? null;
}

export function groupBySource(
  items: { title: string; location: string }[]
): MuseumSource[] {
  const sources = new Map<string, MuseumSource>();

  for (const { title, location } of items) {
    const museum = findMuseum(location);
    const trimmed = location.trim();
    const key = museum ? museum.id : `other:${normalize(trimmed)}`;
    const existing = sources.get(key);

    if (existing) {
      existing.artworkTitles.push(title);
    } else {
      sources.set(key, {
        key,
        name: museum ? museum.name : trimmed || 'Unknown location',
        url: museum?.url,
        artworkTitles: [title],
      });
    }
  }

  return [...sources.values()];
}