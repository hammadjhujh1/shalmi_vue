<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-primary">Orders Management</h1>
      <button 
        @click="showTrackingModal = true"
        class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
      >
        Track Order
      </button>
    </div>
    
    <!-- Track Order Modal -->
    <div v-if="showTrackingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">Track Order</h2>
        <input 
          v-model="trackingNumber"
          placeholder="Enter tracking number"
          class="w-full p-2 border rounded mb-4"
        />
        <div class="flex justify-end gap-2">
          <button 
            @click="showTrackingModal = false"
            class="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button 
            @click="trackOrder"
            class="px-4 py-2 bg-primary text-white rounded"
          >
            Track
          </button>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping Address</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking Number</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id">
            <td class="px-6 py-4">{{ order.id }}</td>
            <td class="px-6 py-4">{{ order.user }}</td>
            <td class="px-6 py-4">${{ order.total_amount }}</td>
            <td class="px-6 py-4">{{ order.shipping_address }}</td>
            <td class="px-6 py-4">{{ order.shipment?.tracking_number || 'N/A' }}</td>
            <td class="px-6 py-4">
              <select 
                v-model="order.status"
                @change="updateOrderStatus(order.id, order.status)"
                class="rounded border-gray-300"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            <td class="px-6 py-4">
              <button 
                @click="deleteOrder(order.id)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import api from '@/config/api';

export default {
  data() {
    return {
      orders: [],
      showTrackingModal: false,
      trackingNumber: '',
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/orders/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.orders = response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    async updateOrderStatus(orderId, newStatus) {
      try {
        const token = localStorage.getItem('access_token');
        await api.patch(`/orders/${orderId}/`, 
          { status: newStatus },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        alert('Order status updated successfully!');
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
      }
    },
    async deleteOrder(orderId) {
      if (!confirm('Are you sure you want to delete this order?')) return;
      
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/orders/${orderId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.orders = this.orders.filter(order => order.id !== orderId);
        alert('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    },
    async trackOrder() {
      if (!this.trackingNumber) {
        alert('Please enter a tracking number');
        return;
      }
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/api/shipments/${this.trackingNumber}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Handle the tracking response
        alert(`Order Status: ${response.data.status}`);
        this.showTrackingModal = false;
        this.trackingNumber = '';
      } catch (error) {
        console.error('Error tracking order:', error);
        alert('Failed to track order');
      }
    }
  }
};
</script>

<style scoped>
.text-primary {
  color: #003366;
}
.bg-primary {
  background-color: #003366;
}
</style> 