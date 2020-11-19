var fetch = require('node-fetch');
var uuid = require('uuid');

module.exports = async function (context, req) {
    context.log("callback invoked")
    var code = req.query.code || null
    var state = req.query.state || null
    var cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : null
    var storedState = cookies.spotify_auth_state ? cookies.spotify_auth_state : null

    if (state === null || state !== storedState) {
        context.log("State mismatch")
        res = {
            status: 302,
            headers: {
                'Location': '/#'.concat(new URLSearchParams({ authstatus: 'state_mismatch' }))
            }
        }
        context.log(res)
        context.done(null, res);
    }

    const data = {
        client_id: process.env["SpotifyClientId"],
        client_secret: process.env['SpotifyClientSecret'],
        redirect_uri: process.env['SpotifyRedirectUri'],
        grant_type: 'authorization_code',
        code: code
    };

    const json = await getToken(new URLSearchParams(data));

    // TODO: wrap in async function
    const containerClient = BlobServiceClient.fromConnectionString(process.env["SecurityStorage"]).getContainerClient(process.env["ContainerName"])
    await containerClient.createIfNotExists()

    const randomUid = uuid.v4()
    const blobName = randomUid.concat('.json')
    const fileContents = JSON.stringify(json)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(fileContents, fileContents.length);

    res = {
        status: 302,
        headers: {
            'Location': '/#'.concat(new URLSearchParams({ authstatus: 'success' }))
        },
        body: null,
        cookies: [
            {
                name: "spotify_auth",
                value: randomUid,
                httpOnly: true,
                // secure: true,
                path: '/api'
            }
        ]
    };

    context.done(null, res);
}

async function getToken(params) {
    return fetch('https://accounts.spotify.com/api/token', { method: 'POST', body: params })
        .then(res => res.json());
}

// TODO: place in shared utils .js
function parseCookie(str) {
    return str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {})
}
