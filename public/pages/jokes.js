function jokes_state() {
    return {
        list: [""],

        request_status: idle,
    }
}

function jokes_init() {
    state.page = "jokes"
}

function request_more_jokes() {
    const already_requesting_joke = state.jokes.request_status === pending

    if (already_requesting_joke)
        return

    console.log("new joke being requested!")

    state.jokes.request_status = pending

    fetch_json(
        "https://api.chucknorris.io/jokes/random", 
        {}, 
        function(joke = { value: "" }) {
            state.jokes.request_status = succeed

            add_jokes([joke.value])
        },
        function() {
            state.jokes.request_status = failed
        }
    )
}

function add_jokes(new_jokes = [""]) {
    state.jokes.list.push(...new_jokes)
}

function jokes_page() {
    return `
        <div>
            ${state.jokes.list.filter(Boolean).map(function(joke) {
                return `<div style="height: 200px; background-color: lightgreen;">${joke}</div>`
            }).join("")}

            ${state.jokes.request_status === pending && `<div>Loading...</div>`}

            <div style="height: 20px; width: 100%; background-color: red;" onviewport="request_more_jokes()"></div>
        </div>
    `
}
