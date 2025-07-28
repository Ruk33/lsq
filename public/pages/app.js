const state = {
    page: "",

    pages: {
        "/": function() {
            state.page = "index"
            console.log("user navigated to /")
        },

        "/user/:user_id/update": function(params) {
            state.page = "user_update"
            console.log("user navigated to /user/:user_id/update", params)
        }
    },

    number: 0,
}

function increase_number() {
    state.number++
}

async function call_backend_function() {
    console.log("calling api_create_user which is a function that lives in the backend")
    const response = await api_create_user()
    console.log("response", response)
}

function html_to_draw() {
    return `
        <div>
            <div>you are in page: ${state.page}</div>
            <div>number is: ${state.number}</div>
            <button type="button" onclick="increase_number()">increase number</button>
            <button type="button" onclick="call_backend_function()">call backend function</button>
            <div>${link({ path: "/", content: "go to index" })}</div>
            <div>${link({ path: "/user/42/update", content: "go to update user 42" })}</div>
        </div>
    `
}
