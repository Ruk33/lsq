function create_client_server_bridge_for(fn = function() {}) {
    const function_name = fn.name

    globalThis[function_name] = function() {
        // make this one configurable, perhaps adding a config file?
        return fetch(`http://localhost:3000/api/${function_name}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify.apply(null, arguments),
        }).then(response_to_json)
    }
}

function create_client_server_bridges() {
    const names = Object.keys(globalThis)

    const prefix = "api_"

    for (const name of names) {
        if (name.startsWith(prefix)) {
            const fn = globalThis[name]

            create_client_server_bridge_for(fn)
        }
    }
}

window.addEventListener("load", create_client_server_bridges)
