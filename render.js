const state_history = [JSON.parse(JSON.stringify(state))]

let state_history_index = 0

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

function render() {
    const destination = document.getElementById("application")

    if (destination) {
        const dom = document.createElement("div")

        dom.innerHTML = app()

        update_element(destination, dom)
    }
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

            if (old_child.setSelectionRange)
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
    render()

    install_undo_redo_hotkeys()
}

setTimeout(init, 1)
