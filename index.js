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
        state.registration.username = username

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
