// not sure about this... although... it could have potential
globalThis.user_create_fields = function user_create_fields() {
    return {
        username: "",
        password: "",
        confirm_password: "",

        errors: {
            username: [""],
            password: [""],
            confirm_password: [""],
        },
    }
}

globalThis.user_create = function user_create({ username = "", password = "", confirm_password = "", }) {
    // --
    const errors = {
        username: user_validate_username(username),
        password: user_validate_password(password),
        confirm_password: user_validate_confirm_password(confirm_password),
    }

    if (invalid(errors))
        throw errors
    // -- 
    // is pretty much the same as the frontend.
    // same steps, we validate, if everything is ok, then we execute
    // backend only code. perhaps there is something here...

    return {
        username,
    }
}
