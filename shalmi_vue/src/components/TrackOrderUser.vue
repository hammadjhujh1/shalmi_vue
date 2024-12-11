<template>
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">Track Your Order</h2>
  
      <!-- Tracking Input -->
      <div class="mb-6">
        <input 
          v-model="trackingNumber"
          type="text"
          placeholder="Enter your tracking number (e.g., TRACK-2-20241209)"
          class="w-full p-2 border rounded focus:border-primary focus:ring-primary"
          @keyup.enter="trackOrder"
        >
        <button 
          @click="trackOrder"
          class="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Track
        </button>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-4">
        Loading shipment details...
      </div>
  
      <!-- Tracking Results -->
      <div v-if="shipmentDetails" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Shipment Status</h3>
        <div class="space-y-6">
          <!-- Basic Shipment Details -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <p class="font-medium">Tracking Number:</p>
              <p>{{ shipmentDetails.tracking_number }}</p>
            </div>
            <div>
              <p class="font-medium">Status:</p>
              <p class="capitalize">{{ shipmentDetails.status }}</p>
            </div>
            <div>
              <p class="font-medium">Estimated Delivery:</p>
              <p>{{ shipmentDetails.estimated_delivery || 'Not available' }}</p>
            </div>
            <div>
              <p class="font-medium">Last Updated:</p>
              <p>{{ formatDate(shipmentDetails.last_updated) }}</p>
            </div>
          </div>
  
          <!-- Basic Order Details -->
          <div class="border-t pt-4">
            <h4 class="text-lg font-semibold mb-3">Order Details</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <p class="font-medium">Order Date:</p>
                <p>{{ formatDate(shipmentDetails.order_details.order_date) }}</p>
              </div>
              <div>
                <p class="font-medium">Shipping Address:</p>
                <p>{{ shipmentDetails.order_details.shipping_address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Error Message -->
      <div 
        v-if="error" 
        class="mt-4 p-4 bg-red-100 text-red-700 rounded"
      >
        {{ error }}
      </div>
  
      <!-- Back to Shopping -->
      <div class="mt-6 text-center">
        <button 
          @click="$router.push('/both')" 
          class="bg-secondary text-white px-6 py-2 rounded hover:bg-secondary/90"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import api from '@/config/api';
  
  export default {
    name: 'TrackOrder',
    
    data() {
      return {
        trackingNumber: '',
        shipmentDetails: null,
        error: null,
        loading: false
      }
    },
    
    created() {
      if (this.$route.params.trackingNumber) {
        this.trackingNumber = this.$route.params.trackingNumber;
        this.trackOrder();
      }
    },
  
    methods: {
      formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
      },
  
      async trackOrder() {
        if (!this.trackingNumber) {
          this.error = 'Please enter a tracking number';
          return;
        }
  
        try {
          this.loading = true;
          this.error = null;
          this.shipmentDetails = null;
          
          const token = localStorage.getItem('access_token');
          if (!token) {
            throw new Error('Please log in to track your order');
          }
  
          const response = await api.get(`/shipments/${this.trackingNumber}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          this.shipmentDetails = response.data;
          
        } catch (error) {
          console.error('Error tracking order:', error);
          if (error.response?.status === 404) {
            this.error = 'Tracking number not found';
          } else if (error.response?.data?.error) {
            this.error = error.response.data.error;
          } else if (error.message.includes('log in')) {
            this.error = error.message;
          } else {
            this.error = 'Failed to track order. Please try again.';
          }
          this.shipmentDetails = null;
        } finally {
          this.loading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .bg-primary {
    background-color: #003366;
  }
  .bg-secondary {
    background-color: #007bff;
  }
  .border-primary {
    border-color: #003366;
  }
  .text-primary {
    color: #003366;
  }
  </style>