let filterInput = document.getElementById("filterInput");
let searchService = new SearchService(new CacheAdapter(), true);

filterInput.addEventListener("keyup", async event => {
    const enterKey = 13;
    if (event.keyCode === enterKey) {
        // Cancel the default action, if needed
        event.preventDefault();
        chrome.tabs.query(
            {
                currentWindow: true,
                active: true
            },
            async tabs => {
                var url = tabs[0].url;
                var input = filterInput.value;
                var modpack = Modpack.fromUrl(url);
                var exists = await searchService.nameExists(modpack, input)
                if (exists) {
                    console.log("Found pack: " + input);
                    var existsIndicator = document.getElementById("ExistsIndicator");
                    var notExistsIndicator = document.getElementById("NotExistsIndicator");
                    existsIndicator.removeAttribute("hidden");
                    notExistsIndicator.setAttribute("hidden", true);
                } else {
                    console.log("Could not find pack: " + input);
                    var existsIndicator = document.getElementById("ExistsIndicator");
                    var notExistsIndicator = document.getElementById("NotExistsIndicator");
                    existsIndicator.setAttribute("hidden", true);
                    notExistsIndicator.removeAttribute("hidden");
                }
            });
    }
});