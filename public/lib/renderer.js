const fps = 60

const frame_ms = 1000 / fps

const after_render_callbacks = [function() {}]

function after_render(fn = function() {}) {
    after_render_callbacks.push(fn)
}

function update_element(parent = Element.prototype, new_content = Element.prototype) {
    if (parent.children.length !== new_content.children.length) {
        parent.innerHTML = new_content.innerHTML

        return
    }

    const children_count = parent.children.length

    for (let i = 0; i < children_count; i++) {
        const old_node = parent.children[i]
        const new_node = new_content.children[i]

        if (old_node.tagName !== new_node.tagName) {
            parent.replaceChild(new_node, old_node)
            continue
        }

        if (!old_node.children.length && old_node.innerHTML !== new_node.innerHTML) {
            old_node.innerHTML = new_node.innerHTML
            continue
        }

        // remove attributes that are not present in the new node version.
        for (const { name } of old_node.attributes) {
            if (!new_node.hasAttribute(name))
                old_node.removeAttribute(name)
        }

        for (const { name, value } of new_node.attributes) {
            const old_value = old_node.getAttribute(name)

            if (name === "value")
                old_node.value = value
            if (old_value !== value)
                old_node.setAttribute(name, value)
        }

        update_element(old_node, new_node)
    }
}

function render() {
    const updated_dom = document.createElement("div")

    updated_dom.innerHTML = app()

    update_element(window.application, updated_dom)

    trigger_viewport()
}

function run_after_render_callbacks() {
    for (const fn of after_render_callbacks)
        fn()

    after_render_callbacks.length = 0
}

function render_loop() {
    const time_before_render = Date.now()

    render()

    run_after_render_callbacks()

    const time_after_render = Date.now()

    const render_time = time_after_render - time_before_render

    const render_after_ms = frame_ms - render_time <= 0 ? 0 : frame_ms - render_time

    setTimeout(render_loop, render_after_ms);
}

window.addEventListener("load", render_loop)
