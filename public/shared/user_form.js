globalThis.user_fields = function user_fields() {
    return {
        email: "",
        password: "",
        confirm_password: "",
    }
}

globalThis.user_errors = function user_errors(user = user_fields()) {
    const errors = {
        email: user_email_errors(user.email),
        password: user_password_errors(user.password),
        confirm_password: user_confirm_password_errors(user.password, user.confirm_password),
    }

    return errors
}

globalThis.user_email_errors = function user_email_errors(email = "") {
    return [
        is_present(email, "The email is required"),
        is_email(email, "Not a valid email"),
    ]
}

globalThis.user_password_errors = function user_password_errors(password = "") {
    return [
        is_present(password, "The password is required"),
    ]
}

globalThis.user_confirm_password_errors = function user_confirm_password_errors(password = "", confirm_password = "") {
    return [
        is_equal(password, confirm_password, "Password does not match"),
    ]
}
