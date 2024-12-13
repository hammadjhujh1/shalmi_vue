<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md relative">
      <button 
        @click="closeModal" 
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      
      <h2 class="text-xl font-bold mb-4">Generate API Token</h2>
      
      <div class="mb-4">
        <label class="block mb-1">Username</label>
        <input 
          v-model="credentials.username"
          type="text"
          class="w-full px-3 py-2 border rounded"
          required
        >
      </div>
      
      <div class="mb-4">
        <label class="block mb-1">Password</label>
        <input 
          v-model="credentials.password"
          type="password"
          class="w-full px-3 py-2 border rounded"
          required
        >
      </div>

      <div v-if="token" class="mb-4">
        <label class="block mb-1">Your Token:</label>
        <div class="relative">
          <textarea 
            :value="tokenFormat"
            readonly
            class="w-full px-3 py-2 border rounded bg-gray-50"
            rows="4"
          ></textarea>
          <button 
            @click="copyToken"
            class="absolute right-2 top-2 text-primary hover:text-primary/80"
          >
            Copy
          </button>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <button 
          @click="closeModal"
          class="px-4 py-2 border rounded"
        >
          Close
        </button>
        <button 
          @click="generateToken"
          class="px-4 py-2 bg-primary text-white rounded"
          :disabled="!credentials.username || !credentials.password"
        >
          Generate Token
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/config/api';

export default {
  name: 'TokenGenerator',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      token: null
    };
  },
  computed: {
    tokenFormat() {
      if (!this.token) return '';
      return `// Add this to your headers:\n{\n  'Authorization': 'Bearer ${this.token}'\n}`;
    }
  },
  methods: {
    async generateToken() {
      console.log('Generating token...');
      try {
        const response = await api.post('/api/token/', this.credentials);
        console.log('Token response:', response);
        
        if (response.data && response.data.access) {
          this.token = response.data.access;
          console.log('Token generated successfully');
        } else {
          console.error('Invalid response format:', response.data);
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error generating token:', error);
        console.error('Error response:', error.response?.data);
        alert(error.response?.data?.detail || 'Failed to generate token. Please check your credentials.');
      }
    },
    copyToken() {
      console.log('Copying token to clipboard');
      navigator.clipboard.writeText(this.tokenFormat)
        .then(() => {
          console.log('Token copied successfully');
          alert('Token copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy token:', err);
          alert('Failed to copy token to clipboard');
        });
    },
    closeModal() {
      console.log('Closing token generator modal');
      this.$emit('update:modelValue', false);
      this.$emit('close');
      this.credentials = { username: '', password: '' };
      this.token = null;
    }
  },
  mounted() {
    console.log('TokenGenerator component mounted');
  }
};
</script>
  