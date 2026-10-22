export type TimelineStackParamList = {
  Timeline: undefined;
  Epoch: { movementId: string };
  Artwork: { artworkId: string };
};

export type CalendarStackParamList = {
  Calendar: undefined;
  Day: { artworkId: string };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  Artwork: { artworkId: string };
};