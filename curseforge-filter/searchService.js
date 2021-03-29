class SearchService {
    _storageApi; // Session storage
    _enableCaching; // Feature flag for caching

    constructor(storageApi, enableCaching) {
        this._storageApi = storageApi;
        this._enableCaching = enableCaching;
    }

    async nameExists(modpack, name) {
        if (isNullOrWhiteSpace(modpack)) {
            return false;
        }

        if (isNullOrWhiteSpace(name)) {
            return false;
        }

        var mods = await this.getMods(modpack);
        return typeof mods === "object" &&
            mods.length &&
            mods.includes(name);
    }

    async getMods(modpack) {
        var mods;
        var cachingEnabled = this._enableCaching;
        if (cachingEnabled) {
            mods = this._storageApi.get(modpack);
        }
        
        if (!mods) {
            var fetchedMods = await this.fetchMods(modpack);
            mods = fetchedMods ? fetchedMods : new [0];

            // var packedMods = { };
            // packedMods[modpack] = mods;

            this._storageApi.set(modpack, mods);
        }

        return mods
    }
    
    async fetchMods(modpack) {
        var mods = [];
        var baseUrl = `https:\/\/www.curseforge.com`;
        var resourceUri = `minecraft\/modpacks\/${modpack}\/relations\/dependencies`;
        var url = `${baseUrl}\/${resourceUri}`;
        
        var root = await fetch(url);
        if (!root.ok) {
            return;
        }

        var rootHtml = await root.text();
        var totalPages = this.getTotalPages(rootHtml);
        var pagePromises = [];
        for (var i=0; i<totalPages; i++) {
            var pagedUrl = `${url}\?page=${i+1}`;
            pagePromises.push(fetch(pagedUrl));
        }

        var pages = await Promise.all(pagePromises);
        var pagesHtml = await Promise.all(pages
            .filter(page => page.ok)
            .map(page => page.text()));
        
        pagesHtml.forEach(html => {
            var newMods = this.getPageEntries(html);
            if (newMods) {
                mods.push(...newMods);
            }
        });

        return mods;
    }

    getPageEntries(html) {
        var mods = [];
        var entryPattern = new RegExp(`<h3 class="font-bold text-lg hover:no-underline">.*<\/h3>`, `g`);
        var matches = [...html.matchAll(entryPattern)];

        matches.forEach(match => {
            // Clean match text
            var cleanMatch = decodeHTML(
                match[0]
                    .replace(`<h3 class="font-bold text-lg hover:no-underline">`,``)
                    .replace(`<\/h3>`,``)
                    .trim());

            // Add to mods
            mods.push(cleanMatch);
        });

        return mods;
    }

    getTotalPages(html) {
        var totalPages = -1;
        var pagePattern = new RegExp(`page=[0-9]+`, `g`);
        var matches = [...html.matchAll(pagePattern)];

        matches.forEach(match => {
            var cleanMatch = parseInt(match[0].replace(`page=`, ``));
            if (cleanMatch > totalPages) {
                totalPages = cleanMatch;
            }
        });

        return totalPages;
    }

    async getStorageApi() {
        return this._storageApi;
    }
}
