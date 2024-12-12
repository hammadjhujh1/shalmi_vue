<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Users Management</h2>
      <button 
        @click="showAddUserModal = true"
        class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
      >
        Add New User
      </button>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left">Username</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Role</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b">
            <td class="px-4 py-2">{{ user.username }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ getRoleName(user.role) }}</td>
            <td class="px-4 py-2">
              <button 
                @click="editUser(user)"
                class="text-blue-600 hover:text-blue-800 mr-2"
              >
                Edit
              </button>
              <button 
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">{{ editingUser ? 'Edit User' : 'Add New User' }}</h3>
        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label class="block mb-1">Username</label>
              <input 
                v-model="userForm.username"
                type="text"
                class="w-full px-3 py-2 border rounded"
                required
              >
            </div>
            <div>
              <label class="block mb-1">Email</label>
              <input 
                v-model="userForm.email"
                type="email"
                class="w-full px-3 py-2 border rounded"
                required
              >
            </div>
            <div>
              <label class="block mb-1">Role</label>
              <select 
                v-model="userForm.role"
                class="w-full px-3 py-2 border rounded"
                required
              >
                <option value="EU">End User</option>
                <option value="MGR">Manager</option>
                <option value="ADM">Admin</option>
              </select>
            </div>
            <div v-if="!editingUser">
              <label class="block mb-1">Password</label>
              <input 
                v-model="userForm.password"
                type="password"
                class="w-full px-3 py-2 border rounded"
                :required="!editingUser"
              >
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button 
              type="button"
              @click="showAddUserModal = false"
              class="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-primary text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import api from '@/config/api';

export default {
  data() {
    return {
      users: [],
      showAddUserModal: false,
      editingUser: null,
      userForm: {
        username: '',
        email: '',
        password: '',
        role: 'EU',
        is_active: true
      }
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!accessToken || !refreshToken) {
          this.$router.push('/login');
          return;
        }

        const response = await api.get('/api/users/');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.message === 'No refresh token available') {
          this.$router.push('/login');
        } else {
          alert(error.response?.data?.detail || 'Failed to fetch users');
        }
      }
    },
    editUser(user) {
      this.editingUser = user;
      this.userForm = { 
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      };
      this.showAddUserModal = true;
    },
    async saveUser() {
      try {
        const token = localStorage.getItem('access_token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const userData = this.editingUser ? 
          { ...this.userForm, password: undefined } : 
          this.userForm;

        console.log('Sending user data:', userData);

        if (this.editingUser) {
          await api.put(`/api/users/${this.editingUser.id}/`, userData, config);
        } else {
          await api.post('/api/users/', userData, config);
        }
        await this.fetchUsers();
        this.showAddUserModal = false;
        this.resetForm();
      } catch (error) {
        console.error('Error saving user:', error);
        console.error('Response data:', error.response?.data);
        alert(error.response?.data?.detail || 'Failed to save user');
      }
    },
    async deleteUser(userId) {
      if (confirm('Are you sure you want to deactivate this user?')) {
        try {
          const token = localStorage.getItem('access_token');
          await api.delete(`/api/users/${userId}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          await this.fetchUsers();
        } catch (error) {
          console.error('Error deactivating user:', error);
          console.error('Full error response:', error.response);
          alert(error.response?.data?.detail || 'Failed to deactivate user');
        }
      }
    },
    resetForm() {
      this.userForm = {
        username: '',
        email: '',
        password: '',
        role: 'EU',
        is_active: true
      };
      this.editingUser = null;
    },
    getRoleName(role) {
      const roles = {
        'EU': 'End User',
        'MGR': 'Manager',
        'ADM': 'Admin'
      };
      return roles[role] || role;
    }
  },
  mounted() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken && refreshToken) {
      this.fetchUsers();
    } else {
      this.$router.push('/login');
    }
  }
}
</script> 