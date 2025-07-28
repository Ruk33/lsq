const http = require("http")

require("../public/lib/helpers.js")

require("../public/lib/validator.js")

require("../public/shared/user_form.js")

require("../public/shared/api.js")

require("../backend/database.js")

require("../backend/user.js")

function get_params(request = Request.prototype) {
    return new Promise(function(resolve) {
        let data = ""

        request.on("data", function(chunk) {
            data += chunk.toString()
        })

        request.on("end", function() {
            resolve(JSON.parse(data || "{}"))
        })
    })
}

function disable_cors(response) {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

async function handle_request(request, response) {
    disable_cors(response)

    if (request.method === "OPTIONS") {
        response.writeHead(204)
        response.end()

        return
    }

    const not_api = !request.url.startsWith("/api/")

    if (not_api) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ ok: false, }))

        return
    }

    try {
        const function_name = request.url.replace("/api/", "")

        const handler = globalThis[function_name] || do_nothing

        const parameters = await get_params(request)

        const result = await handler(parameters)

        response.writeHead(200, { "Content-Type": "application/json", })
        response.end(JSON.stringify(result || {}))
    } catch (error) {
        response.writeHead(400, { "Content-Type": "application/json" })
        response.end(JSON.stringify(error))
    }
}

const port = 3000

http.createServer(handle_request).listen(port, "localhost", function() {
    console.log(`server started. listening for requests at http://localhost:${port}`)
})
