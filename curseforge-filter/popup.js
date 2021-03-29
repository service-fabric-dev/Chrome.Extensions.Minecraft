let filterInput = document.getElementById("filterInput");
let searchService = new SearchService(new CacheAdapter(), true);

filterInput.addEventListener("keyup", async event => {
    const enterKey = 13;
    if (event.keyCode === enterKey) {
        // Cancel the default action, if needed
        event.preventDefault();

        // Activate waiting indicator
        toggleIndicators(true, false, false);

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
                    toggleIndicators(false, true, false);
                } else {
                    console.log("Could not find pack: " + input);
                    toggleIndicators(false, false, true)
                }
            });
    }
});

function toggleIndicators(thinking, exists, notExists) {
    var thinkingIndicator = document.getElementById("ThinkingIndicator");
    var existsIndicator = document.getElementById("ExistsIndicator");
    var notExistsIndicator = document.getElementById("NotExistsIndicator");

    if (thinking) {
        thinkingIndicator.removeAttribute("hidden");
    } else {
        thinkingIndicator.setAttribute("hidden", true);
    }

    if (exists) {
        existsIndicator.removeAttribute("hidden");
    } else {
        existsIndicator.setAttribute("hidden", true);
    }

    if (notExists) {
        notExistsIndicator.removeAttribute("hidden");
    } else {
        notExistsIndicator.setAttribute("hidden", true);
    }
}