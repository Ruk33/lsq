let state = {
    value: 0,
    user: "someuser",
    password: "super-password",
    is_dialog_visible: false,

    active_element: { id: "", selection_start: 0, selection_end: 0, },
}

const commands = {
    "increase": function() {
        state.value++
    },

    "show-dialog": function() {
        state.is_dialog_visible = true
    },

    "hide-dialog": function() {
        state.is_dialog_visible = false
    },
}

const state_history = [JSON.parse(JSON.stringify(state))]

let state_history_index = 0

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

function render() {
    const dom = app()

    const destination = document.getElementById("application")

    if (destination) {
        destination.innerHTML = dom

        restore_focus_to_last_active_element()
    }
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

function do_async_increase(ms) {
    setTimeout(function() {
        command("increase")
    }, ms)
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

    // don't render if there was no update in the state.
    if (prev_version === new_version) {
        console.log("state", state)
        console.log("no render required since the state didn't changed with the executed command.")
        return
    }

    state_history.push(JSON.parse(new_version))
    state_history_index = state_history.length - 1

    console.log("state before running command", JSON.parse(prev_version))
    console.log("state after  running command", state)

    render()
}

function button(color = "red") {
    if (color == "blue")
        return `bro, do you even?`
    return `
        <button type="button" onclick="window.command('increase')" style="background-color: ${color}">ok</button>
    `
}

function dialog({ visible = false, close_command = "" }) {
    return `
        <div style="position: absolute; top: 200px; left: 200px; border: 2px solid black; display: ${visible ? "block" : "none"}">
            Hello! <button type="button" onclick="window.command('${close_command}')">Close me bro!</button>
        </div>
    `
}

function app() {
    return `
        <div>
            ${dialog({ visible: state.is_dialog_visible, close_command: "hide-dialog" })}
            <button onclick="window.command('show-dialog')">SHOW DIALOG</button>
            <span>value: ${state.value}</span>
            <input id="user" value="${state.user}" oninput="window.command('change-user', event.target.value)" />
            <input id="password" value="${state.password}" oninput="window.command('change-password', event.target.value)" onfocus="console.log('focus!')" />
            <button onclick="window.command('increase')">increase</button>
            <button onclick="window.command('decrease')">decrease</button>
            <button onclick="window.command('increase-async', 5000)">increase after 5 seconds</button>
            ${button()} ${button("blue")}
        </div>
        <div>
            <button onclick="window.command('undo')">undo</button>
            <button onclick="window.command('redo')">redo</button>
        </div>
    `
}

render()
