import { fetchWithRetries } from './RequestHelpers.js';

const baseUrl = 'https://api.spotify.com/v1';

const getCountSavedAlbums = async () => {
  const accessToken = localStorage.getItem('access_token');
  // TODO add better handling for expired tokens etc
  const requestUrl = `${baseUrl}/me/albums?${new URLSearchParams({
    limit: 1,
    offset: 0
  })}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  };

  const { total } = await fetchWithRetries(requestUrl, requestOptions);
  return total;
};

function getRandomInt (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const getRandomAlbum = async () => {
  const totalAlbumCount = await getCountSavedAlbums();
  const randomOffset = getRandomInt(0, totalAlbumCount);

  const accessToken = localStorage.getItem('access_token');
  const requestUrl = `${baseUrl}/me/albums?${new URLSearchParams({
    limit: 1,
    offset: randomOffset
  })}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  };

  return await fetchWithRetries(requestUrl, requestOptions);
};

export { getRandomAlbum, getCountSavedAlbums };
