var app = new Vue({
    el: '#app',
    data: {
        user_code: 320400377,
        client_type: 'telegram', 

        cart_id: null,
        get_cart_id_url: "http://localhost:8080/get_cart_id", 
        categories: null,
        categories_url: "http://localhost:8080/get_categories",
        subcategories: null,
        subcategories_url: "http://localhost:8080/get_subcategories",
        product_url: "http://localhost:8080/get_products",
        products: null,
        what_to_show: "categories",

        quantity: [],
        add_item_to_cart_url: "http://localhost:8080/add_item_to_cart",


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
        }
    },

    created: async function() {
        await this.get_categories();
        await this.get_cart_id()
    }
  })
