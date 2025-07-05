globalThis.user_validate_username = function user_validate_username(username = "") {
    return [
        is_present(username) ? "" : "The username is required!",
        is_text_between(username, 2, 10) ? "" : "The username must be between 2 and 10 characters long",
    ].filter(Boolean)
}

globalThis.user_validate_password = function user_validate_password(password = "") {
    return [
        is_present(password) ? "" : "The password is required!",
        is_text_between(password, 2, 10) ? "" : "The password must be between 2 and 10 characters long",
    ].filter(Boolean)
}

globalThis.user_validate_confirm_password = function user_validate_confirm_password(password = "", confirm_password = "") {
    return [
        is_equal(password, confirm_password) ? "" : "The passwords do not match",
    ].filter(Boolean)
}
