globalThis.user_create = function user_create(user = user_fields()) {
    const errors = user_errors(user)

    if (invalid(errors))
        throw errors

    return {
        ok: true,
    }
}
