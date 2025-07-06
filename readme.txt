WHAT IS THIS?
    LSQ is a hobby project I began with the intention of creating
    web applications in the most easy way. What if we could just
    store the state of the application in a global variable? What
    if even better, we could just update that global variable and
    the UI gets updated automatically out of the box without doing
    anything extra? That's what I was looking for and luckily, I
    ended up with these results which I'm quite happy with.

TL;DR;
    Create web apps by just updating a global variable and drawing
    components/UI-elements by returning HTML text. Like React but
    without extra concepts (hooks, contexts, etc) and common features
    installed out of the box (navigation, validation, etc.)

FOLDER STRUCTURE
    - backend: Backend (server) code. Still bare bones, haven't 
      worked on it yet. It's just placeholder code to demonstrate
      how we can share code with the frontend and the backend. In
      this example, we share the code for validating the creation
      of users (registration).

    - public: Everything meant to be downloaded by users meaning,
      HTML, JS, CSS, etc. This is the folder you should upload
      to services such as S3 to "deploy" your frontend.

    - public/lib: Folder for this library.

    - public/pages: Folder containing the pages you will have in
      your application.

    - public/pages/shared: Folder for components to be shared across
      your pages (buttons, modals, etc)
    
    - public/shared: Folder for code meant to be used in both, the
      frontend and the backend. This is usually useful to store
      logic such as form validation.

    Right now some folders contain demo/example code but in later versions
    they should be empty (for example: public/pages, public/shared, etc)
    or more likely, I will move this examples to a new folder, perhaps,
    "examples".

    I'm not quite sure yet, but this project looks more like a template
    where you can just copy, paste, and start your project. Why not 
    releasing it as an NPM dependency you may ask? Not quite sure yet 
    although, I would say I like the idea of the simple flow of just 
    copying, pasting, and starting the project.

HOW DOES IT LOOKS LIKE?
    Let's begin with a simple component:

    --
    function my_button(background_color = "red") {
        return `
            <button
                style="background-color: ${background_color}"
            >
                Hello!
            </button>
        `
    }

    // This function gets called automatically every time we need to 
    // draw/render the interface.
    function app() {
        return my_button("red")
    }
    --

    Nice! Let's see how to add some state (as a global variable):

    --
    const state = {
        username: "",
    }
    --

    And now, we can use that state in the components:

    --
    function my_button(background_color = "red") {
        return `
            <button
                style="background-color: ${background_color}"
                onclick="state.username = 'foo'"
            >
                Hello ${state.username}! Click me to change your user to "foo"
            </button>
        `
    }

    function app() {
        return my_button("red")
    }
    --

    Super simple right? This project (or template if you will)
    allows you to write your entire application/project this way.
    No extra steps/concepts to learn!

HOW TO INSTALL IT?
    For now, just clone/download the entire project and start working 
    on it.

HOW TO UPGRADE?
    Ideally, you should be able to just download the new version,
    paste it into your project and that's it. This is by no means
    ideal, but... if you think about it, it does make out for a rather
    simple flow, doesn't it?

HOW TO DO NAVIGATION?
    By default, the navigation implementation will look for a field
    "pages" and "page_params" in your state. Pages contains the 
    paths/routes + the functions to call when the user navigates to
    such page. "page_params" will store the URL parameters.

    --
    const state = {
        pages: {
            "/": function_to_call_when_user_navigates_this_page,
            "/user/:user_id/update": update_user
        }
    }
    --

    If the user navigates to "/user/42/update", the function 
    "update_user" will be called and "page_params" will be
    { user_id: "42" }

    If no page matches (404), the function "default_page_init"
    will be called.

    Note: for now, the navigation gets done using the "#" trick.
    I don't quite like it but, it works nicely for html pages
    without having to set up a server to serve these files.

HOW TO DO REQUESTS?
    Keep in mind you can just simply use "fetch" but, there is a helper
    function inside public/lib/request.js which allows to ignore certain
    requests. This is useful when we could possibly make many requests
    but we just only care about the last one being made.

    --
    const state = {
        some_request_id: 0,
    }

    function make_request() {
        // Ignore previous request.
        ignore_request(state.some_request_id)

        const api_url = "https://..."

        const fetch_options = {}

        // Assign new request id.
        state.some_request_id = fetch_json(
            api_url, 
            fetch_options, 
            on_success,
            on_error
        )
    }

    function on_success() {
        ...
    }

    function on_errror() {
        ...
    }
    --

    By "ignoring" previous requests, we simply instruct the helper 
    function to not call "on_success" or "on_error" if we no longer
    care for it.

    Imagine we call "make_request" twice:

    --
    state.some_request_id = 1

    // ...

    ignore_request(1) // ignore previous request, meaning,
                      // when completing, don't call on_success
                      // nor on_error for this one
    state.some_request_id = 2
    --

    If we don't ignore the first request (id = 1) we will call 
    "on_success" or "on_error" twice. But, if we ignore previous
    requests (id = 1), the helper functions knows that we don't
    care about the first request (id = 1) and when completed, it
    won't call "on_success" nor "on_error" for it. When the second
    request completes, since we are still interested in this request,
    the helper function will call "on_success" or "on_error".

HOW TO DO VALIDATION?
    For form validation you can use the available validator functions
    found in public/lib/validator.js. For an example look for
    public/pages/registration.js In this example you can see how the
    validation is being used for code living in the frontend and in
    the backend.
    
    Having said that, the basics are:

    - Define fields, for example: 

    --
    const state = {
        fields: { username: "", password: "" }
    }
    --

    - With these fields, we need a place to store errors:

    --
    const state = {
        fields: ...
        errors: { username: [""], password: [""] }
    }
    --

    - Define the validation rules. These are simple functions that
      return error messages when the field is not valid. These functions
      can be placed in public/shared so both, the frontend and the
      backend can make use of it:

    --
    globalThis.username_errors = function username_errors(username = "") {
        return [
            is_present(username, "The username is required"),
        ]
    }
    --

    Note: "globalThis.username_errors" is only required if you intend
    to use this function in both, the frontend and the backend. If you only
    want this function in the frontend, you don't need this assignment.

    - You can then validate and check if each field is valid:

    --
    state.errors.username = username_errors(state.fields.username)
    --

    - And finally, check if the entire set is valid/invalid:

    --
    state.errors.username = username_errors(...)
    state.errors.password = password_errors(...)

    valid(state.errors)
    invalid(state.errors)
    --

LICENSE
    MIT
