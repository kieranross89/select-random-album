const clientId = "CLIENTSECRET";
const redirectUri = "http://127.0.0.1:5500";

const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateCodeChallenge = async (codeVerifier) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  );

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const storeParams = (codeVerifier, state) => {
  window.localStorage.setItem("code_verifier", codeVerifier);
  window.localStorage.setItem("state", state);
};

const redirectSpotifyAuthEndpoint = async () => {
  const state = generateRandomString(16);
  const codeVerifier = generateRandomString(64);
  storeParams(codeVerifier, state);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const data = {
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    state: state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    scope: "user-library-read",
  };

  const params = new URLSearchParams(data);

  location.assign("https://accounts.spotify.com/authorize?".concat(params));
};

const validateState = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (!urlSearchParams.has("state")) {
    return false;
  }

  const state = urlSearchParams.get("state");
  const storedState = window.localStorage.getItem("state");

  return state === storedState ? true : false;
};

const getCode = () => {
    var urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.has("code") ? urlSearchParams.get("code") : null;
}

const getAccessToken = async () => {
  const isStateValid = validateState();
  const codeVerifier = window.localStorage.getItem("code_verifier");
  const code = getCode();

  if (isStateValid && codeVerifier && code) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });
  }
};

export { redirectSpotifyAuthEndpoint, getAccessToken };
