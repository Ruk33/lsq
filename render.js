function restore_focus_to_last_active_element() {
    if (!state.active_element.id)
        return

    const focused = document.getElementById(state.active_element.id)

    if (!focused)
        return

    const prev_onfocus = focused.onfocus

    focused.onfocus = null

    focused.focus()
    focused.setSelectionRange(state.active_element.selection_start, state.active_element.selection_end)

    focused.onfocus = prev_onfocus
}

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

function save_active_element() {
    const active_element = document.activeElement

    state.active_element = {
        id: active_element?.getAttribute("id"),
        selection_start: active_element?.selectionStart,
        selection_end: active_element?.selectionEnd,
    }
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

    save_active_element()

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
        destination.innerHTML = app()

        restore_focus_to_last_active_element()
    }
}
