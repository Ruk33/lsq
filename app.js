let state = {
    value: 0,
    user: "someuser",
    password: "super-password",
    is_dialog_visible: false,

    registration: registration_state,

    checkout: checkout_state,

    debug: true,

    last_command: { name: "", props: {} },
}

register_command(function increase() {
    state.value++
})

register_command(function decrease() {
    state.value--
})

register_command(async function increase_async(ms = 0) {
    await sleep_for(ms)
    window.command("increase")
})

register_command(function change_user(user = "") {
    state.user = user
})

register_command(function change_password(password = "") {
    state.password = password
})

register_command(function show_dialog() {
    state.is_dialog_visible = true
})

register_command(function hide_dialog() {
    state.is_dialog_visible = false
})

registration_commands.forEach(register_command)
// or, if you prefer doing it manually
//
// register_command(registration_set_username)
// register_command(registration_set_password)
// ...

checkout_commands.forEach(register_command)

function app() {
    return checkout_page()

    // return `
    //     <div>
    //         <div>
    //             <div>
    //                 ${dialog({ visible: state.is_dialog_visible, close_command: "window.command('hide_dialog')" })}
    //                 <button onclick="window.command('show_dialog')">Show dialog</button>
    //             </div>




    //             <div>
    //                 <span>value: ${state.value}</span>
    //                 <button onclick="window.command('increase')">increase</button>
    //                 <button onclick="window.command('decrease')">decrease</button>
    //                 <button onclick="window.command('increase_async', 5000)">increase after 5 seconds</button>
    //             </div>




    //             <div>
    //                 <input id="user" value="${state.user}" oninput="window.command('change_user', event.target.value)" />
    //                 <input id="password" value="${state.password}" oninput="window.command('change_password', event.target.value)" onfocus="console.log('focus!')" />
    //             </div>
                



    //             <div>
    //                 <div>${simple_button({})}</div>
    //                 <div>
    //                     ${simple_button({ 
    //                         color: "blue", 
    //                         button_props: `onclick="window.command('increase')"`
    //                     })}
    //                 </div>
    //             </div>




    //             <div>
    //                 ${registration_form({})}
    //             </div>
    //         </div>
    //     </div>
    // `
}
