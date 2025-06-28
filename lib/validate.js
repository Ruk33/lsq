function missing(value) {
    return !Boolean(value)
}

function oversized(value, length) {
    return value.trim().length > length
}

function undersized(value, length) {
    return value.trim().length < length
}

function unequal(a, b) {
    return a !== b
}

function valid_email(value = "") {
    const [ name, domain, ...rest ] = value.split("@")

    return !!name && !!domain && rest.length === 0
}

function valid_presence(value = "") {
    return !!value
}

function invalid(fields) {
    for (const name in fields) {
        const errors = fields[name]

        if (errors.length)
            return true
    }

    return false
}
