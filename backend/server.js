require("../public/lib/helpers.js")

require("../public/lib/validator.js")

require("../public/shared/user.js")

require("../backend/models/user.js")

const http = require("http")

function handler() {
    return user_create({
        username: undefined,
        password: "",
        confirm_password: "",
    })
}

const server = http.createServer(function(request, response) {
    Promise
        .resolve()
        .then(function() {
            return handler(request)
        })
        .then(function(json = {}) {
            response.writeHead(200, { "Content-Type": "text/json" })
            response.end(JSON.stringify(json))
        })
        .catch(function(error) {
            response.writeHead(200, { "Content-Type": "text/json" })
            response.end(JSON.stringify({ error }))
        })
})

const port = 3000

server.listen(port, "localhost", function() {
    console.log(`server started in port ${port}`)
})
