module.exports = function (context) {
    
    const data = {
        client_id: process.env["SpotifyClientId"],
        response_type: 'code',
        redirect_uri: process.env['SpotifyRedirectUri']
      };
      
    const params = new URLSearchParams(data);
    
    res = {
        status: 302,
        headers: {
            'Location': 'https://accounts.spotify.com/authorize?'.concat(params.toString())
        },
        body: 'Redirecting...'
    };
    context.done(null, res);
};