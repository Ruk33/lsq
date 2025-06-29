function currency(cents = 0, decimals = 2) {
    if (!cents)
        return "Free"

    const dollars = Math.round(cents / 100).toFixed(decimals)

    return `$ ${dollars}`
}

function link({ path = "", link_props = "", content = "" }) {
    return `
        <a
            ${link_props}
            href="#${path}"
        >
            ${content}
        </a>
    `
}

function dialog({ visible = false, close_command = "" }) {
    return `
        <div style="width: 100%; height: 100%; background-color: rgb(0 0 0 / 50%); position: fixed; z-index: 1; top: 0; left: 0; overflow: hidden; align-items: center; justify-content: center; display: ${visible ? "flex" : "none"}">
            <div style="background-color: rgb(47 47 47); border: 1px solid black; box-shadow: 0 0 5px black; border-radius: 5px; display: flex; flex-direction: column; max-height: 75vh; max-width: 800px; padding: 5px; width: 100%">
                <div>
                    <button type="button" onclick="${close_command}">Close</button>
                    <h1>Testing</h1>
                    <p>Lorem ipsum dolor sit amet...</p>
                </div>
            </div>
        </div>
    `
}

function simple_button({ color = "red", button_props = "", content = "ok" }) {
    return `
        <button 
            ${button_props}
            type="button" 
            style="background-color: ${color}"
        >
            ${content}
        </button>
    `
}

function text_field({ label = "", value = "", errors = [""], input_props = "" }) {
    return `
        <div>
            <label style="display: block">
                <div style="font-weight: bold;">${label}</div>
                <input 
                    ${input_props}
                    style="width: calc(100% - 24px); padding: 10px; border: 2px solid #ececec; border-radius: 5px;"
                    value="${value}"
                />
            </label>
            <div style="color: red">
                ${errors.map(function(error) {
                    return `<div>${error}</div>`
                }).join("")}
            </div>
        </div>
    `
}
