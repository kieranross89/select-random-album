import { retryAuthFailure } from "./SpotifyAuth.js";

const fetchWithRetries = async (url, options = {}, retries = 2) => {
  const response = await fetch(url, options);
  if (response.ok) {
    return await response.json();
  }

  if (retries > 0) {
    if (response.status === 401) {
      await retryAuthFailure();
      // Get new refresh token from storage
      options.headers.Authorization =
        "Bearer " + localStorage.getItem("access_token");
    }
    return await fetchWithRetries(url, options, retries - 1);
  }
  throw new Error(response.status);
};

export { fetchWithRetries };
