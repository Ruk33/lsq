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

const state_history = [JSON.parse(JSON.stringify(state))]

let state_history_index = 0

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
        state.registration.username = username.toUpperCase()

        state.registration.errors.username = registration_validate_username(username)
    },

    "registration_set_password": function(password) {
        state.registration.password = password

        state.registration.errors.password = registration_validate_password(password)
    },

    "registration_set_confirm_password": function(confirm_password) {
        const password = state.registration.password

        state.registration.confirm_password = confirm_password

        state.registration.errors.confirm_password = registration_validate_confirm_password(password, confirm_password)
    },

    "registration_submit": function() {
        if (state.registration.submitting)
            return

        state.registration.errors.username = registration_validate_username(state.registration.username)

        state.registration.errors.password = registration_validate_password(state.registration.password)

        state.registration.errors.confirm_password = registration_validate_confirm_password(
            state.registration.password, 
            state.registration.confirm_password
        )

        if (invalid(state.registration.errors))
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

function registration_validate_username(username) {
    return [
        missing(username) ? "The username is required!" : "",
        undersized(username, 2) ? "The username must be at least 2 characters long" : "",
        oversized(username, 10) ? "The username can't be longer than 10 characters" : "",
    ].filter(Boolean)
}

function registration_validate_password(password) {
    return [
        missing(password) ? "The password is required!" : "",
        undersized(password, 2) ? "The password must be at least 2 characters long" : "",
        oversized(password, 10) ? "The password can't be longer than 10 characters" : "",
    ].filter(Boolean)
}

function registration_validate_confirm_password(password, confirm_password) {
    return [
        unequal(password, confirm_password) ? "The passwords do not match" : "",
    ].filter(Boolean)
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

function text_field(id = "", { label = "", value = "", errors = [""], input_command = "", input_props = "" }) {
    return `
        <div>
            <label>
                <div>${label}</div>
                <input 
                    ${input_props}
                    id="${id}"
                    value="${value}"
                    oninput="window.command('${input_command}', event.target.value)"
                />
            </label>
            <div style="color: red">${errors.map(function(error) {
                return `<div>${error}</div>`
            })}</div>
        </div>
    `
}

function form({}) {
    return `
        <form onsubmit="event.preventDefault(); window.command('registration_submit')">
            ${text_field("username", { 
                label: "Username", 
                value: state.registration.username, 
                errors: state.registration.errors.username, 
                input_command: "registration_set_username",
            })}

            ${text_field("password", { 
                label: "Password", 
                value: state.registration.password, 
                errors: state.registration.errors.password, 
                input_command: "registration_set_password",
                input_props: `type="password"`
            })}

            ${text_field("confirm_password", { 
                label: "Confirm Password", 
                value: state.registration.confirm_password, 
                errors: state.registration.errors.confirm_password, 
                input_command: "registration_set_confirm_password",
                input_props: `type="password"`
            })}

            <button ${state.registration.submitting && "disabled"}>Submit</button>
        </form>
    `
}

function app() {
    return `
        <div>
            <div>
                ${form({})}
                ${dialog({ visible: state.is_dialog_visible, close_command: "hide-dialog" })}
                <button onclick="window.command('show-dialog')">SHOW DIALOG</button>
                <span>value: ${state.value}</span>
                <input id="user" value="${state.user}" oninput="window.command('change-user', event.target.value)" />
                <input id="password" value="${state.password}" oninput="window.command('change-password', event.target.value)" onfocus="console.log('focus!')" />
                <button onclick="window.command('increase')">increase</button>
                <button onclick="window.command('decrease')">decrease</button>
                <button onclick="window.command('increase-async', 5000)">increase after 5 seconds</button>
                ${button({})} ${button({ color: "blue" })}
            </div>
            <div>
                <button onclick="window.command('undo')">undo</button>
                <button onclick="window.command('redo')">redo</button>
            </div>
        </div>
    `
}

render()
