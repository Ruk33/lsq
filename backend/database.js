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

        // no results.
        database.on("close", function() {
            resolve([])
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

    const columns = Object.keys(record).map(function(column) {
        return `"${column}"`
    }).join(", ")

    const values = Object.values(record).map(function(value) {
        const safe_value = typeof value === "string" ? `'${value}'` : value

        return safe_value
    }).join(", ")

    const sql = `insert into "${table_name}" (${columns}) values (${values}) returning *;`

    return query_one(sql)
}

globalThis.column_names = async function columns_of(table_name = "") {
    const columns = await query(`pragma table_info("${table_name}");`)

    const names = columns.map(function(column) {
        return column.name
    })

    return names
}

globalThis.find = function find(table_name = "", record = {}) {
    const columns = Object.keys(record)

    const filters = columns.map(function(column) {
        const value = record[column]

        const safe_value = typeof value === "string" ? `'${value}'` : value

        return `"${column}" = ${safe_value}`
    }).join(" and ")

    const sql = `select * from "${table_name}" where ${filters} limit 1;`

    return query_one(sql)
}

globalThis.find_all = function find_all(table_name = "", record = {}, limit = 100) {
    const columns = Object.keys(record)

    const filters = columns.map(function(column) {
        const value = record[column]

        const safe_value = typeof value === "string" ? `'${value}'` : value

        return `"${column}" = ${safe_value}`
    }).join(" and ")

    const sql = `select * from "${table_name}" where ${filters} limit ${limit};`

    return query(sql)
}

globalThis.update = function update(table_name = "", record = {}, only_fields = ["*"]) {
    const safe_id = typeof record.id === "string" ? `'${record.id}'` : record.id

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

    const assignments = Object.keys(record).map(function(column) {
        const value = record[column]

        const safe_value = typeof value === "string" ? `'${value}'` : value

        return `"${column}" = ${safe_value}`
    }).join(", ")

    const sql = `update "${table_name}" set ${assignments} where "id" = ${safe_id} returning *;`

    return query_one(sql)
}

globalThis.destroy = async function destroy(table_name = "", record = {}) {
    const safe_id = typeof record.id === "string" ? `'${record.id}'` : record.id

    const sql = `delete from "${table_name}" where "id" = ${safe_id};`

    await query(sql)
}
