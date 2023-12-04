var userAgent = navigator.userAgent;
console.log("User Agent:", userAgent);

// Function to get trending GIFs by default
function getTrendingGifs() {
    var apiKey = "AIzaSyBp-TxEofbDdxmBa6T-MCyb6rDG4_NVknE"; // Replace with your API key
    var clientKey = "heatic-test-app"; // Replace with your client key
    var limit = 20;

    var trendingUrl = "https://tenor.googleapis.com/v2/featured?key=" + apiKey + "&client_key=" + clientKey + "&limit=" + limit;

    httpGetAsync(trendingUrl, tenorCallbackSearch);
}

// Function to perform search based on user input
function performSearch() {
    var searchTerm = document.getElementById("searchInput").value;
    if (searchTerm.trim() !== "") {
        grabData(searchTerm);
    }
}

function performRefresh() {
    var searchTerm = document.getElementById("searchInput").value;
    if (searchTerm.trim() !== "") {
        grabData(searchTerm);
    }
}

// Function to display GIFs on the page
function displayGifs(gifs) {
    var gifGrid = document.getElementById("gifGrid");
    gifGrid.innerHTML = ""; // Clear previous results

    gifs.forEach(function (gif) {
        var gifImage = document.createElement("img");
        gifImage.src = gif["media_formats"]["nanogif"]["url"]; //if you use nanogif instead of gif it will load faster
        gifImage.alt = "GIF";
        gifImage.className = "gifImage";

        // Add click event to enlarge the original GIF
        gifImage.addEventListener("click", function () {
            console.log('clicked on gif: ' + gif["media_formats"]["gif"]["url"]);
            enlargeGif(gif["media_formats"]["gif"]["url"]);
        });

        gifGrid.appendChild(gifImage);
    });
}

// Callback function for handling API response
function tenorCallbackSearch(responseText) {
    var responseObjects = JSON.parse(responseText);
    var topGifs = responseObjects["results"];
    displayGifs(topGifs);
}

// Function to make an asynchronous GET request
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }

    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

// Function to fetch GIFs based on the search term
function grabData(searchTerm) {
    var apiKey = "AIzaSyBp-TxEofbDdxmBa6T-MCyb6rDG4_NVknE"; // Replace with your API key
    var clientKey = "heatic-test-app"; // Replace with your client key
    var limit = 20;

    var searchUrl = "https://tenor.googleapis.com/v2/search?q=" + searchTerm +
        "&key=" + apiKey + "&client_key=" + clientKey + "&limit=" + limit + "&random=true";

    httpGetAsync(searchUrl, tenorCallbackSearch);

    // Display the refresh button
    document.getElementById("refreshButton").style.display = "block";
}

//Function to refresh data
function refreshData(searchTerm) {
    var apiKey = "AIzaSyBp-TxEofbDdxmBa6T-MCyb6rDG4_NVknE"; // Replace with your API key
    var clientKey = "heatic-test-app"; // Replace with your client key
    var limit = 20;

    var searchUrl = "https://tenor.googleapis.com/v2/search?q=" + searchTerm +
        "&key=" + apiKey + "&client_key=" + clientKey + "&limit=" + limit + "&random=true";

    httpGetAsync(searchUrl, tenorCallbackSearch);
}

// Function to display original GIF when clicked
function enlargeGif(originalUrl) {
    // Create a modal
    var modal = document.createElement("div");
    modal.className = "modal";

    // Create the enlarged GIF
    var enlargedGif = document.createElement("img");
    enlargedGif.src = originalUrl;
    enlargedGif.alt = "Enlarged GIF";
    enlargedGif.className = "enlargedGif";

    // Create a close button
    var closeButton = document.createElement("span");
    closeButton.className = "closeButton";
    closeButton.innerHTML = "&times;"; // Unicode character for 'times' (close)
    closeButton.addEventListener("click", function () {
        modal.remove(); // Close the modal when the close button is clicked
    });

    // Create a download button
    var downloadButton = document.createElement("button");
    downloadButton.className = "downloadButton";
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", function () {
        downloadGif(originalUrl);
    });
    
    // Append the components to the modal
    modal.appendChild(enlargedGif);
    modal.appendChild(closeButton);
    modal.appendChild(downloadButton);

    // Append the modal to the body
    document.body.appendChild(modal);
}

// Function to download the GIF
function downloadGif(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            // Generate a timestamp for the filename
            var timestamp = new Date().getTime();
            // Create a link element
            var a = document.createElement('a');
            // Create a URL for the blob and set it as the href attribute
            a.href = window.URL.createObjectURL(blob);
            // Use the timestamp as the filename
            a.download = 'downloaded_' + timestamp + '.gif';
            // Append the link to the body and trigger a click event
            document.body.appendChild(a);
            a.click();
            // Remove the link from the body
            document.body.removeChild(a);
        })
        .catch(error => console.error('Error downloading GIF:', error));
}

// Load trending GIFs by default when the page loads
window.onload = function () {
    getTrendingGifs();
};