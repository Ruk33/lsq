// don't like the name of the function, "share function"
// we are not technically "sharing" the function, we are
// just providing an intermediary between the backend
// and the frontend. not a big fan of the file's name,
// "server.js"
globalThis.share_function = function share_function(fn = function() {}) {
    const in_server = typeof window === "undefined"

    const function_name = fn.name

    if (in_server) {
        globalThis[function_name] = fn

        return
    }

    globalThis[function_name] = function() {
        // make this one configurable, perhaps adding a config file?
        return fetch(`http://localhost:3000/api/${function_name}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify.apply(null, arguments),
        })
    }
}
