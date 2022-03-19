import { GiphyData } from 'interfaces/giphy/search';

interface QueryParamType {
  query: string;
  rating: string;
  page: number;
  totalHits: number;
}

export type GhipyStore = {
  giphyData: GiphyData[];
  queryParams: QueryParamType;
};

export type GiphyDataType =
  | {
      type: 'update';
      newState: GiphyData[];
      queryParams: QueryParamType;
    }
  | {
      type: 'clear';
      queryParams: QueryParamType;
    };

export const giphyDataReducer = (state: GhipyStore, action: GiphyDataType): GhipyStore => {
  switch (action.type) {
    case 'update':
      return { giphyData: action.newState, queryParams: action.queryParams };
    case 'clear':
      return { giphyData: [], queryParams: action.queryParams };
    default:
      return state;
  }
};

export const giphyDataInitialState: GhipyStore = {
  giphyData: [],
  queryParams: { query: '', rating: 'g', page: 1, totalHits: 0 },
};
