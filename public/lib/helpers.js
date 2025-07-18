globalThis.response_to_json = function response_to_json(response = Response.prototype) {
    return response.json()
}

globalThis.clone = function clone(value = {}) {
    const cloned = JSON.parse(JSON.stringify(value))
    
    return cloned
}

globalThis.now = function now() {
    return Date.now()
}

globalThis.safe_html = function(html = "") {
    return html
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
}

globalThis.do_nothing = function do_nothing() {
    
}

globalThis.sleep_for = function sleep_for(ms = 0) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    })
}

globalThis.debounce = function debounce(fn = function() {}, ms = 0) {
    let timer = -1

    return function() {
        clearTimeout(timer)
        timer = setTimeout(fn, ms);
    }
}

// function parameters(fn) {
//     const text   = fn.toString()
//     const start  = text.indexOf("(")
//     const end    = text.indexOf(")")
//     const params = text.substr(start + 1, end - start - 1).replace(/ /g, "").replace(/([a-zA-Z0-9-]+)=/g, `"$1":`)
//     const json   = params.startsWith("{") ? JSON.parse(params) : JSON.parse(`{${params}}`)
//     return json
// }
