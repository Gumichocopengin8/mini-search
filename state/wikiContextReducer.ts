import { WikipediaPageSummary } from 'interfaces/wikipedia/search';

interface WikiQueryParamType {
  query: string;
  lang: string;
  page: number;
}

export type WikiStore = {
  wikipediaPageSummaries: WikipediaPageSummary[];
  queryParams: WikiQueryParamType;
  totalHits: number;
};

export type WikiSummaryType =
  | {
      type: 'update';
      newState: WikipediaPageSummary[];
      queryParams: WikiQueryParamType;
      totalHits: number;
    }
  | {
      type: 'update_params';
      queryParams: WikiQueryParamType;
    }
  | {
      type: 'clear';
    };

export const wikiSummaryReducer = (state: WikiStore, action: WikiSummaryType): WikiStore => {
  switch (action.type) {
    case 'update':
      return { wikipediaPageSummaries: action.newState, queryParams: action.queryParams, totalHits: action.totalHits };
    case 'update_params':
      return { ...state, queryParams: action.queryParams };
    case 'clear':
      return { ...wikiSummaryInitialState };
    default:
      return state;
  }
};

export const wikiSummaryInitialState: WikiStore = {
  wikipediaPageSummaries: [],
  totalHits: 0,
  queryParams: { query: '', lang: 'en', page: 1 },
};
