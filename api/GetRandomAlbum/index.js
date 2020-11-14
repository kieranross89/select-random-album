const { BlobServiceClient, HttpHeaders } = require('@azure/storage-blob');
const https = require('https')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : null

    const blockBlobClient = BlobServiceClient.fromConnectionString(process.env["SecurityStorage"])
        .getContainerClient(process.env["ContainerName"])
        .getBlockBlobClient(cookies.spotify_auth + '.json')
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const blobContent = JSON.parse(await streamToString(downloadBlockBlobResponse.readableStreamBody))

    let options = {
        hostname: 'api.spotify.com',
        port: 443,
        path: '/v1/me/albums?'.concat(new URLSearchParams({ limit: 1, offset: 0 })),
        headers: { 'Authorization': 'Bearer ' + blobContent.access_token },
        json: true
    };
    let response = await httpGetRequest(options)
    const totalAlbums = response['total']
    const randomOffset = getRandomInt(0, totalAlbums)

    options = {
        hostname: 'api.spotify.com',
        port: 443,
        path: '/v1/me/albums?'.concat(new URLSearchParams({ limit: 1, offset: randomOffset })),
        headers: { 'Authorization': 'Bearer ' + blobContent.access_token },
        json: true
    };

    response = await httpGetRequest(options)

    context.res = {
        status: 200,
        body: response
    }
}

function parseCookie(str) {
    return str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {})
}

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });

}

async function httpGetRequest(options) {
    // TODO: add retry on 401 to refresh token
    return new Promise(function (resolve, reject) {
        https.get(options, (resp) => {
            let body = ''
            resp.on("data", (chunk) => {
                body += chunk;
            });
            resp.on('end', () => {
                try {
                    body = JSON.parse(body)
                } catch (error) {
                    reject(error)
                }
                resolve(body)
            });
        })
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }