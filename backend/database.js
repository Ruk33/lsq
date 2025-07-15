const child_process = require("child_process");

function open_database() {
    const database_name = "dev.database"
    
    const process = child_process.spawn("sqlite3", [database_name])

    process.stdin.write(".mode json\n")
    
    return process
}

function buffer_to_json(buffer = Buffer) {
    const buffer_as_string = buffer.toString().trim()

    const buffer_as_json = JSON.parse(buffer_as_string)

    return buffer_as_json
}

globalThis.query = function query(sql = "") {
    return new Promise(function(resolve, reject) {
        const database = open_database()

        database.stdout.on("data", function(buffer) {
            const json = buffer_to_json(buffer)

            resolve(json)
        })

        database.stderr.on("data", reject)

        database.stdin.write(`${sql}\n`)
        database.stdin.end()
    })
}
