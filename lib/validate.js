function missing(value = "") {
    return !Boolean(value)
}

function oversized(value = "", length = 0) {
    return value.trim().length > length
}

function undersized(value = "", length = 0) {
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

function invalid(fields = { field_name: [""] }, fields_to_check = ["*"]) {
    const check_all_fields = fields_to_check[0] === "*"

    const all_fields = Object.keys(fields)

    if (check_all_fields)
        fields_to_check = all_fields

    for (const name in fields) {
        if (!fields_to_check.includes(name))
            continue

        const errors = fields[name]

        const has_errors = errors.length > 0

        if (has_errors)
            return true
    }

    return false
}
