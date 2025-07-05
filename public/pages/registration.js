function registration_state() {
    return {
        username: "",
        password: "",
        confirm_password: "",

        errors: {
            username: [""],
            password: [""],
            confirm_password: [""],
        },

        submitting: false,
    }
}

function registration_init() {
    state.page = "registration"
}

function registration_set_username(username = "") {
    username = username.toUpperCase()

    state.registration.username = username

    state.registration.errors.username = registration_validate_username(username)
}

function registration_set_password(password = "") {
    state.registration.password = password

    state.registration.errors.password = registration_validate_password(password)
}

function registration_set_confirm_password(confirm_password = "") {
    const password = state.registration.password

    state.registration.confirm_password = confirm_password

    state.registration.errors.confirm_password = registration_validate_confirm_password(password, confirm_password)
}

function registration_submit() {
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
}

function registration_success() {
    state.registration.submitting = false;

    alert("alright! registered.")
}

function registration_error() {
    state.registration.submitting = false;
}

function registration_validate_username(username = "") {
    return user_validate_username(username)
}

function registration_validate_password(password = "") {
    return user_validate_password(password)
}

function registration_validate_confirm_password(password = "", confirm_password = "") {
    return user_validate_confirm_password(password, confirm_password)
}

function registration_form() {
    return `
        <form onsubmit="event.preventDefault(); registration_submit()">
            ${link({ path: "checkout", content: "Go to checkout" })}

            ${text_field({ 
                label: "Username", 
                value: state.registration.username, 
                errors: state.registration.errors.username, 
                input_props: `oninput="registration_set_username(event.target.value)"`,
            })}

            ${text_field({ 
                label: "Password", 
                value: state.registration.password, 
                errors: state.registration.errors.password, 
                input_props: `type="password" oninput="registration_set_password(event.target.value)"`
            })}

            ${text_field({ 
                label: "Confirm Password", 
                value: state.registration.confirm_password, 
                errors: state.registration.errors.confirm_password, 
                input_props: `type="password" oninput="registration_set_confirm_password(event.target.value)"`
            })}

            <button ${state.registration.submitting && "disabled"}>Submit</button>
        </form>
    `
}

function registration_page() {
    return registration_form()
}
