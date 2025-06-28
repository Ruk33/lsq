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

    debug: false,

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

function app() {
    return `
        <div>
            <div>
                <div>
                    ${dialog({ visible: state.is_dialog_visible, close_command: "window.command('hide dialog')" })}
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
                    <div>
                        ${simple_button({ 
                            color: "blue", 
                            button_props: `onclick="window.command('increase')"`
                        })}
                    </div>
                </div>

                <div>
                    ${registration_form({})}
                </div>
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
