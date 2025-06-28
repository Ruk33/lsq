let state = {
    value: 0,
    user: "someuser",
    password: "super-password",
    is_dialog_visible: false,

    registration: {
        username: "",
        password: "",
        confirm_password: "",

        errors: {
            username: [""],
            password: [""],
            confirm_password: [""],
        },

        submitting: false,
    },

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

    "increase-async": function(ms) {
        setTimeout(function() {
            window.command("increase")
        }, ms)
    },

    "registration_set_username": function(username) {
        state.registration.username = username

        state.registration.errors.username = [
            missing(username) ? "The username is required!" : "",
            undersized(username, 2) ? "The username must be at least 2 characters long" : "",
            oversized(username, 10) ? "The username can't be longer than 10 characters" : "",
        ].filter(Boolean)
    },

    "registration_set_password": function(password) {
        state.registration.password = password

        state.registration.errors.password = [
            missing(password) ? "The password is required!" : "",
            undersized(password, 2) ? "The password must be at least 2 characters long" : "",
            oversized(password, 10) ? "The password can't be longer than 10 characters" : "",
        ].filter(Boolean)
    },

    "registration_set_confirm_password": function(confirm_password) {
        const password = state.registration.password

        state.registration.confirm_password = confirm_password

        state.registration.errors.confirm_password = [
            unequal(password, confirm_password) ? "The passwords do not match" : "",
        ].filter(Boolean)
    },

    "registration_submit": function() {
        if (state.registration.submitting)
            return

        state.registration.errors.username = [
            missing(state.registration.username) ? "The username is required!" : "",
            undersized(state.registration.username, 2) ? "The username must be at least 2 characters long" : "",
            oversized(state.registration.username, 10) ? "The username can't be longer than 10 characters" : "",
        ].filter(Boolean)

        state.registration.errors.password = [
            missing(state.registration.password) ? "The password is required!" : "",
            undersized(state.registration.password, 2) ? "The password must be at least 2 characters long" : "",
            oversized(state.registration.password, 10) ? "The password can't be longer than 10 characters" : "",
        ].filter(Boolean)

        state.registration.errors.confirm_password = [
            unequal(state.registration.password, state.registration.confirm_password) ? "The passwords do not match" : "",
        ].filter(Boolean)

        const invalid = Boolean(
            state.registration.errors.username.length ||
            state.registration.errors.password.length ||
            state.registration.errors.confirm_password.length
        );

        if (invalid)
            return

        state.registration.submitting = true

        // simulate ajax request.
        setTimeout(function() {
            window.command("registration_success")
        }, 5000);
    },

    "registration_success": function() {
        state.registration.submitting = false;

        alert("alright! registered.")
    },

    "registration_error": function() {
        state.registration.submitting = false;
    },
}

const state_history = [JSON.parse(JSON.stringify(state))]

let state_history_index = 0

function missing(value) {
    return !Boolean(value)
}

function oversized(value, length) {
    return value.trim().length > length
}

function undersized(value, length) {
    return value.trim().length < length
}

function invalid_length(value, { min = 0, max = 0 }) {
    const safe_value = Number(value)

    const nan = safe_value !== safe_value
    
    if (nan)
        return false

    return safe_value >= min && safe_value <= max
}

function unequal(a, b) {
    return a !== b
}

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

function button({ color = "red" }) {
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

function form({}) {
    return `
        <form onsubmit="event.preventDefault(); window.command('registration_submit')" style="display: grid">
            <label>
                <span>Username</span>
                <input 
                    id="username"
                    value="${state.registration.username}"
                    oninput="window.command('registration_set_username', event.target.value)"
                />
                ${state.registration.errors.username.join(", ")}
            </label>

            <label>
                <span>Password</span>
                <input 
                    type="password" 
                    id="password" 
                    value="${state.registration.password}" 
                    oninput="window.command('registration_set_password', event.target.value)"
                />
                ${state.registration.errors.password.join(", ")}
            </label>

            <label>
                <span>Confirm password</span>
                <input 
                    type="password" 
                    id="confirm_password" 
                    value="${state.registration.confirm_password}" 
                    oninput="window.command('registration_set_confirm_password', event.target.value)"
                />
                ${state.registration.errors.confirm_password.join(", ")}
            </label>

            <button ${state.registration.submitting && "disabled"}>Submit</button>
        </form>
    `
}

function app() {
    return form({})
    // return `
    //     <div>
    //         ${form({})}
    //         ${dialog({ visible: state.is_dialog_visible, close_command: "hide-dialog" })}
    //         <button onclick="window.command('show-dialog')">SHOW DIALOG</button>
    //         <span>value: ${state.value}</span>
    //         <input id="user" value="${state.user}" oninput="window.command('change-user', event.target.value)" />
    //         <input id="password" value="${state.password}" oninput="window.command('change-password', event.target.value)" onfocus="console.log('focus!')" />
    //         <button onclick="window.command('increase')">increase</button>
    //         <button onclick="window.command('decrease')">decrease</button>
    //         <button onclick="window.command('increase-async', 5000)">increase after 5 seconds</button>
    //         ${button({})} ${button({ color: "blue" })}
    //     </div>
    //     <div>
    //         <button onclick="window.command('undo')">undo</button>
    //         <button onclick="window.command('redo')">redo</button>
    //     </div>
    // `
}

render()
