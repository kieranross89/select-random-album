import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const config = {
        spotifyRedirectUri: process.env["SpotifyRedirectUri"],
        spotifyClientId: process.env["SpotifyClientId"]
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: config
    };

};

export default httpTrigger;