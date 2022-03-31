import { redirectSpotifyAuthEndpoint, getAccessToken } from "/js/SpotifyAuth.js"

// Redirect user to auth endpoint to accept requested scopes
// If successful user is redirected back to home page with URL search params with state and code
const login = () => {
    redirectSpotifyAuthEndpoint();
}
// Register on click event handler for login button
document.querySelector('#login-btn').addEventListener('click', login);

// If user has been redirected back to home page post auth and code and state URL search params exist get and access token
getAccessToken();