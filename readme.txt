what is this?
    lsq is a hobby project, a collection of libraries i began with the intention
    of creating web applications in the most easy way. what if we could just
    store the state of the application in a global variable? what if even
    better, we could just update that global variable and the ui gets updated
    automatically out of the box without doing anything extra? that's what i was
    looking for and luckily, i ended up with these results which i'm quite happy
    with.

tl;dr;
    create web apps by just updating a global variable and drawing
    components/ui-elements by returning html as string. like react but without
    extra concepts (hooks, contexts, etc.) and common features installed out of
    the box (navigation, validation, etc.)

folder structure
    - backend: server code. still bare bones, haven't worked on it yet. it's
      just placeholder code to demonstrate how we can share code with the
      frontend and the backend. in this example, we share the code for
      validating the creation of users (registration).

    - public: everything meant to be downloaded by users meaning, html, js, css,
      etc. this is the folder you should upload to services such as s3 to
      "deploy" your frontend.

    - public/lib: folder for this library.

    - public/pages: folder containing the pages you will have in your
      application.
    
    - public/shared: folder for code meant to be used in both, the frontend and
      the backend. this is usually useful to store logic such as form validation.

    right now some folders contain demo/example code but in later versions they
    should be empty (for example: public/pages, public/shared, etc.) or more
    likely, i will move this examples to a new folder, perhaps, "examples".

how does it looks like?
    let's begin with a simple component:

    ```
    function my_button(background_color = "red") {
        return `
            <button style="background-color: ${background_color}">
                Hello!
            </button>
        `
    }

    // This function gets called automatically every time we need to draw the ui
    function html_to_draw() {
        return my_button("red")
    }
    ```

    nice! let's see how to add some state (as a global variable):

    ```
    const state = {
        username: "",
    }
    ```

    and now, we can use that state in the components:

    ```
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

    function html_to_draw() {
        return my_button("red")
    }
    ```

    super simple right? this project (or template if you will) allows you to
    write your entire application/project this way. no extra steps/concepts to
    learn!

how to install it?
    for now, just clone/download the entire project and start working on it.

how to upgrade?
    ideally, you should be able to just download the new version, paste it into
    your project and that's it. this is by no means ideal, but... if you think
    about it, it does make out for a rather simple flow, doesn't it?

documentation
    check the `docs` folder.

license
    mit
