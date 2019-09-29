var app = new Vue({
    el: '#app',
    data: {
        user_code: 320400377,
        client_type: 'web', 

        show_items: true,
        show_more: false,

        cart_id: null,
        get_cart_id_url: "http://localhost:8080/get_cart_id", 
        categories: null,
        categories_url: "http://localhost:8080/get_categories",
        subcategories: null,
        subcategories_url: "http://localhost:8080/get_subcategories",
        product_url: "http://localhost:8080/get_products",
        products: null,
        what_to_show: "categories",

        add_item_to_cart_url: "http://localhost:8080/add_item_to_cart",

        cart_items: [],
        get_cart_items_url: "http://localhost:8080/get_cart_items",

        delete_item_from_cart_url: "http://localhost:8080/delete_item_from_cart",

        user_info: null,
        order_time: null,
        get_user_info_url: "http://localhost:8080/get_user_info",
        add_user_info_url: "http://localhost:8080/add_user_info",

        add_order_url: "http://localhost:8080/add_order",

        orders: null,
        get_orders_url: "http://localhost:8080/get_orders",
    },

    methods: {
        get_categories: async function() {
            await axios.get(this.categories_url).then(response => (this.categories = response.data));
        },
        get_cart_id: async function() {
            await axios.post(this.get_cart_id_url, {'user_code': this.user_code, 'client_type': this.client_type})
            .then(response => this.cart_id = response.data["cart_id"]);
        },
        get_subcategories: async function(category_id) {
            await axios.post(this.subcategories_url, {'category_id': category_id})
            .then(response => this.subcategories = response.data);
            this.what_to_show = 'subcategories'
        },
        get_products: async function(subcategory_id) {
            await axios.post(this.product_url, {'subcategory_id': subcategory_id})
            .then(response => this.products = response.data);
            this.what_to_show = 'products'

            this.quantity = []
            for (let i in this.products) {
                this.quantity.push(1)
            }
        },
        add_item_to_cart: async function(product_id, quantity) {
            await axios.post(this.add_item_to_cart_url, {"product_id": product_id, 
                                                "quantity": quantity, 
                                                "cart_id": this.cart_id})
            .then(response => console.log(response.data));
            alert("Товар добавлен");
        },
        get_cart_items: async function(cart_id) {
            await axios.post(this.get_cart_items_url, {"cart_id": cart_id})
            .then(response => this.cart_items = response.data);
        },
        delete_item_from_cart: async function(cart_id, product_id) {
            await axios.post(this.delete_item_from_cart_url, {"cart_id": cart_id, "product_id": product_id})
            .then(response => console.log(response.data));
            location.reload(true);
        },
        click_on_buy: async function() {
            await axios.post(this.get_user_info_url, {"user_code": this.user_code, "client_type": this.client_type})
            .then(response => this.user_info = response.data)

            this.show_items = !this.show_items
        },
        buy: async function() {
            await axios.post(this.add_user_info_url, Object.assign({}, this.user_info, {'user_code': this.user_code, 'client_type': this.client_type}))
            .then(response => console.log(response.data));

            await axios.post(this.add_order_url, {"cart_id": this.cart_id, "order_time": this.order_time})
            .then(response => console.log(response.data));

            location.reload(true);
        },
        get_orders: async function() {
            await axios.post(this.get_orders_url, {'user_code': this.user_code, 'client_type': this.client_type})
            .then(response => this.orders = response.data);
        },
        show_order: async function(cart_id) {
            await this.get_cart_items(cart_id);
            this.show_more = !this.show_more;
        },
    },

    created: async function() {
        await this.get_categories();
        await this.get_cart_id()
        await this.get_cart_items(this.cart_id)
        await this.get_orders()
    }
  })
