const temp_rendering_destination = document.createElement("div")

const state_history = []

let state_history_index = 0

const commands = {}

const queued_commands = []

function register_command(handler = function(props = {}) {}) {
    commands[handler.name] = handler
}

function flush_queued_commands() {
    if (!queued_commands.length)
        return

    const command = queued_commands.shift()

    window.command(command.name, command.props)
}

function undo() {
    if (!state.debug)
        return

    if (state_history_index - 1 < 0)
        return

    console.log("%c         UNDO ", "background:rgb(180, 122,  41);")
    console.log("%c STATE BEFORE ", "background:rgb(230, 105, 105);", state)

    state_history_index--
    state = state_history[state_history_index]

    console.log("%c  STATE AFTER ", "background:rgb( 69, 173,  86);", state)
    console.log("")

    render()
}

function redo() {
    if (!state.debug)
        return

    if (state_history_index + 1 >= state_history.length)
        return

    console.log("%c STATE BEFORE REDO ", "background:rgb(230, 105, 105);", state)

    state_history_index++
    state = state_history[state_history_index]

    console.log("%c  STATE AFTER REDO ", "background:rgb( 69, 173,  86);", state)
    console.log("")

    render()
}

function command(name = "", props = {}) {
    const command_to_execute = commands[name]

    if (!command_to_execute) {
        if (state.debug)
            console.warn("WARNING: command without assigned function to execute", name, props)

        return
    }

    const prev_version = JSON.stringify(state)

    command_to_execute(props)

    state.last_command = { name, props, }

    const new_version = JSON.stringify(state)

    const render_is_not_required = prev_version === new_version

    if (render_is_not_required) {
        if (state.debug) {
            console.log("%c      COMMAND ", "background:rgb(180, 122, 41);", { name, props })
            console.log("no render required since the state didn't changed with the executed command")
            console.log("")
        }

        return
    }

    state_history.push(JSON.parse(new_version))
    state_history_index = state_history.length - 1

    if (state.debug) {
        console.log("%c      COMMAND ", "background:rgb(180, 122,  41);", { name, command: { name, props, time: new Date(), }, state_before_command: JSON.parse(prev_version), state_after_command: state, })
        console.log("%c STATE BEFORE ", "background:rgb(230, 105, 105);", JSON.parse(prev_version))
        console.log("%c  STATE AFTER ", "background:rgb( 69, 173,  86);", state)
        console.log("")
    }

    render()
}

function queue_command(name = "", props = {}) {
    queued_commands.push({ name, props })
}

function render_immediately() {
    const start_rendering = state.debug ? Date.now() : 0

    const destination = window.application

    if (destination) {
        temp_rendering_destination.innerHTML = app()

        update_element(destination, temp_rendering_destination)

        if (state.debug) {
            const rendering_complete = Date.now()

            const rendering_time = rendering_complete - start_rendering

            console.log("%c  RENDER (ms) ", "background:rgb(69, 135, 173);", rendering_time)
            console.log("")
        }
    }

    flush_queued_commands()
}

const render = debounce(render_immediately, 0)

function update_element(parent, new_content) {
    const old_children = parent.children
    const new_children = new_content.children

    for (let i = 0; i < Math.max(old_children.length, new_children.length); i++) {
        const old_child = old_children[i]
        const new_child = new_children[i]

        if (!old_child && !new_child)
            continue
        else if (!old_child && new_child)
            parent.appendChild(new_child)
        else if (old_child && !new_child)
            parent.removeChild(old_child)
        else if (old_child.tagName !== new_child.tagName)
            parent.replaceChild(new_child, old_child)
        else {
            const selection_start = old_child.selectionStart
            const selection_end = old_child.selectionEnd

            // remove attributes that are not present in the new node version.
            for (const { name } of old_child.attributes) {
                if (!new_child.hasAttribute(name))
                    old_child.removeAttribute(name)
            }

            for (const { name, value } of new_child.attributes) {
                const old_value = old_child.getAttribute(name)

                if (name === "value")
                    old_child.value = value
                if (old_value !== value)
                    old_child.setAttribute(name, value)
            }

            if (!old_child.children.length && old_child.innerHTML !== new_child.innerHTML)
                old_child.innerHTML = new_child.innerHTML

            if (old_child.setSelectionRange && old_child.getAttribute("type") === "text")
                old_child.setSelectionRange(selection_start, selection_end)

            update_element(old_child, new_child)
        }
    }
}

function install_undo_redo_hotkeys() {
    window.addEventListener("keydown", function(e) {
        if (!state.debug)
            return

        const ctrl = e.ctrlKey

        if (!ctrl)
            return

        const key_pressed = e.key

        const undo_hotkey = state.undo_hotkey || "z"

        const redo_hotkey = state.redo_hotkey || "y"

        if (key_pressed === undo_hotkey) {
            e.preventDefault()

            console.warn(`UNDO TRIGGERED WITH CTRL + ${undo_hotkey} (EVENT PREVENT DEFAULT CALLED)`)

            undo()
        }

        if (key_pressed === redo_hotkey) {
            e.preventDefault()

            console.warn(`REDO TRIGGERED WITH CTRL + ${redo_hotkey} (EVENT PREVENT DEFAULT CALLED)`)

            redo()
        }
    })
}

function install_routing() {
    window.addEventListener("popstate", function(e) {
        e.preventDefault()
        window.command("navigate", window.location.hash)
    })
}

function navigate_to(path = "") {
    if (window.location.hash === path)
        return

    // window.history.pushState({}, "", path);
    window.location.hash = path
}

function init() {
    // make sure we begin with a deep cloned copy of the 
    // initial state to prevent updating default variables
    // (possibly used to generate the initial state)
    state = JSON.parse(JSON.stringify(state))

    install_undo_redo_hotkeys()

    install_routing()

    render()

    window.command("navigate", window.location.hash)
}

setTimeout(init, 16)
