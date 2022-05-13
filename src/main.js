import { getDynamicHomeContent, appendContent, albumContent, insertOrUpdateContent } from "./js/Content.js";
import { redirectSpotifyAuthEndpoint, getAccessToken, loginStatus } from "/js/SpotifyAuth.js"
import { getRandomAlbum } from "/js/SpotifyGetAlbum.js"

await getAccessToken();
// window.albumContent = albumContent;

const content = getDynamicHomeContent(loginStatus());
appendContent(content, document.querySelector('main'));

const randomAlbum = async () => {
        const album = await getRandomAlbum();
        const content = albumContent(album);
        insertOrUpdateContent('album', 'get-album', content)
        document.querySelector('#get-next-album-btn').addEventListener('click', randomAlbum);
};

// Register on click event handler for login button if exists
document.querySelector('#login-btn')?.addEventListener('click', redirectSpotifyAuthEndpoint, false);

// Register on click event handler for get album button if exists
document.querySelector('#get-album-btn')?.addEventListener('click', randomAlbum);

