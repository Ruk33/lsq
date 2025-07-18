const idle    = "idle"
const pending = "pending"
const succeed = "succeed"
const failed  = "failed"

const alive_requests = [-1]

function request_was_aborted(request_status = idle) {
    return request_status !== pending
}

function fetch_json(url = "", options = {}, succeed_fn = do_nothing, error_fn = do_nothing) {
    const request_id = now()

    alive_requests.push(request_id)

    fetch(url, options)
        .then(response_to_json)
        .then(function(json) {
            if (is_request_alive(request_id))
                succeed_fn(json)
        })
        .catch(function(error) {
            if (is_request_alive(request_id))
                error_fn(error)
        })
        .finally(function() {
            ignore_request(request_id)
        })

    return request_id
}

// i don't quite like this function name.
function is_request_alive(request_id = 0) {
    return alive_requests.includes(request_id)
}

function ignore_request(request_id = 0) {
    const request_index = alive_requests.indexOf(request_id)

    const request_not_found = request_index === -1

    if (request_not_found)
        return

    alive_requests.splice(request_index, 1)
}

function clear_alive_requests() {
    alive_requests.length = 0
}
