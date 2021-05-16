export interface CharacterI {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string | string[];
  url: string;
  created: string;
}

export interface EpisodeI {
  id: number;
  name: string;
  air_date: string | Date;
  episode: string;
  characters: CharacterI[];
  url: string;
  created: Date;
}

export interface DashboardDialogsDataI {
  deleteDialog: boolean;
  imageDialog: boolean;
  itemToDelete: CharacterI | null;
  imageUrl: string;
  charName: string;
}
