import axiosBase from 'axios';

const headers = {
  'Content-Type': 'application/json',
};

export const wikiAxios = (lang = 'en') =>
  axiosBase.create({
    baseURL: `https://${lang}.wikipedia.org`,
    headers,
    responseType: 'json',
  });
