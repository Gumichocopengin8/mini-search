import { GiphySearchResult, GiphyAutoComplete } from 'interfaces/giphy/search';
import { giphyAxios } from './apiConfig';

export const fetchGifSearchResultUsingGET = async (
  query: string,
  rating: string,
  lang: string,
  limit: number,
  pageNumber = 1
): Promise<GiphySearchResult> => {
  return giphyAxios
    .get(`/gifs/search`, {
      params: {
        api_key: process.env.GIPHY_TOKEN,
        q: query,
        limit: limit,
        offset: (pageNumber - 1) * limit,
        rating: rating,
        lang: lang,
      },
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`fetch Giphy search result with ${res.status} error`);
      }
      return res.data as GiphySearchResult;
    })
    .catch((err) => {
      console.error(err);
      throw new Error('failed to fetch Giphy search result');
    });
};

export const fetchAutoCompletetUsingGET = async (
  query: string,
  limit: number,
  pageNumber = 1
): Promise<GiphyAutoComplete> => {
  return giphyAxios
    .get(`/gifs/search/tags`, {
      params: {
        api_key: process.env.GIPHY_TOKEN,
        q: query,
        limit: limit,
        offset: (pageNumber - 1) * limit,
      },
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`fetch Giphy autocomplete with ${res.status} error`);
      }
      return res.data as GiphyAutoComplete;
    })
    .catch((err) => {
      console.error(err);
      throw new Error('failed to fetch Giphy autocomplete');
    });
};
