function is_node_in_viewport(node = Element.prototype) {
    const position = node.getBoundingClientRect();

    const in_viewport = position.top < window.innerHeight && position.bottom >= 0

    return in_viewport
}

function trigger_viewport() {
    const viewport_nodes = document.querySelectorAll("[onviewport]")

    for (const node of viewport_nodes) {
        if (is_node_in_viewport(node))
            eval(node.getAttribute("onviewport"))
    }
}

window.addEventListener("scroll", trigger_viewport)
