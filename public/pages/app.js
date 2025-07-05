const state = {
    page: "",

    page_params: {},

    pages: {
        "/checkout": checkout_init,
        "/register": registration_init,
        "/jokes": jokes_init,
        // routes with parameters
        // "user/:user_id/edit": user_edit_init,
    },

    value: 0,
    
    username: "john",

    password: "doe",

    registration: registration_state(),

    checkout: checkout_state(),

    jokes: jokes_state(),
}

function default_page_init() {
    state.page = ""
}

async function set_username_after(ms = 0, new_username = "") {
    await sleep_for(ms)
    state.username = new_username
}

function demo_page() {
    const update_user_link = link({
        path: `/user/${42}/update`,
        content: "go to user!"
    })

    return `
        <div>Username is: ${state.username}</div>
        <div>Password is: ${state.password}</div>

        <div>Value is: ${state.value}</div>

        <div>
            <button 
                type="button" 
                onclick="state.username = 'foo'"
            >
                set username to foo
            </button>

            <button 
                type="button" 
                onclick="set_username_after(1000, 'bar')"
            >
                set username to bar after 1 second
            </button>

            <input 
                type="text" 
                oninput="state.username = event.target.value" 
                value="${state.username}"
            />
        </div>

        <div>${update_user_link}</div>
                
        <div>
            ${link({
                path: `/checkout`,
                content: "go to checkout!"
            })}
        </div>
    `
}

function app() {
    switch (state.page) {
        case "checkout":
            return checkout_page()
        case "registration":
            return registration_page()
        case "jokes":
            return jokes_page()
        default:
            return demo_page()
    }
}
