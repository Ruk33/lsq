let state = {
    value: 0,
    user: "someuser",
    password: "super-password",

    active_element: { id: "", selection_start: 0, selection_end: 0, },
}

const commands = []

const versions = []

let version_index = 0

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
    if (version_index <= 0)
        return

    version_index--
    state = versions[version_index]

    render()
}

function redo() {
    if (version_index + 1 >= versions.length)
        return

    version_index++
    state = versions[version_index]

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

    const prev_version = JSON.parse(JSON.stringify(state))

    version_index++
    versions.push(prev_version)

    save_active_element()

    command_to_execute(props)
    
    // switch (name) {
    // case "increase":
    //     state.value++
    //     break
    // case "decrease":
    //     state.value--
    //     break
    // case "change-user":
    //     state.user = props
    //     break
    // case "change-password":
    //     state.password = props
    //     break
    // case "increase-async":
    //     do_async_increase(props)
    //     break;
    // default:
    //     console.log("WARNING: command without handler", name, props)
    //     return
    // }

    console.log("command", name, props)
    console.log("previous version", prev_version)
    console.log("new version", state)

    // don't render if there was no update in the state.
    if (JSON.stringify(prev_version) === JSON.stringify(state))
        return

    render()
}

function register_command(name, handler) {
    commands[name] = handler
}

function button(color = "red") {
    if (color == "blue")
        return `bro, do you even?`
    return `
        <button type="button" onclick="window.command('increase')" style="background-color: ${color}">ok</button>
    `
}

function app() {
    return `
        <div>
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

register_command("increase", function(props) {
    state.value++
})

render()
