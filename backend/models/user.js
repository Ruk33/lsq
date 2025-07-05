globalThis.user_create = function user_create(user = user_fields()) {
    const errors = user_validate(user)

    if (invalid(errors))
        throw errors

    return {
        ok: true,
    }
}
