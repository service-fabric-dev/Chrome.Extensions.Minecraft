class Modpack {
    static fromUrl(url) {
        var modpack = url.replace(`https://www.curseforge.com/minecraft/modpacks/`, ``);

        var query = modpack.indexOf(`?`);
        if (query !== -1) {
            modpack = modpack.slice(0, query);
        }

        var uri = modpack.indexOf(`/`);
        while (modpack.charAt(0) === `/`) {
            modpack = modpack.substring(1);
        }
        
        uri = modpack.indexOf(`/`);
        if (uri !== -1) {
            modpack = modpack.slice(0, uri);
        }

        return modpack.trim();
    }
}