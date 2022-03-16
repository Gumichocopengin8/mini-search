import axiosBase from 'axios';

const urlBase = 'https://api.giphy.com/v1';
const headers = {
  'Content-Type': 'application/json',
};

export const giphyAxios = axiosBase.create({
  baseURL: urlBase,
  headers,
  responseType: 'json',
});
