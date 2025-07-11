function registration_state() {
    const fields = user_fields()

    const errors = empty_errors(fields)

    return {
        fields,

        errors,

        submitting: false,
    }
}

function registration_init() {
    state.page = "registration"
}

function registration_set_username(username = "") {
    username = username.toUpperCase()

    state.registration.fields.username = username

    state.registration.errors.username = username_errors(username)
}

function registration_set_password(password = "") {
    state.registration.fields.password = password

    state.registration.errors.password = password_errors(password)
}

function registration_set_confirm_password(confirm_password = "") {
    const password = state.registration.fields.password

    state.registration.fields.confirm_password = confirm_password

    state.registration.errors.confirm_password = confirm_password_errors(password, confirm_password)
}

function registration_submit() {
    if (state.registration.submitting)
        return

    state.registration.errors = user_errors(state.registration.fields)

    if (invalid(state.registration.errors))
        return

    state.registration.submitting = true

    // simulate ajax request.
    setTimeout(function() {
        registration_success()
    }, 5000);
}

function registration_success() {
    state.registration.submitting = false;

    alert("alright! registered.")
}

function registration_error() {
    state.registration.submitting = false;
}

function registration_form() {
    return `
        <form onsubmit="event.preventDefault(); registration_submit()">
            ${link({ path: "checkout", content: "Go to checkout" })}

            ${text_field({ 
                label: "Username", 
                value: state.registration.fields.username, 
                errors: state.registration.errors.username, 
                input_props: `oninput="registration_set_username(event.target.value)"`,
            })}

            ${text_field({ 
                label: "Password", 
                value: state.registration.fields.password, 
                errors: state.registration.errors.password, 
                input_props: `type="password" oninput="registration_set_password(event.target.value)"`
            })}

            ${text_field({ 
                label: "Confirm Password", 
                value: state.registration.fields.confirm_password, 
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
