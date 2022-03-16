import { GiphySearchResult } from 'interfaces/giphy/search';
import { giphyAxios } from './apiConfig';

export const fetchGifSearchResultUsingGET = async (
  query: string,
  rating: string,
  lang: string,
  limit = 10,
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
    .then((res) => res.data as GiphySearchResult)
    .catch((err) => {
      console.error(err);
      throw new Error('failed to fetch Giphy search result');
    });
};
