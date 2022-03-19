import { WikipediaPageSummary } from 'interfaces/wikipedia/search';

export enum APIType {
  wikipedia = 'wikipedia',
  giphy = 'giphy',
}

interface QueryParamType {
  query: string;
  lang: string;
  page: number;
  totalHits: number;
}

export type WikiStore = {
  wikipediaPageSummaries: WikipediaPageSummary[];
  queryParams: QueryParamType;
};

export type WikiSummaryType =
  | {
      type: 'update';
      newState: WikipediaPageSummary[];
      queryParams: QueryParamType;
    }
  | {
      type: 'clear';
      queryParams: QueryParamType;
    };

export const wikiSummaryReducer = (state: WikiStore, action: WikiSummaryType): WikiStore => {
  switch (action.type) {
    case 'update':
      return { wikipediaPageSummaries: action.newState, queryParams: action.queryParams };
    case 'clear':
      return { wikipediaPageSummaries: [], queryParams: action.queryParams };
    default:
      return state;
  }
};

export const wikiSummaryInitialState: WikiStore = {
  wikipediaPageSummaries: [],
  queryParams: { query: '', lang: 'en', page: 1, totalHits: 0 },
};
