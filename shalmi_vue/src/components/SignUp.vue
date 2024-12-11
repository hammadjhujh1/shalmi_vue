<template>
  <div class="bg-white text-primary min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-primary text-white py-4 px-6 shadow-lg">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <img src="@/assets/images/logo.png" alt="Shalmi Online Logo" class="h-10 w-40 mr-5">
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

    <!-- Main Content -->
    <main class="container mx-auto mt-12 px-4 flex-grow">
      <div class="flex justify-between items-start gap-8 mb-20">
        <!-- Image Container -->
        <div class="hidden md:block w-[600px] h-[600px]">
          <img 
            src="@/assets/images/signup-logo.png" 
            alt="Signup"
            class="w-full h-full object-cover rounded-lg"
          >
        </div>

        <!-- Sign Up Form Container -->
        <div class="w-full md:w-[500px]">
          <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-primary">
            <div class="bg-primary p-4 text-white text-center">
              <h2 class="text-2xl font-semibold">Create Your Account</h2>
              <p class="text-sm mt-1">Join Shalmi Online today</p>
            </div>
            <form @submit="handleSubmit" class="p-6 space-y-6">
              <div v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</div>
              
              <div>
                <label for="email" class="block text-primary font-medium mb-2">Email</label>
                <input v-model="email" type="email" id="email" required 
                  class="w-full px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-secondary transition">
              </div>
              
              <div>
                <label for="password" class="block text-primary font-medium mb-2">Password</label>
                <input v-model="password" type="password" id="password" required 
                  class="w-full px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-secondary transition">
              </div>
              
              <div>
                <label class="flex items-start">
                  <input v-model="agreedToTerms" type="checkbox" required class="form-checkbox text-secondary mt-1 mr-2">
                  <span class="text-sm text-primary">
                    I agree to the Terms of Use and Privacy Policy...
                  </span>
                </label>
              </div>
              
              <button type="submit" 
                class="w-full bg-primary hover:bg-white text-white hover:text-[#7F1C1D] border-2 border-transparent hover:border-[#7F1C1D] font-bold py-3 rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50">
                Create Account
              </button>
            </form>
          </div>
          
          <!-- Login Option -->
          <div class="mt-8 text-center">
            <p class="text-primary">Already have an account?</p>
            <router-link to="/login" 
              class="mt-4 inline-block bg-white hover:bg-[#7F1C1D] text-[#7F1C1D] hover:text-white border-2 border-[#7F1C1D] hover:border-transparent px-6 py-2 rounded-full hover:bg-[#7f1c1d] transition"
            >
              Log In
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-primary text-white pt-12 pb-6">
      <!-- Company Description -->
      <div class="container mx-auto px-4 mb-8">
        <h2 class="text-2xl font-bold mb-4">Shalmi Online - Pakistan's Premier Wholesale Marketplace</h2>
        <p class="text-white/80 mb-8 max-w-4xl">
          Shalmi Online, established as Pakistan's first online wholesale marketplace, connects thousands of registered buyers and sellers nationwide. Our comprehensive platform offers products across multiple categories, including textiles, electronics, home goods, and more. We prioritize reliability, convenience, and efficiency, enabling our esteemed buyers and sellers to connect and trade seamlessly.
        </p>
      </div>

      <!-- Main Footer Links -->
      <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <!-- ... footer sections (Dispatch & Delivery, Returns & Support, Business, About) ... -->
      </div>

      <!-- Community & Mobile App -->
      <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center border-t border-white/20 pt-8">
        <div class="flex items-center space-x-4 mb-4 md:mb-0">
          <a href="https://www.facebook.com/ShalmiOnline" target="_blank" rel="noopener noreferrer" class="text-white hover:text-white">
            <FacebookIcon class="h-6 w-6" />
          </a>
          <!-- ... other social media icons ... -->
        </div>
        
        <div class="flex items-center space-x-4">
          <img src="@/assets/app-play.svg" alt="Get the App" class="h-10 cursor-pointer hover:opacity-90 transition-opacity" />
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="container mx-auto px-4 mt-8 pt-6 border-t border-white/20">
        <!-- ... copyright and payment methods ... -->
      </div>
    </footer>
  </div>
</template>

<script>
import { 
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  PhoneIcon
} from 'vue-feather-icons'

export default {
  name: 'SignUp',
  components: {
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    YoutubeIcon,
    PhoneIcon
  },
  data() {
    return {
      email: '',
      password: '',
      agreedToTerms: false,
      error: null,
      isLoading: false
    }
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },

    async getCsrfToken() {
      try {
        // First make a request to get the CSRF cookie set
        await fetch('http://localhost:8000/api/get-csrf-token/', {
          method: 'GET',
          credentials: 'include',
        });
        
        // Then get the token from cookies
        const token = this.getCookie('csrftoken');
        if (!token) {
          throw new Error('No CSRF token found');
        }
        return token;
      } catch (error) {
        console.error('Error getting CSRF token:', error);
        throw error;
      }
    },

    async handleSubmit(e) {
      e.preventDefault();
      
      if (!this.agreedToTerms) {
        this.error = 'Please agree to the terms and conditions';
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const csrfToken = await this.getCsrfToken();
        console.log('CSRF Token:', csrfToken); // For debugging
        
        const response = await fetch('http://localhost:8000/api/signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log('Signup successful:', data);
          this.$router.push('/login');
        } else {
          this.error = data.message || 'Signup failed. Please try again.';
        }
      } catch (error) {
        console.error('Error during signup:', error);
        this.error = 'An error occurred. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}
</style>