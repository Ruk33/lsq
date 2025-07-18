async function user_create(user = user_fields()) {
    const errors = user_errors(user)

    if (invalid(errors))
        throw errors

    const guest = user_fields()

    let new_user = guest

    new_user = await insert("users", user, ["username", "password"])

    return new_user
}

share_function(user_create)
