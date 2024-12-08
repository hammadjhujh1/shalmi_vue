<template>
    <div class="min-h-screen flex flex-col bg-white text-primary">
      <header class="bg-primary text-white py-4 px-6 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
          <div class="flex items-center">
            <img src="/placeholder.svg?height=40&width=40" alt="Shalmi Online Logo" class="h-10 w-10 mr-2">
            <h1 class="text-2xl font-bold">Shalmi Online</h1>
          </div>
          <div class="flex items-center space-x-4">
            <select class="bg-white text-primary border border-white rounded px-2 py-1 text-sm">
              <option>English</option>
              <option>Urdu</option>
            </select>
            <a href="#" class="text-sm hover:underline">Help</a>
          </div>
        </div>
      </header>
      <main class="container mx-auto mt-12 px-4 flex-grow">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-primary">
          <div class="bg-primary p-4 text-white text-center">
            <h2 class="text-2xl font-semibold">Welcome Back</h2>
            <p class="text-sm mt-1">Login to your account</p>
          </div>
          <div class="p-6 space-y-6">
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {{ error }}
            </div>
            <div>
              <label for="username" class="block text-primary font-medium mb-2">Username</label>
              <input 
                v-model="username" 
                type="text" 
                id="username" 
                placeholder="Enter your username" 
                required 
                :disabled="loading"
                class="w-full px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-secondary transition"
              >
            </div>
            <div>
              <label for="password" class="block text-primary font-medium mb-2">Password</label>
              <input 
                v-model="password" 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                required 
                :disabled="loading"
                class="w-full px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-secondary transition"
              >
            </div>
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" class="form-checkbox text-secondary" v-model="remember" :disabled="loading">
                <span class="ml-2 text-sm text-primary">Remember me</span>
              </label>
              <a href="#" class="text-sm text-secondary hover:underline">Forgot password?</a>
            </div>
            <button 
              @click="login" 
              :disabled="loading || !username || !password" 
              class="w-full bg-secondary text-white py-3 rounded-lg hover:bg-primary transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 disabled:opacity-50"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
              <span v-else>Log In</span>
            </button>
            
            <!-- Add divider and sign up button -->
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600">Don't have an account?</p>
              <router-link 
                to="/signup" 
                class="mt-2 w-full inline-block bg-white text-secondary border-2 border-secondary py-3 rounded-lg hover:bg-secondary hover:text-white transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
              >
                Sign Up
              </router-link>
            </div>
          </div>
        </div>
      </main>
    </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      remember: false,
      user: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async login() {
      this.error = null;
      
      if (!this.username || !this.password) {
        this.error = 'Please enter both username and password';
        return;
      }

      this.loading = true;
      try {
        console.log('Attempting login...'); // Debug log
        const response = await fetch('http://localhost:8000/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        
        console.log('Response received:', response.status); // Debug log
        const data = await response.json();
        console.log('Response data:', data); // Debug log
        
        if (data.status === 'success') {
          // Store tokens in localStorage
          localStorage.setItem('access_token', data.tokens.access);
          localStorage.setItem('refresh_token', data.tokens.refresh);
          
          // Store user info and log role
          const userRole = data.user.role.toLowerCase(); // Convert role to lowercase
          console.log('User Role:', userRole); // Log the role
          
          this.user = {
            username: data.user.username,
            email: data.user.email,
            role: userRole // Store lowercase role
          };
          
          // Store user info in localStorage
          localStorage.setItem('user', JSON.stringify(this.user));
          
          if (this.remember) {
            localStorage.setItem('remembered_username', this.username);
          } else {
            localStorage.removeItem('remembered_username');
          }
          
          console.log('Login successful, redirecting based on role:', userRole);
          this.redirectUser();
          return userRole; // Return the role
        } else {
          this.error = data.message || 'Login failed';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = 'An error occurred during login. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    redirectUser() {
      if (!this.$router) {
        console.error('Router instance is not available');
        this.error = 'Navigation error: Router not available';
        return;
      }

      const rolePaths = {
        spb: '/single-product-buyer/',
        wsb: '/wholesale-buyer/',
        slr: '/seller/',
        eu: '/both/',
        mgr: '/manager/',
        adm: '/admin/',
      };

      const userRole = this.user.role.toLowerCase();
      const targetPath = rolePaths[userRole] || '/';
      console.log('Role:', userRole, 'Redirecting to:', targetPath);

      this.$router.push(targetPath).catch((err) => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err);
          this.error = 'Navigation failed: ' + err.message;
        }
      });
    }
  },
  mounted() {
    // Check for remembered username
    const rememberedUsername = localStorage.getItem('remembered_username');
    if (rememberedUsername) {
      this.username = rememberedUsername;
      this.remember = true;
    }
    console.log('Login component mounted'); // Debug log
  }
};
</script>

<style scoped>
.loader {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
  
 