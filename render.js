const state_history = [JSON.parse(JSON.stringify(state))]

let state_history_index = 0

function undo() {
    if (state_history_index - 1 < 0)
        return

    state_history_index--
    state = state_history[state_history_index]

    render()
}

function redo() {
    if (state_history_index + 1 >= state_history.length)
        return

    state_history_index++
    state = state_history[state_history_index]

    render()
}

function command(name, props) {
    switch (name) {
    case "undo":
        undo()
        return
    case "redo":
        redo()
        return
    default:
        break
    }

    const command_to_execute = commands[name]

    if (!command_to_execute) {
        console.log("WARNING: command without assigned function to execute", name, props)
        return
    }

    const prev_version = JSON.stringify(state)

    command_to_execute(props)

    const new_version = JSON.stringify(state)

    console.log("command executed", name, props)

    const render_is_not_required = prev_version === new_version

    if (render_is_not_required) {
        console.log("no render required since the state didn't changed with the executed command")
        return
    }

    state_history.push(JSON.parse(new_version))
    state_history_index = state_history.length - 1

    console.log("state before running command", JSON.parse(prev_version))
    console.log("state after  running command", state)

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

            update_element(old_child, new_child)
        }
    }
}

setTimeout(render, 1)
