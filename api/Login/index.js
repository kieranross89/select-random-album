var uuid = require('uuid');

module.exports = function (context) {
    
    var state = uuid.v4()
    
    const data = {
        client_id: process.env["SpotifyClientId"],
        response_type: 'code',
        redirect_uri: process.env['SpotifyRedirectUri'],
        state: state,
        scope: 'user-library-read'
      };
      
    const params = new URLSearchParams(data);
    
    res = {
        status: 302,
        headers: {
            'Location': 'https://accounts.spotify.com/authorize?'.concat(params.toString()),
            'Headers': Set
        },
        body: 'Redirecting...',
        cookies: [
            {
                name: "spotify_auth_state",
                value: state,
                httpOnly: true,
                path: '/app/api'
            }
        ]
    };
    context.done(null, res);
};