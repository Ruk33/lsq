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
    sql = sql.trim()

    return new Promise(function(resolve, reject) {
        const database = open_database()

        database.stdout.on("data", function(buffer) {
            const json = buffer_to_json(buffer)

            resolve(json)
        })

        database.stderr.on("data", function(buffer) {
            const error = buffer.toString()

            reject({ error })
        })

        database.stdin.write(`${sql}\n`)
        database.stdin.end()
    })
}

globalThis.query_one = async function query_one(sql = "") {
    const results = await query(sql)
    
    const first_result = results[0]

    return first_result
}

globalThis.insert = function insert(table_name = "", record = {}, only_fields = ["*"]) {
    const include_all_fields = only_fields[0] === "*"
    
    const needs_to_skip_fields = !include_all_fields

    if (needs_to_skip_fields) {
        record = JSON.parse(JSON.stringify(record))

        const all_fields = Object.keys(record)

        for (const field of all_fields) {
            if (only_fields.includes(field))
                continue

            delete record[field]
        }
    }

    const columns = Object.keys(record).join(", ")

    const values = Object.values(record).map(function(value) {
        const is_string = typeof value === "string"

        if (is_string)
            return `'${value}'`

        return value
    }).join(", ")

    const sql = `insert into ${table_name} (${columns}) values (${values}) returning *;`

    return query_one(sql)
}
