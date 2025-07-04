function navigate_to(path = "") {
    const current_path = window.location.hash

    const user_already_in_path = current_path === path

    if (user_already_in_path)
        return

    window.location.hash = path
}

function current_url_matches(path = "") {
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

function link({ path = "", link_props = "", content = "" }) {
    return `
        <a ${link_props} href="#${path}">
            ${content}
        </a>
    `
}

function set_page_from_current_url() {
    state.page = ""
    state.page_params = {}

    for (const path in state.pages) {
        const page_init = state.pages[path]
        const params = current_url_matches(path)

        if (params) {
            state.page_params = params

            page_init()

            return
        }
    }

    default_init()
}

window.addEventListener("popstate", set_page_from_current_url)

window.addEventListener("load", set_page_from_current_url)
