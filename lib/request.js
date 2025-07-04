const idle    = "idle"
const pending = "pending"
const succeed = "succeed"
const failed  = "failed"

function request_was_aborted(request_status = idle) {
    return request_status !== pending
}

function response_to_json(response = Response.prototype) {
    return response.json()
}
