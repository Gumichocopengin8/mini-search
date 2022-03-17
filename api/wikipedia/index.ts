import { WikipediaPageSummary, WikipediaSearchResult } from 'interfaces/wikipedia/search';
import { wikiAxios } from './apiConfig';

export const fetchWikiSearchResultUsingGET = async (
  query: string,
  limit: number,
  lang = 'en'
): Promise<WikipediaSearchResult> => {
  return wikiAxios(lang)
    .get(`/w/api.php`, {
      params: {
        action: 'opensearch',
        search: query,
        limit: limit,
        format: 'json',
        origin: '*',
      },
    })
    .then((res) => {
      if (res.data.length < 4) {
        throw new Error('result length is less than 4');
      }
      const result: WikipediaSearchResult = {
        keyword: res.data[0],
        titles: res.data[1],
        titleLinks: res.data[3],
      };
      return result;
    })
    .catch((err) => {
      console.error(err);
      throw new Error('failed to fetch wikipedia search result');
    });
};

export const fetchWikiPageSummaryUsingGET = async (title: string, lang = 'en'): Promise<WikipediaPageSummary> => {
  return wikiAxios(lang)
    .get(`/api/rest_v1/page/summary/${title}`)
    .then((res) => res.data as WikipediaPageSummary)
    .catch((err) => {
      console.error(err);
      throw new Error('failed to fetch wikipedia summary result');
    });
};
