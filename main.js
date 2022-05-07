import { getDynamicHomeContent, appendContent } from "./js/Content.js";
import { redirectSpotifyAuthEndpoint, getAccessToken, loginStatus } from "/js/SpotifyAuth.js"
import { getCountSavedAlbums, getRandomAlbum } from "/js/SpotifyGetAlbum.js"


await getAccessToken();

const content = getDynamicHomeContent(loginStatus());
appendContent(content, document.querySelector('main'));

// Register on click event handler for login button if exists
document.querySelector('#login-btn')?.addEventListener('click', redirectSpotifyAuthEndpoint, false);

// Register on click event handler for get album button if exists
document.querySelector('#get-album-btn')?.addEventListener('click', getRandomAlbum)

