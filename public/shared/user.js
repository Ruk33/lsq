globalThis.user_fields = function user_fields() {
    return {
        username: "",
        password: "",
        confirm_password: "",
    }
}

globalThis.user_errors = function user_errors(user = user_fields()) {
    const errors = {
        username: username_errors(user.username),
        password: password_errors(user.password),
        confirm_password: confirm_password_errors(user.password, user.confirm_password),
    }

    return errors
}

globalThis.username_errors = function username_errors(username = "") {
    const min_chars = 2

    const max_chars = 8

    return [
        is_present(username, "The username is required"),
        is_text_between(username, min_chars, max_chars, `The username must be between ${min_chars} and ${max_chars} characters long`),
    ]
}

globalThis.password_errors = function password_errors(password = "") {
    const min_chars = 2

    const max_chars = 10

    return [
        is_present(password, "The password is required"),
        is_text_between(password, min_chars, max_chars, `The password must be between ${min_chars} and ${max_chars} characters long`)
    ]
}

globalThis.confirm_password_errors = function confirm_password_errors(password = "", confirm_password = "") {
    return [
        is_equal(password, confirm_password, "The passwords do not match"),
    ]
}
