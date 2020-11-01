var fetch = require('node-fetch');

module.exports = async function (context, req) {

    const code = req.query.code || null
    var state = req.query.state || null
    var cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : null
    var storedState = cookies.spotify_auth_state ? cookies.spotify_auth_state: null

    if (state === null || state !== storedState) {
        res = {
            status: 302,
            headers: {
                'Location': '/#'.concat(new URLSearchParams({error: 'state_mismatch'}))
            }
        }
        context.done(null, res);
      }


    const data = {
        client_id: process.env["SpotifyClientId"],
        client_secret: process.env['SpotifyClientSecret'],
        redirect_uri: process.env['SpotifyRedirectUri'],
        grant_type: 'authorization_code',
        scope: 'user-library-read',
        code: code
        };

    const json = await getHttp(new URLSearchParams(data));
    const urlFragment = new URLSearchParams(
        {
            access_token: json.access_token,
            refresh_token: json.refresh_token
        }
    );

    res = {
        status: 302,
        headers: {
            //TODO param location url
            'Location': 'http://127.0.0.1:5500/#'.concat(urlFragment.toString())
        },
        body: null
    };

    context.done(null, res);
}

async function getHttp(params) {       
    return fetch('https://accounts.spotify.com/api/token', {method: 'POST', body: params})
    .then(res => res.json());
}

function parseCookie (str) {
   return str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {})
}