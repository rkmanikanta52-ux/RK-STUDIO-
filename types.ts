export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  searchEntryPoint?: {
    renderedContent: string;
  };
}

export interface SearchResult {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

export interface Restaurant {
  name: string;
  rating: string;
  description: string;
  specialties: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}