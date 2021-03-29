let filterInput = document.getElementById("filterInput");
let searchService = new SearchService(new CacheAdapter(), true);

filterInput.addEventListener("keyup", async event => {
    var initializePromise = initialize();

    const enterKey = 13;
    if (event.keyCode === enterKey) {
        // Cancel the default action, if needed
        event.preventDefault();

        // Activate waiting indicator
        toggleIndicators(true, false, false);
        clearModTable();

        chrome.tabs.query(
            {
                currentWindow: true,
                active: true
            },
            async tabs => {
                var url = tabs[0].url;
                var input = filterInput.value;
                var modpack = Modpack.fromUrl(url);

                await initializePromise;
                var exists = await searchService.nameExists(modpack, input)
                if (exists) {
                    console.log("Found pack: " + input);
                    toggleIndicators(false, true, false);
                } else {
                    console.log("Could not find pack: " + input);
                    toggleIndicators(false, false, true)
                }

                var matches = await searchService.search(modpack, input);
                setModTable(matches.filter(match => match));
            });
    }
});

async function initialize() {
    console.log("Initializing...");
    chrome.tabs.query(
        {
            currentWindow: true,
            active: true
        },
        async tabs => {
            var url = tabs[0].url;
            var modpack = Modpack.fromUrl(url);
            var mods = await searchService.getMods(modpack);
            setModTable(mods);

            console.log("Initialized!");
        });
}

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

function setModTable(mods) {
    clearModTable();
    var modsTable = document.getElementById("ModsTable");
    mods.forEach(mod => {
        var row = modsTable.insertRow();
        var cell = row.insertCell();
        cell.innerHTML = mod;
    });
}

function clearModTable() {
    var modsTable = document.getElementById("ModsTable");
    modsTable.innerHTML = "";
}