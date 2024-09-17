require('dotenv').config();

const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = 3000;

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

app.get('/login', (req,res) => {
    const scopes = ['user-read-private', 'user-read-email','user-read-playback-state','user-modify-playback-state'];
    const authorizeURL = spotifyAPI.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
});

app.get('/callback', (req,res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.log('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyAPI.authorizationCodeGrant(code).then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        spotifyAPI.setAccessToken(access_token);
        spotifyAPI.setRefreshToken(refresh_token);

        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
        res.send('Success!');

        setInterval(async () => {
            const data = await spotifyAPI.refreshAccessToken();
            const access_token = data.body['access_token'];
            console.log('The access token has been refreshed!');
            console.log('access_token:', access_token);
            spotifyAPI.setAccessToken(access_token);
        }, expires_in/2 * 1000);

    }).catch(error => {
        console.log('Error:', error);
        res.send(`Error: ${error}`);
    });
});

app.get('/search', (req,res) => {
    const {q} = req.query;
    spotifyAPI.searchTracks(q).then(searchData => {
        const trackURI = searchData.body.tracks.items[0].uri;
        res.json({uri:trackURI});
    }).catch(error => {
        console.log('Error:', error);
        res.send(`Error: ${error}`);
    });
});

app.get('/play', (req,res) => {
    const {uri} = req.query;
    spotifyAPI.play({uris:[uri]}).then(() => {
        res.send('Playing!');
    }).catch(error => {
        console.log('Error:', error);
        res.send(`Error: ${error}`);
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})