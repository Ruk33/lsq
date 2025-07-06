globalThis.min_number = Number.MIN_SAFE_INTEGER

globalThis.max_number = Number.MAX_SAFE_INTEGER

globalThis.fails_at = function fails_at(error_message = "") {
    const has_error_message = error_message !== ""

    return has_error_message
}

globalThis.passes_at = function passes_at(error_message = "") {
    return !fails_at(error_message)
}

globalThis.matches_pattern = function matches_pattern(value = "", pattern = RegExp.prototype, error_message = "not matching regular expression") {
    return pattern.test(value) ? "" : error_message
}

globalThis.is_url = function is_url(value = "", error_message = "not a valid url") {
    const is_valid_url = URL.parse(value) !== null

    return is_valid_url ? "" : error_message
}

globalThis.is_number = function is_number(value = "", error_message = "not a valid number") {
    const value_as_number = Number(value)

    const is_nan = value_as_number !== value_as_number

    const is_valid_number = !is_nan

    return is_valid_number ? "" : error_message
}

globalThis.is_positive = function is_positive(value = "", error_message = "not a positive number") {
    if (fails_at(is_number(value)))
        return error_message

    const value_as_number = Number(value)

    return value_as_number > 0 ? "" : error_message
}

globalThis.is_negative = function is_negative(value = "", error_message = "not a negative number") {
    return passes_at(is_positive(value)) ? error_message : ""
}

globalThis.is_zero = function is_zero(value = "", error_message = "not zero") {
    if (fails_at(is_number(value)))
        return error_message

    const value_as_number = Number(value)

    return value_as_number === 0 ? "" : error_message
}

globalThis.is_number_between = function is_number_between(value = "", min = 0, max = 0, error_message = "not between number range") {
    if (fails_at(is_number(value)))
        return error_message

    const value_as_number = Number(value)

    const is_between_range = min <= value_as_number && value_as_number <= max

    return is_between_range ? "" : error_message
}

globalThis.is_date = function is_date(value = "", error_message = "not a date") {
    const value_as_date = new Date(value)

    const date_as_ms = value_as_date.valueOf()

    const is_nan = date_as_ms !== date_as_ms

    const is_valid_date = !is_nan

    return is_valid_date ? "" : error_message
}

globalThis.is_date_between = function is_date_between(value = "", min = new Date(), max = new Date(), error_message = "not between date range") {
    if (fails_at(is_date(value)))
        return error_message

    const min_ms = min.valueOf()

    const max_ms = max.valueOf()

    const value_ms = (new Date(value)).valueOf()

    const is_between_range = min_ms <= value_ms && value_ms <= max_ms

    return is_between_range ? "" : error_message
}

globalThis.is_text_between = function is_text_between(value = "", min = 0, max = 0, error_message = "not between characters range") {
    const letters = value.trim().length

    const is_between_range = min <= letters && letters <= max

    return is_between_range ? "" : error_message
}

globalThis.is_text_outside = function is_text_outside(value = "", min = 0, max = 0, error_message = "not outside characters range") {
    return passes_at(is_text_between(value, min, max)) ? error_message : ""
}

globalThis.is_equal = function is_equal(a = "", b = "", error_message = "not equal") {
    return a === b ? "" : error_message
}

globalThis.is_email = function is_email(value = "", error_message = "not email") {
    const [ name, domain, ...rest ] = value.split("@")

    const valid_email = !!name && !!domain && rest.length === 0

    return valid_email ? "" : error_message
}

globalThis.is_present = function is_present(value = "", error_message = "not present") {
    return value.trim().length > 0 ? "" : error_message
}

globalThis.is_missing = function is_missing(value = "", error_message = "not missing") {
    return passes_at(is_present(value)) ? error_message : ""
}

globalThis.includes_text = function includes_text(value = "", required = "", error_message = "does not include text") {
    return value.includes(required) ? "" : error_message
}

globalThis.starts_with = function starts_with(value = "", required = "", error_message = "does not start with text") {
    return value.startsWith(required) ? "" : error_message
}

globalThis.ends_with = function ends_with(value = "", required = "", error_message = "does not end with text") {
    return value.endsWith(required) ? "" : error_message
}

globalThis.invalid = function invalid(fields = { field_name: [""] }, fields_to_check = ["*"]) {
    const check_all_fields = fields_to_check[0] === "*"

    const all_fields = Object.keys(fields)

    if (check_all_fields)
        fields_to_check = all_fields

    for (const name in fields) {
        if (!fields_to_check.includes(name))
            continue

        const field_errors = [""]
        
        field_errors.push(...fields[name])

        const present_errors = field_errors.filter(Boolean)

        const has_errors = present_errors.length > 0

        if (has_errors)
            return true
    }

    return false
}

globalThis.valid = function valid(fields = { field_name: [""] }, fields_to_check = ["*"]) {
    return !invalid(fields, fields_to_check)
}

globalThis.empty_errors = function empty_errors(fields = {}) {
    const errors = {}

    for (const field_name in fields)
        errors[field_name] = [""]

    return errors
}
