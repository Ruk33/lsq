function checkout_state() {
    return {
        initialize_status: request_idle,

        email_address: "",
        card_number: "",
        card_expiry_mm_yy: "",
        card_cvc: "",
        card_holder: "",
        billing_address: "",
        billing_country: "",
        billing_zip: "",

        errors: {
            email_address: [""],
            card_number: [""],
            card_expiry_mm_yy: [""],
            card_cvc: [""],
            card_holder: [""],
            billing_address: [""],
            billing_country: [""],
            billing_zip: [""],
        },

        items: [{
            id: 0,
            image: "",
            name: "",
            quantity: 0,
            price: 0,
            stock: 0,
        }],

        items_status: request_idle,

        promotions: [{
            id: 0,
            name: "",
            triggers: [{
                id: 0,
                quantity: 0
            }],
            actions: [{
                ids: [0],
                discount_amount: 0,
                is_fixed_discount: false,
                discounts_each_unit: false,
            }],
        }],

        promotions_status: request_idle,

        shipping_options: [{
            id: 0,
            name: "",
            price: 0,
            delivery_time: "",
        }],

        shipping_options_status: request_idle,

        shipping_option: -1,

        total: 0,

        submitting: false,
    }
}

const checkout_commands = [
    function checkout_init() {
        state.checkout = checkout_state()

        state.page = "checkout"

        window.command("checkout_request_items")

        window.command("checkout_request_promotions")
    },

    async function checkout_request_items() {
        state.checkout.items_status = request_pending

        await sleep_for(4000)

        const items = [
            {
                id: 1,
                name: "T-Shirt",
                price: 200,
                quantity: 1,
                stock: 2,
                image: "public/tshirt-1.png",
            },
            {
                id: 2,
                name: "Pullover + Hat",
                price: 400,
                quantity: 2,
                stock: 10,
                image: "public/pullover-hat-2.png",
            }
        ]

        window.command("checkout_set_items", items)
    },

    function checkout_set_items(items = checkout_state().items) {
        if (request_was_aborted(state.checkout.items_status))
            return

        state.checkout.items_status = request_succeeded

        state.checkout.items = items
    },

    async function checkout_request_promotions() {
        state.checkout.promotions_status = request_pending

        await sleep_for(2000)

        const promotions = [
            {
                id: 100,
                name: "10% off!",
                triggers: [],
                actions: [{
                    ids: [],
                    discount_amount: 10,
                    is_fixed_discount: false,
                    discounts_each_unit: false
                }]
            }
        ]

        window.command("checkout_set_promotions", promotions)

        // we can't use fetch in localhost because cors, yay!
        //
        // fetch("seed/promotions.json")
        //     .then(function(response) {
        //         return response.json()
        //     })
        //     .then(function(promotions) {
        //         window.command("checkout_set_promotions", promotions)
        //     })
        //     .catch(function() {
        //         window.command("checkout_set_promotions", [])
        //     })
    },

    function checkout_set_promotions(promotions = checkout_state().promotions) {
        if (request_was_aborted(state.checkout.promotions_status))
            return

        state.checkout.promotions_status = request_succeeded

        state.checkout.promotions = promotions
    },

    async function checkout_request_shipping_options() {
        state.checkout.shipping_options_status = request_pending

        state.checkout.shipping_options = checkout_state().shipping_options

        state.checkout.shipping_option = checkout_state().shipping_option

        await sleep_for(4000)

        const shipping_options = [
            {
                id: 3,
                name: "Fedex",
                price: 200,
                delivery_time: "2 days",
            },
            {
                id: 4,
                name: "DHL Delivery",
                price: 0,
                delivery_time: "10 days",
            },
        ]

        window.command("checkout_set_shipping_options", shipping_options)
    },

    function checkout_set_shipping_options(shipping_options = checkout_state().shipping_options) {
        if (request_was_aborted(state.checkout.shipping_options_status))
            return

        state.checkout.shipping_options_status = request_succeeded

        state.checkout.shipping_options = shipping_options
    },

    function checkout_set_email_address(email = "") {
        state.checkout.email_address = email

        state.checkout.errors.email_address = checkout_validate_email_address(email)
    },

    function checkout_set_card_number(card_number = "") {
        state.checkout.card_number = card_number

        state.checkout.errors.card_number = checkout_validate_card_number(card_number)
    },

    function checkout_set_card_expiry_mm_yy({ card_expiry_mm_yy = "", dom = { setSelectionRange: function(start = 0, end = 0) {} }, cursor_position = -1 }) {
        // very basic input masking.
        // can be better, this is just a demo.

        if (cursor_position !== -1) {
            dom.setSelectionRange(cursor_position, cursor_position)
            return
        }
        
        const aggregate_slash = /^\d{2}$/.test(card_expiry_mm_yy)

        if (aggregate_slash)
            card_expiry_mm_yy = `${card_expiry_mm_yy}/`

        state.checkout.card_expiry_mm_yy = card_expiry_mm_yy

        state.checkout.errors.card_expiry_mm_yy = checkout_validate_card_expiry_mm_yy(card_expiry_mm_yy)

        if (aggregate_slash)
            window.queue_command("checkout_set_card_expiry_mm_yy", { card_expiry_mm_yy, dom, cursor_position: card_expiry_mm_yy.length, })
    },

    function checkout_set_card_cvc(card_cvc = "") {
        state.checkout.card_cvc = card_cvc

        state.checkout.errors.card_cvc = checkout_validate_card_cvc(card_cvc)
    },

    function checkout_set_card_holder(card_holder = "") {
        state.checkout.card_holder = card_holder

        state.checkout.errors.card_holder = checkout_validate_card_holder(card_holder)
    },

    function checkout_set_billing_address(billing_address = "") {
        state.checkout.billing_address = billing_address

        state.checkout.errors.billing_address = checkout_validate_billing_address(billing_address)

        // window.command("checkout_request_shipping_options")
        checkout_debounced_request_shipping_options()
    },

    function checkout_set_billing_country(billing_country = "") {
        state.checkout.billing_country = billing_country

        state.checkout.errors.billing_country = checkout_validate_billing_country(billing_country)

        // window.command("checkout_request_shipping_options")
        checkout_debounced_request_shipping_options()
    },

    function checkout_set_billing_zip(billing_zip = "") {
        state.checkout.billing_zip = billing_zip

        state.checkout.errors.billing_zip = checkout_validate_billing_zip(billing_zip)

        // window.command("checkout_request_shipping_options")
        checkout_debounced_request_shipping_options()
    },

    function checkout_set_shipping(shipping_option = 0) {
        const valid_shipping = state.checkout.shipping_options.find(function(valid_shipping_option) {
            return valid_shipping_option.id === shipping_option
        })

        if (!valid_shipping)
            shipping_option = -1

        state.checkout.shipping_option = shipping_option
    },
]

const checkout_debounced_request_shipping_options = debounce(function() {
    window.command("checkout_request_shipping_options")
})

function checkout_validate_email_address(email = "") {
    return [
        valid_email(email) ? "" : "Invalid email"
    ].filter(Boolean)
}

function checkout_validate_card_number(card_number = "") {
    return [
        valid_presence(card_number) ? "" : "The card number is required"
    ].filter(Boolean)
}

function checkout_validate_card_expiry_mm_yy(card_expiry_mm_yy = "") {
    const valid_format = /^\d{2}\/\d{2}$/.test(card_expiry_mm_yy)

    return [
        valid_format ? "" : "The card expiry is incorrect. The format must be MM/YY"
    ].filter(Boolean)
}

function checkout_validate_card_cvc(card_cvc = "") {
    const valid_format = /^\d{3}$/.test(card_cvc)

    return [
        valid_presence(card_cvc) ? "" : "Card CVC is required",
        valid_format ? "" : "Card CVC must be 3 numbers"
    ].filter(Boolean)
}

function checkout_validate_card_holder(card_holder = "") {
    return [
        valid_presence(card_holder) ? "" : "Card holder is required",
    ].filter(Boolean)
}

function checkout_validate_billing_address(billing_address = "") {
    return [
        valid_presence(billing_address) ? "" : "Billing address is required",
    ].filter(Boolean)
}

function checkout_validate_billing_country(billing_country = "") {
    return [
        valid_presence(billing_country) ? "" : "Billing country is required",
    ].filter(Boolean)
}

function checkout_validate_billing_zip(billing_zip = "") {
    return [
        valid_presence(billing_zip) ? "" : "Billing zip is required",
    ].filter(Boolean)
}

function checkout_top_menu() {
    return `
        <div style="padding: 10px; border-bottom: 2px solid #f4f4f4;">
            <div class="container">
                <a href="#">LSQ</a>
                <a href="app.html">Go</a>
                ${link({ path: "app.html", content: "Hello!" })}
                <h1>Order review</h1>
            </div>
        </div>
    `
}

function checkout_item({ name = "", image = "", price = 0, quantity = 0, }) {
    return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 2px solid #ececec; border-radius: 5px;">
            <img style="width: 48px; height: 48px; background-color: gray; object-fit: cover;" src="${image}" />
            <div style="flex: 1; padding: 10px;">
                <div style="font-weight: bold;">${name}</div>
                <div style="font-size: 14px;">Price: $${price} | Qty: ${quantity}</div>
            </div>
            <div style="font-size: 24px;">$${quantity * price}</div>
        </div>
    `
}

function checkout_shipping_option({ id = 0, name = "", price = 0, delivery_time = "", }) {
    return `
        <label style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 2px solid #ececec; border-radius: 5px;">
            <div>
                <div style="font-weight: bold;">${name}</div>
                <div>${delivery_time}</div>
            </div>
            <div style="display: flex; gap: 10px;">
                <div>${currency(price)}</div>
                <input
                    type="radio"
                    name="shipping_option"
                    oninput="window.command('checkout_set_shipping', ${id})"
                    ${state.checkout.shipping_option === id ? "checked" : ""}
                />
            </div>
        </label>
    `
}

function checkout_summary_order() {
    return `
        <div style="background-color: white; width: 100%;">
            <div style="justify-self: end; width: 480px; padding: 50px;">
                <h2>Summary order</h2>

                <p>Check your items and select your shipping.</p>

                <div style="padding: 20px; border: 2px solid #ececec; border-radius: 5px; display: grid; gap: 10px;">
                    ${state.checkout.items_status === request_succeeded ? state.checkout.items.map(function(item) {
                        return checkout_item({
                            name: item.name,
                            image: item.image,
                            price: item.price,
                            quantity: item.quantity,
                        })
                    }).join("") : ""}

                    ${state.checkout.items_status === request_pending ? "Loading items..." : ""}
                </div>

                <h4>Available shipping options</h4>

                <div style="padding: 20px; border: 2px solid #ececec; border-radius: 5px;">
                    <div style="display: ${state.checkout.shipping_options_status === request_succeeded ? "grid" : "none"}; gap: 10px;">
                        ${state.checkout.shipping_options.map(function(shipping_option) {
                            return checkout_shipping_option({
                                id: shipping_option.id,
                                name: shipping_option.name,
                                price: shipping_option.price,
                                delivery_time: shipping_option.delivery_time,
                            })
                        }).join("")}
                    </div>

                    <div style="display: ${state.checkout.shipping_options_status === request_pending ? "block" : "none"}">Loading shipping options...</div>

                    <div style="display: ${state.checkout.shipping_options_status === request_idle ? "block" : "none"}">
                        Update your billing address to see the shipping options.
                    </div>
                </div>
            </div>
        </div>
    `
}

function checkout_form() {
    return `
        <div style="background-color: #f9fafc; width: 100%;">
            <form
                style="width: 480px; padding: 50px; display: grid; gap: 20px;"
                onsubmit="event.preventDefault(); window.command('checkout_submit');"
            >
                <h2>Shipping & payment details</h2>
            
                <p>Complete your purchase by providing your shipping address and payment details.</p>

                ${text_field({
                    label: "Email address",
                    value: state.checkout.email_address,
                    errors: state.checkout.errors.email_address,
                    input_props: `placeholder="john@doe.com" oninput="window.command('checkout_set_email_address', event.target.value)"`
                })}

                <label style="display: block;">
                    <div style="font-weight: bold;">Card details</div>

                    <div style="display: flex; align-items: center; justify-content: center; border: 2px solid #ececec; border-radius: 5px; padding: 10px; background-color: white;">
                        <input 
                            type="text" 
                            oninput="window.command('checkout_set_card_number', event.target.value)" 
                            value="${state.checkout.card_number}"
                            placeholder="Card details" 
                            style="padding: 0; border: 0; width: 100%; outline: none;"
                        />
                        <input
                            type="text"
                            oninput="window.command('checkout_set_card_expiry_mm_yy', { card_expiry_mm_yy: event.target.value, dom: event.target, })"
                            value="${state.checkout.card_expiry_mm_yy}"
                            placeholder="MM/YY"
                            style="padding: 0; border: 0; width: 50%; outline: none;"
                        />
                        <input
                            type="text"
                            oninput="window.command('checkout_set_card_cvc', event.target.value)"
                            value="${state.checkout.card_cvc}"
                            placeholder="CVC" style="padding: 0; border: 0; width: 50%; outline: none;"
                        />
                    </div>

                    <div style="color: red">
                        ${state.checkout.errors.card_number.map(function(error) {
                            return `<div>${error}</div>`
                        }).join("")}

                        ${state.checkout.errors.card_expiry_mm_yy.map(function(error) {
                            return `<div>${error}</div>`
                        }).join("")}

                        ${state.checkout.errors.card_cvc.map(function(error) {
                            return `<div>${error}</div>`
                        }).join("")}
                    </div>
                </label>

                ${text_field({
                    label: "Card holder",
                    value: state.checkout.card_holder,
                    errors: state.checkout.errors.card_holder,
                    input_props: `placeholder="John Doe" oninput="window.command('checkout_set_card_holder', event.target.value)"`
                })}

                <label style="display: block;">
                    <div style="font-weight: bold;">Billing address</div>

                    <div style="border: 2px solid #ececec; border-radius: 5px; background-color: white;">
                        <input 
                            type="text"
                            oninput="window.command('checkout_set_billing_address', event.target.value)"
                            value="${state.checkout.billing_address}"
                            placeholder="Address"
                            style="padding: 10px; border: 0; width: calc(100% - 20px); outline: none;" 
                        />

                        <div style="display: flex; align-items: center; justify-content: center; border-top: 2px solid #ececec; background-color: white;">
                            <input
                                type="text"
                                oninput="window.command('checkout_set_billing_country', event.target.value)"
                                value="${state.checkout.billing_country}"
                                placeholder="California"
                                style="padding: 0; border: 0; border-right: 2px solid #ececec; padding: 10px; width: 50%; outline: none;"
                            />
                            <input
                                type="text"
                                oninput="window.command('checkout_set_billing_zip', event.target.value)"
                                value="${state.checkout.billing_zip}"
                                placeholder="92648"
                                style="padding: 0; border: 0; padding: 10px; width: 50%; outline: none;"
                            />
                        </div>
                    </div>

                    <div style="color: red">
                        ${state.checkout.errors.billing_address.map(function(error) {
                            return `<div>${error}</div>`
                        }).join("")}

                        ${state.checkout.errors.billing_country.map(function(error) {
                            return `<div>${error}</div>`
                        }).join("")}

                        ${state.checkout.errors.billing_zip.map(function(error) {
                            return `<div>${error}</div>`
                        }).join("")}
                    </div>
                </label>

                <div>
                    <div style="display: flex;">
                        <div style="width: 100%;">Subtotal:</div>
                        <div>$24.04</div>
                    </div>

                    <div style="display: flex;">
                        <div style="width: 100%;">VAT (20%):</div>
                        <div>$24.04</div>
                    </div>

                    <div style="display: flex; font-weight: bold;">
                        <div style="width: 100%; font-weight: bold;">Total:</div>
                        <div>$24.04</div>
                    </div>
                </div>

                <button
                    type="submit"
                    ${state.checkout.submitting ? "disabled" : ""}
                    style="border-radius: 5px; padding: 20px; width: 100%;"
                >
                    Pay
                </button>
            </form>
        </div>
    `
}

function checkout_page() {
    return `
        <div>
            ${checkout_top_menu()}

            <div style="display: flex;">
                ${checkout_summary_order()}
                ${checkout_form()}
            </div>
        </div>
    `
}