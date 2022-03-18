import { WikipediaPageSummary, WikipediaSearchResult } from 'interfaces/wikipedia/search';
import { wikiAxios } from './apiConfig';

// https://www.mediawiki.org/wiki/API:Search#JavaScript
export const fetchWikiSearchResultUsingGET = async (
  query: string,
  limit: number,
  page = 1,
  lang = 'en'
): Promise<WikipediaSearchResult> => {
  return wikiAxios(lang)
    .get(`/w/api.php`, {
      params: {
        action: 'query',
        srsearch: encodeURIComponent(query),
        srlimit: limit,
        sroffset: (page - 1) * limit,
        list: 'search',
        format: 'json',
        utf8: '',
        origin: '*',
      },
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`fetch wikipedia search result with ${res.status} error`);
      }
      return res.data as WikipediaSearchResult;
    })
    .catch((err) => {
      console.error(err);
      throw new Error('failed to fetch wikipedia search result');
    });
};

export const fetchWikiPageSummaryUsingGET = async (title: string, lang = 'en'): Promise<WikipediaPageSummary> => {
  return wikiAxios(lang)
    .get(`/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`fetch wikipedia summary result with ${res.status} error`);
      }
      return res.data as WikipediaPageSummary;
    })
    .catch((err) => {
      console.error(err);
      throw new Error('failed to fetch wikipedia summary result');
    });
};
