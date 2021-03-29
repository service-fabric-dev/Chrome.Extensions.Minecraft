function isNullOrWhiteSpace(input) {
    return typeof input === "string" && (!input || !input.trim());
}

function decodeHTML(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent;
}