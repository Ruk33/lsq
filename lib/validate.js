function missing(value) {
    return !Boolean(value)
}

function oversized(value, length) {
    return value.trim().length > length
}

function undersized(value, length) {
    return value.trim().length < length
}

// function invalid_length(value, { min = 0, max = 0 }) {
//     const safe_value = Number(value)
//     const nan = safe_value !== safe_value
//     if (nan)
//         return false
//     return safe_value >= min && safe_value <= max
// }

function unequal(a, b) {
    return a !== b
}

function invalid(fields) {
    for (const name in fields) {
        const errors = fields[name]

        if (errors.length)
            return true
    }

    return false
}
