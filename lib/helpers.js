const request_idle = "request_idle"

const request_pending = "request_pending"

const request_succeeded = "request_succeed"

const request_failed = "request_failed"

function sleep_for(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    })
}

// function parameters(fn) {
//     const text   = fn.toString()
//     const start  = text.indexOf("(")
//     const end    = text.indexOf(")")
//     const params = text.substr(start + 1, end - start - 1).replace(/ /g, "").replace(/([a-zA-Z0-9-]+)=/g, `"$1":`)
//     const json   = params.startsWith("{") ? JSON.parse(params) : JSON.parse(`{${params}}`)
//     return json
// }
