var app = new Vue({
    el: '#app',
    data: {
        categories: null,
        categories_url: "http://localhost:8080/get_categories",
        subcategories: null,
        subcategories_url: "http://localhost:8080/get_subcategories",
        product_url: "http://localhost:8080/get_products",
        products: null,
        what_to_show: "categories",
    },

    methods: {
        get_categories: async function() {
            await axios.get(this.categories_url).then(response => (this.categories = response.data));
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
        },
    },

    created: function() {
        this.get_categories();
    }
  })
