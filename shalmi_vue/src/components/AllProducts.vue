<template>
  <div>
    <p v-if="!products.length">No products found</p>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="product in products" :key="product.id" class="border rounded-lg p-4 flex flex-col">
        <img 
          v-if="product.image" 
          :src="product.image" 
          :alt="product.title"
          class="w-32 h-32 object-cover mx-auto mb-2"
        >
        <div v-else class="w-32 h-32 bg-gray-200 mx-auto mb-2 flex items-center justify-center">
          No Image
        </div>
        <h3 class="font-semibold text-sm">{{ product.title }}</h3>
        <p class="text-gray-600 text-sm">Price: ${{ product.price }}</p>
        <p class="text-gray-500 text-sm">Stock: {{ product.stock }}</p>
        
        <!-- Add to Cart Controls -->
        <div class="mt-2 flex flex-col gap-2">
          <div class="flex items-center justify-center border rounded">
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
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 w-full"
            :disabled="!cartQuantities[product.id]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  
  data() {
    return {
      cartQuantities: {}
    }
  },

  methods: {
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
.bg-primary {
  background-color: #003366;
}

.text-primary {
  color: #003366;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>