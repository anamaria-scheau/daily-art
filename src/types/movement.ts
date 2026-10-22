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
  story: string[];
  lookCloser: string[];
  context: string[];
  artistBio: string;
  artistAtTheTime: string;
  details: ArtworkDetails;
};

export type Movement = {
  id: string;
  order: number;
  name: string;
  yearRange: string;
  description: string;
  artworks: Artwork[];
};