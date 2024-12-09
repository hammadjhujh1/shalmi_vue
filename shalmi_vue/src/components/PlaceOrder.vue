<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Place Order</h1>
    
    <!-- Order Summary -->
    <div class="grid md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <!-- Shipping Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                v-model="shippingInfo.fullName"
                type="text" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <textarea 
                v-model="shippingInfo.address"
                rows="3" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                v-model="shippingInfo.phone"
                type="tel" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
            </div>
          </form>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Payment Method</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <input 
                type="radio" 
                id="cod" 
                value="cod" 
                v-model="paymentMethod"
                class="text-primary focus:ring-primary"
              >
              <label for="cod">Cash on Delivery</label>
            </div>
            <!-- Add more payment methods as needed -->
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Order Details</h2>
          <div v-if="cart" class="space-y-4">
            <div v-for="item in cart.items" :key="item.id" class="flex gap-4 py-2 border-b">
              <img 
                :src="item.product.image" 
                :alt="item.product.title"
                class="w-16 h-16 object-cover rounded"
              >
              <div class="flex-1">
                <h3 class="font-medium">{{ item.product.title }}</h3>
                <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                <p class="text-sm text-gray-600">Price: ${{ item.product.price }}</p>
                <p class="text-sm font-medium">Subtotal: ${{ item.subtotal }}</p>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>${{ cart.total_price }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <div class="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${{ cart.total_price }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Place Order Button -->
        <button 
          @click="placeOrder"
          class="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
          :disabled="!isFormValid"
        >
          Place Order
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cart: null,
      shippingInfo: {
        fullName: '',
        address: '',
        phone: ''
      },
      paymentMethod: 'cod'
    }
  },

  computed: {
    isFormValid() {
      return this.shippingInfo.fullName && 
             this.shippingInfo.address && 
             this.shippingInfo.phone &&
             this.paymentMethod;
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

    async placeOrder() {
      try {
        const token = localStorage.getItem('access_token');
        const orderData = {
          shipping_address: this.shippingInfo.address,
          items: [{
            product_id: this.cart.id,
            quantity: this.cart.quantity,
            variation: ''
          }]
        };

        const response = await axios.post('http://localhost:8000/api/orders/create/', orderData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Navigate to order success page with tracking number
        this.$router.push({
          name: 'order-success',
          params: { 
            orderId: response.data.order_id,
            trackingNumber: response.data.tracking_number
          }
        });

      } catch (error) {
        console.error('Error placing order:', error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert('Failed to place order. Please try again.');
        }
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
</style> 