import { GiphyData } from 'interfaces/giphy/search';

interface GihpyQueryParamType {
  query: string;
  rating: string;
  page: number;
}

export type GihpyStore = {
  giphyData: GiphyData[];
  totalHits: number;
  queryParams: GihpyQueryParamType;
};

export type GiphyDataType =
  | {
      type: 'update';
      newState: GiphyData[];
      totalHits: number;
      queryParams: GihpyQueryParamType;
    }
  | {
      type: 'update_params';
      queryParams: GihpyQueryParamType;
    }
  | {
      type: 'clear';
    };

export const giphyDataReducer = (state: GihpyStore, action: GiphyDataType): GihpyStore => {
  switch (action.type) {
    case 'update':
      return { giphyData: action.newState, queryParams: action.queryParams, totalHits: action.totalHits };
    case 'update_params':
      return { ...state, queryParams: action.queryParams };
    case 'clear':
      return { ...giphyDataInitialState };
    default:
      return state;
  }
};

export const giphyDataInitialState: GihpyStore = {
  giphyData: [],
  totalHits: 0,
  queryParams: { query: '', rating: 'g', page: 1 },
};
