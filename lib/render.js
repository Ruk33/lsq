const state_history = []

let state_history_index = 0

const commands = {}

const queued_commands = []

function register_command(handler) {
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

    console.log("undo called")
    console.log("state before calling undo", state)

    state_history_index--
    state = state_history[state_history_index]

    console.log("state after  calling undo", state)

    render()
}

function redo() {
    if (!state.debug)
        return

    if (state_history_index + 1 >= state_history.length)
        return

    console.log("redo called")
    console.log("state before calling redo", state)

    state_history_index++
    state = state_history[state_history_index]

    console.log("state after  calling redo", state)

    render()
}

function command(name, props) {
    const command_to_execute = commands[name]

    if (!command_to_execute) {
        console.log("WARNING: command without assigned function to execute", name, props)
        return
    }

    const prev_version = JSON.stringify(state)

    command_to_execute(props)

    state.last_command = { name, props, }

    const new_version = JSON.stringify(state)

    const render_is_not_required = prev_version === new_version

    if (render_is_not_required) {
        if (state.debug) {
            console.log("command executed", name, props)
            console.log("no render required since the state didn't changed with the executed command")
        }

        return
    }

    state_history.push(JSON.parse(new_version))
    state_history_index = state_history.length - 1

    if (state.debug) {
        console.log("command executed", name, props)
        console.log("state before running command", JSON.parse(prev_version))
        console.log("state after  running command", state)
    }

    render()
}

function queue_command(name = "", props = {}) {
    queued_commands.push({ name, props })
}

function render() {
    const destination = document.getElementById("application")

    if (destination) {
        // destination.innerHTML = app()

        const dom = document.createElement("div")

        dom.innerHTML = app()

        update_element(destination, dom)
    }

    flush_queued_commands()
}

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
            old_child.innerHTML = new_child.innerHTML
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

            // set selection range can throw an exception so better wrap it in a try/catch
            // to avoid spam errors showing up in the console.
            if (old_child.setSelectionRange) {
                try {
                    old_child.setSelectionRange(selection_start, selection_end)
                } catch (e) {}
            }

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

            console.log("!!")
            console.log(`!! UNDO TRIGGERED WITH CTRL + ${undo_hotkey} (EVENT PREVENT DEFAULT CALLED)`)
            console.log("!!")

            undo()
        }

        if (key_pressed === redo_hotkey) {
            e.preventDefault()

            console.log("!!")
            console.log(`!! REDO TRIGGERED WITH CTRL + ${redo_hotkey} (EVENT PREVENT DEFAULT CALLED)`)
            console.log("!!")

            redo()
        }
    })
}

function init() {
    // make sure we begin with a deep cloned copy of the 
    // initial state to prevent updating default variables
    // (possibly used to generate the initial state)
    state = JSON.parse(JSON.stringify(state))

    render()

    install_undo_redo_hotkeys()
}

// may want to improve this...
setTimeout(init, 100)
