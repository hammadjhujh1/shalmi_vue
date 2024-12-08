<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-600">Welcome, {{ user?.username }}</span>
            <button 
              class="bg-white border-primary border rounded-full p-2"
              @click="toggleUserInfo"
            >
              👤
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- User Info Popup -->
    <div v-if="showUserInfo" class="fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
      <h3 class="text-xl font-semibold mb-4">Admin Information</h3>
      <p class="mb-2"><strong>Username:</strong> {{ user?.username }}</p>
      <p class="mb-2"><strong>Email:</strong> {{ user?.email }}</p>
      <p class="mb-2"><strong>Role:</strong> {{ user?.role }}</p>
      <button @click="logout" class="mt-4 bg-primary text-white px-4 py-2 rounded w-full">
        Logout
      </button>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Users Management Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">Users Management</h2>
          <p class="text-gray-600 mb-4">Manage user accounts, roles, and permissions</p>
          <button 
            @click="navigateTo('users')"
            class="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Manage Users
          </button>
        </div>

        <!-- Categories Management Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">Categories Management</h2>
          <p class="text-gray-600 mb-4">Add, edit, or remove product categories</p>
          <button 
            @click="navigateTo('categories')"
            class="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Manage Categories
          </button>
        </div>

        <!-- Products Management Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">Products Management</h2>
          <p class="text-gray-600 mb-4">Control product listings and inventory</p>
          <button 
            @click="navigateTo('products')"
            class="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Manage Products
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,
      showUserInfo: false,
    };
  },
  mounted() {
    const token = localStorage.getItem('access_token')
    if (!token) {
      this.$router.push('/')
      return
    }
    
    const userStr = localStorage.getItem('user')
    if (userStr) {
      this.user = JSON.parse(userStr)
    }
  },
  methods: {
    toggleUserInfo() {
      this.showUserInfo = !this.showUserInfo;
    },
    navigateTo(route) {
      this.$router.push(`/admin/${route}`);
    },
    async logout() {
      try {
        const token = localStorage.getItem('access_token');
        await axios.post('http://localhost:8000/logout/', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        this.$router.push('/login');
        alert('Logged out successfully!');
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  },
};
</script>

<style scoped>
.text-primary {
  color: #003366;
}
.bg-primary {
  background-color: #003366;
}
.border-primary {
  border-color: #003366;
}
</style>