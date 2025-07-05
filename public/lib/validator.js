const min_number = Number.MIN_SAFE_INTEGER
globalThis.min_number = min_number

const max_number = Number.MAX_SAFE_INTEGER
globalThis.max_number = max_number

globalThis.matches_regexp = function matches_regexp(value = "", reg_exp = new RegExp()) {
    return reg_exp.test(value)
}

globalThis.is_url = function is_url(value = "") {
    const is_valid_url = URL.parse(value) !== null

    return is_valid_url
}

globalThis.is_number = function is_number(value = "") {
    const value_as_number = Number(value)

    const is_nan = value_as_number !== value_as_number

    const is_valid_number = !is_nan

    return is_valid_number
}

globalThis.is_positive = function is_positive(value = "") {
    if (!is_number(value))
        return false

    const value_as_number = Number(value)

    return value_as_number > 0
}

globalThis.is_negative = function is_negative(value = "") {
    return !is_positive(value)
}

globalThis.is_zero = function is_zero(value = "") {
    if (!is_number(value))
        return false

    const value_as_number = Number(value)

    return value_as_number === 0
}

globalThis.is_number_between = function is_number_between(value = "", min = 0, max = 0) {
    if (!is_number(value))
        return false

    const value_as_number = Number(value)

    const is_between_range = min <= value_as_number && value_as_number <= max

    return is_between_range
}

globalThis.is_date = function is_date(value = "") {
    const value_as_date = new Date(value)

    const date_as_ms = value_as_date.valueOf()

    const is_nan = date_as_ms !== date_as_ms

    const is_valid_date = !is_nan

    return is_valid_date
}

globalThis.is_date_between = function is_date_between(value = "", min = new Date(), max = new Date()) {
    if (!is_date(value))
        return false

    const min_ms = min.valueOf()

    const max_ms = max.valueOf()

    const value_ms = (new Date(value)).valueOf()

    const is_between_range = min_ms <= value_ms && value_ms <= max_ms

    return is_between_range
}

globalThis.is_text_between = function is_text_between(value = "", min = 0, max = 0) {
    const letters = value.trim().length

    const is_between_range = min <= letters && letters <= max

    return is_between_range
}

globalThis.is_equal = function is_equal(a = "", b = "") {
    return a === b
}

globalThis.is_email = function is_email(value = "") {
    const [ name, domain, ...rest ] = value.split("@")

    return !!name && !!domain && rest.length === 0
}

globalThis.is_present = function is_present(value = "") {
    return value.trim().length > 0
}

globalThis.is_missing = function is_missing(value = "") {
    return !is_present(value)
}

globalThis.includes_text = function includes_text(value = "", required = "") {
    return value.includes(required)
}

globalThis.starts_with = function starts_with(value = "", required = "") {
    return value.startsWith(required)
}

globalThis.ends_with = function ends_with(value = "", required = "") {
    return value.endsWith(required)
}

globalThis.invalid = function invalid(fields = { field_name: [""] }, fields_to_check = ["*"]) {
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

globalThis.valid = function valid(fields = { field_name: [""] }, fields_to_check = ["*"]) {
    return !invalid(fields, fields_to_check)
}
