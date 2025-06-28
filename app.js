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

    last_command: { name: "", props: {} },
}

const commands = {
    "increase": function() {
        state.value++
    },

    "decrease": function() {
        state.value--
    },

    "increase async": function(ms) {
        setTimeout(function() {
            window.command("increase")
        }, ms)
    },

    "change user": function(user) {
        state.user = user
    },

    "change password": function(password) {
        state.password = password
    },

    "show dialog": function() {
        state.is_dialog_visible = true
    },

    "hide dialog": function() {
        state.is_dialog_visible = false
    },

    // ...
}

function simple_button({ color = "red" }) {
    return `
        <button 
            type="button" 
            onclick="window.command('increase')" 
            style="background-color: ${color}"
        >
            ok
        </button>
    `
}

function dialog({ visible = false, close_command = "" }) {
    return `
        <div style="position: absolute; top: 200px; left: 200px; border: 2px solid black; display: ${visible ? "block" : "none"}">
            Hello! <button type="button" onclick="window.command('${close_command}')">Close me!</button>
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

function app() {
    return `
        <div>
            <div>
                <div>
                    ${dialog({ visible: state.is_dialog_visible, close_command: "hide dialog" })}
                    <button onclick="window.command('show dialog')">Show dialog</button>
                </div>

                <div>
                    <span>value: ${state.value}</span>
                    <button onclick="window.command('increase')">increase</button>
                    <button onclick="window.command('decrease')">decrease</button>
                    <button onclick="window.command('increase async', 5000)">increase after 5 seconds</button>
                </div>

                <div>
                    <input id="user" value="${state.user}" oninput="window.command('change user', event.target.value)" />
                    <input id="password" value="${state.password}" oninput="window.command('change password', event.target.value)" onfocus="console.log('focus!')" />
                </div>
                
                <div>
                    <div>${simple_button({})}</div>
                    <div>${simple_button({ color: "blue" })}</div>
                </div>

                <div>
                    ${registration_form({})}
                </div>
            </div>

            <div>
                <button onclick="window.command('undo')">undo</button>
                <button onclick="window.command('redo')">redo</button>
            </div>
        </div>
    `
}

function register_command(handler) {
    commands[handler.name] = handler
}

register_command(registration_set_username)
register_command(registration_set_password)
register_command(registration_set_confirm_password)
register_command(registration_submit)
register_command(registration_success)
register_command(registration_error)
