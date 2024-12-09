<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Shopping Cart</h1>
    
    <div v-if="cart && cart.items?.length" class="grid grid-cols-1 gap-6">
      <!-- Cart Items -->
      <div class="bg-white rounded-lg shadow p-6">
        <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-4 py-4 border-b">
          <img 
            :src="item.product.image" 
            :alt="item.product.title"
            class="w-24 h-24 object-cover rounded"
          >
          <div class="flex-1">
            <h3 class="font-semibold">{{ item.product.title }}</h3>
            <p class="text-gray-600">Price: ${{ item.product.price }}</p>
            <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
            <p class="text-gray-600">Subtotal: ${{ item.subtotal }}</p>
          </div>
          <button 
            @click="removeFromCart(item.id)"
            class="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        <div class="flex justify-between mb-2">
          <span>Total Items:</span>
          <span>{{ cart.total_items }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg">
          <span>Total Price:</span>
          <span>${{ cart.total_price }}</span>
        </div>
        <button 
          @click="proceedToCheckout"
          class="w-full mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <p class="text-xl text-gray-600">Your cart is empty</p>
      <button 
        @click="$router.push('/')"
        class="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
      >
        Continue Shopping
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cart: null
    }
  },
  
  mounted() {
    this.fetchCart();
  },
  
  methods: {
    async fetchCart() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/cart/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data && response.data.length > 0) {
          this.cart = response.data[0];
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    },
    
    async removeFromCart(itemId) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/cart/remove/${itemId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        await this.fetchCart();
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Failed to remove item from cart');
      }
    },
    
    proceedToCheckout() {
      // Implement checkout logic here
      alert('Proceeding to checkout!');
      this.$router.push('/place-order');
    }
  }
}
</script> 