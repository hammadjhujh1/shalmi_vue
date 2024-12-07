<template>
  <section class="py-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-primary">{{ title }}</h2>
        <div class="flex gap-2">
          <button 
            @click="sortProducts('default')"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            SORT BY
          </button>
          <button 
            @click="sortProducts('most_sold')"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            MOST SELL
          </button>
          <button 
            @click="sortProducts('price')"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            PRICE
          </button>
          <button 
            @click="sortProducts('newest')"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            NEWLY ADDED
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.id" class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <img :src="product.image" :alt="product.title" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="font-semibold mb-2">{{ product.title }}</h3>
            <p class="text-gray-600 mb-2">{{ product.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-primary font-bold">${{ product.price }}</span>
              <div class="flex items-center gap-2">
                <div class="flex items-center border rounded">
                  <button 
                    @click="decrementQuantity(product)"
                    class="px-2 py-1 hover:bg-gray-100"
                    :disabled="!cartQuantities[product.id]"
                  >
                    -
                  </button>
                  <span class="px-2">{{ cartQuantities[product.id] || 0 }}</span>
                  <button 
                    @click="incrementQuantity(product)"
                    class="px-2 py-1 hover:bg-gray-100"
                    :disabled="(cartQuantities[product.id] || 0) >= product.stock"
                  >
                    +
                  </button>
                </div>
                <button 
                  @click="addToCart(product)"
                  class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                  :disabled="!cartQuantities[product.id]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      products: [],
      currentSort: 'default',
      cartQuantities: {}
    }
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts(sortBy = 'default') {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/api/${this.endpoint}/?sort=${sortBy}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.products = response.data;
      } catch (error) {
        console.error(`Error fetching ${this.title}:`, error);
      }
    },
    async sortProducts(sortBy) {
      this.currentSort = sortBy;
      await this.fetchProducts(sortBy);
    },
    incrementQuantity(product) {
      if (!this.cartQuantities[product.id]) {
        this.$set(this.cartQuantities, product.id, 0);
      }
      if (this.cartQuantities[product.id] < product.stock) {
        this.cartQuantities[product.id]++;
      }
    },
    decrementQuantity(product) {
      if (this.cartQuantities[product.id] > 0) {
        this.cartQuantities[product.id]--;
      }
    },
    async addToCart(product) {
      try {
        const quantity = this.cartQuantities[product.id];
        if (!quantity) return;

        const token = localStorage.getItem('access_token');
        await axios.post('http://localhost:8000/api/cart/add/', {
          product_id: product.id,
          quantity: quantity
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Reset quantity after successful addition
        this.$set(this.cartQuantities, product.id, 0);
        
        // Emit event for parent components
        this.$emit('product-added-to-cart', {
          product,
          quantity
        });

        // Optional: Show success message
        alert('Product added to cart successfully!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart');
      }
    }
  }
}
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 