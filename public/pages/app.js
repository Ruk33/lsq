const state = {
    page: "",

    page_params: {},

    pages: {
        "/checkout": checkout_init,
        "/register": registration_init,
        // "user/:user_id/edit": "user",
    },

    jokes: [""],
    request_jokes_status: idle,

    value: 0,
    
    username: "john",
    password: "doe",

    is_dialog_visible: false,

    registration: registration_state(),

    checkout: checkout_state(),
}

function default_init() {
    state.page = ""
}

function request_more_jokes() {
    if (state.request_jokes_status === pending)
        return

    state.request_jokes_status = pending

    console.log("new joke requested!")

    fetch("https://api.chucknorris.io/jokes/random")
        .then(response_to_json)
        .then(function(joke) {
            add_jokes([joke.value])
        })
        .finally(function() {
            state.request_jokes_status = idle
        })
}

function add_jokes(new_jokes = [""]) {
    state.jokes.push(...new_jokes)
}

function set_username_after(ms = 0, new_username = "") {
    setTimeout(function() {
        state.username = new_username
    }, ms);
}

function demo_page() {
    return `
        ${link({
            path: `/user/${42}/update`,
            content: "go to user!"
        })}
        |
        ${link({
            path: `/checkout`,
            content: "go to checkout!"
        })}
        <div>${state.username}</div>
        <div>${state.value}</div>
        <button type="button" onclick="state.username = 'foo'">set username to foo</button>
        <button type="button" onclick="set_username_after(1000, 'bar')">set username to bar after 1 second</button>
        <input type="text" oninput="state.username = event.target.value" value="${state.username}" />

        ${state.jokes.map(function(joke) {
            return `<div style="height: 200px; background-color: lightgreen;">${joke}</div>`
        }).join("")}

        ${state.request_jokes_status === pending && `<div>Loading...</div>`}

        <div style="height: 20px; width: 100%; background-color: red;" onviewport="request_more_jokes()"></div>
    `
}

function app() {
    switch (state.page) {
        case "checkout":
            return checkout_page()
        case "registration":
            return registration_page()
        default:
            return demo_page()
    }
}
