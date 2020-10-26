var fetch = require('node-fetch');

module.exports = async function (context, req) {

    const code = req.query.code || null

    const data = {
        client_id: process.env["SpotifyClientId"],
        client_secret: process.env['SpotifyClientSecret'],
        redirect_uri: process.env['SpotifyRedirectUri'],
        grant_type: 'authorization_code',
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