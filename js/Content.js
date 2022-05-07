const getDynamicHomeContent = (userSignedIn, node) => {
    if(userSignedIn) {
        return `
        <div class="container-fluid text-center" id="get-album">
            <p>Now that's out the way. Lets get a random album from your Spotify library.</p>
            <button id="get-album-btn" type="button" class="btn btn-success btn-lg">Get Album</button>
        </div>`
    }
    else {
        return `
        <div class="container-fluid text-center" id="spotifylogin">
            <button id="login-btn" type="button" class="btn btn-success btn-lg" role="button">Login to Spotify</a>
      </div>`
    }
}

const appendContent = (template, node) => {
    node.insertAdjacentHTML('afterend', template)
}

export { getDynamicHomeContent, appendContent }