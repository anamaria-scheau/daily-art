export type ArtworkDetails = {
  medium: string;
  dimensions: string;
  location: string;
};

export type Artwork = {
  id: string;
  title: string;
  artist: string;
  year: string;
  imageKey: string;
  imageCredit: string;
  description: string;
  story: string;
  lookCloser: string[];
  details: ArtworkDetails;
  context: string;
  artistBio: string;
};

export type Movement = {
  id: string;
  order: number;
  name: string;
  yearRange: string;
  description: string;
  artworks: Artwork[];
};