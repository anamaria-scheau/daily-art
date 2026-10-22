export type ViewEntry = {
  date: string;
  movementId: string;
  artworkId: string;
};

export type ProgressState = {
  viewHistory: ViewEntry[];
  currentProgressIndex: number;
};