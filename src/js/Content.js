const getDynamicHomeContent = (userSignedIn) => {
  if (userSignedIn) {
    return `
        <div class="container-fluid text-center" id="get-album">
            <p>Now that's out the way. Lets get a random album from your Spotify library.</p>
            <button id="get-album-btn" type="button" class="btn btn-success btn-lg">Get Album</button>
        </div>`;
  } else {
    return `
        <div class="container-fluid text-center" id="spotifylogin">
            <button id="login-btn" type="button" class="btn btn-success btn-lg" role="button">Login to Spotify</a>
      </div>`;
  }
};

const albumContent = (album) => {
  const albumDetails = album.items[0].album;
  return `
        <div class="container-fluid text-center">
        <h2>Album Details</h2>
        <ul class="list-inline">
          <li class="list-inline-item"><strong>Artist(s):</strong> ${albumDetails.artists[0].name}</li>
          <li class="list-inline-item"><strong>Title:</strong> ${albumDetails.name}</li>
        </ul>
        <ul class="list-inline">
          <li class="list-inline-item"><strong>Label:</strong> ${albumDetails.label}</li>
          <li class="list-inline-item"><strong>Released:</strong> ${albumDetails.release_date}</li>
          <li class="list-inline-item"><strong>Type:</strong> ${albumDetails.album_type}</li>
        </ul>
        <a href="${albumDetails.external_urls.spotify}" target="_blank">
          <img src="${albumDetails.images[1].url}" class="pb-3 img-thumbnai"/>
        </a>
        <div>
          <button id="get-next-album-btn" type="button" class="btn btn-success btn-lg">Get Another Album</button>
        </div>
        </div>
      `;
};

const appendContent = (template, node) => {
  node.insertAdjacentHTML("afterend", template);
};

const insertOrUpdateContent = (elementName, elementToReplace, content) => {
  // TODO: This should be done before passed in
  const container = document.createElement("div");
  container.setAttribute("id", elementName);
  container.innerHTML = content;

  // If element already exists straight replace
  if (checkElementExists(elementName)) {
    const element = document.getElementById(elementName);
    element.replaceWith(container);
  }

  // Remove and replace element if element does not already exist
  removeElement(elementToReplace);
  const main = document.querySelector("main");
  main.append(container);
};

const checkElementExists = (name) => {
  const element = document.getElementById(name);
  if (!element) {
    return false;
  }
  return true;
};

const removeElement = (name) => {
  const element = document.getElementById(name);
  if (element) {
    element.parentNode.removeChild(element);
  }
};

export {
  getDynamicHomeContent,
  albumContent,
  appendContent,
  insertOrUpdateContent,
};
