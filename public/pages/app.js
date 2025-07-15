const state = {
    page: "",

    number: 0,

    pages: {
        "/": function() {
            console.log("user navigated to /")

            state.page = ""
        },

        "/user/:user_id/update": function({ user_id = "" }) {
            console.log(`user navigated to /user/${user_id}/update`)

            state.page = "user_update"
        },
    },
}

function increase_number() {
    console.log("asdasd")
    state.number++
}

function number_component() {
    return `
        <div>
            <div>number is: ${state.number}</div>
            <button type="button" onclick="increase_number()">increase</button>
        </div>`
}

function user_update_page() {
    return `<div>user update page</div>`
}

function html_to_draw() {
    switch (state.page) {
        case "":
            return `<div>hello world</div><div>${number_component()}</div>`
        case "user_update":
            return user_update_page()
    }
}
