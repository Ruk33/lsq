function router_init() {
    window.addEventListener("popstate", function(e) {
        e.preventDefault()
        window.command("navigate", window.location.hash)
    })

    register_command(navigate)

    window.command("navigate", window.location.hash)
}

function navigate(current_path = "") {
    for (const path in state.routes) {
        const path_command = state.routes[path]
        const params = route_matches(path)

        if (params) {
            window.command(path_command, params)
            return
        }
    }

    window.command("navigate_404")
}

function navigate_to(path = "") {
    if (window.location.hash === path)
        return

    // window.history.pushState({}, "", path);
    window.location.hash = path
}

// don't like this api...
function route_matches(path = "") {
    const current_path = window.location.hash.replace("#", "")

    const current_path_parts = current_path.split("/").filter(Boolean)

    const path_parts = path.split("/").filter(Boolean)

    if (current_path_parts.length !== path_parts.length)
        return false

    const params = {}

    for (let i = 0; i < path_parts.length; i++) {
        if (path_parts[i].startsWith(":")) {
            const param_name = path_parts[i].replace(":", "")
            const param_value = current_path_parts[i]

            params[param_name] = param_value

            continue
        }

        if (path_parts[i] !== current_path_parts[i])
            return false
    }

    return params
}