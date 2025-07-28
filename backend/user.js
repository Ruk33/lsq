globalThis.create_user = async function create_user(user = user_fields()) {
    const errors = user_errors(user)

    if (invalid(errors))
        throw errors

    const new_user = await insert("users", user, ["email", "password"])

    return new_user
}
