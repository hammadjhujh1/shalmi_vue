<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4 flex-1">
            <h1 class="text-2xl font-bold text-primary">SHALMI ONLINE</h1>
            <div class="relative">
              <button
                @click="toggleDropdown"
                class="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90"
              >
                All Categories
                <span>&#9660;</span>
              </button>
              <div v-if="dropdownOpen" class="absolute bg-white text-primary border mt-2 rounded shadow">
                <ul>
                  <li class="px-4 py-2 hover:bg-gray-100">Electronics</li>
                  <li class="px-4 py-2 hover:bg-gray-100">Clothing</li>
                  <li class="px-4 py-2 hover:bg-gray-100">Home & Garden</li>
                </ul>
              </div>
            </div>
            <div class="flex-1 max-w-xl relative">
              <input
                type="search"
                placeholder="Search products..."
                class="w-full pr-10 px-4 py-2 border rounded focus:outline-none"
              />
              <button class="absolute right-1 top-1 bg-primary text-white px-2 py-2 rounded hover:bg-primary/90">
                🔍
              </button>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button class="text-primary hover:underline">LOGIN/REGISTER</button>
            <button class="bg-white border-primary border rounded-full p-2">
               🛒
            </button>
            <button 
              class="bg-white border-primary border rounded-full p-2"
              @click="toggleUserInfo"
            >
              👤
            </button>
            <button 
              class="bg-white border-primary border rounded-full p-2"
              @click="toggleUserInfo"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>
    </header>

    <div v-if="showUserInfo" class="fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
      <h3 class="text-xl font-semibold mb-4">User Information</h3>
      <p class="mb-2"><strong>Username:</strong> {{ user.username }}</p>
      <p class="mb-2"><strong>Email:</strong> {{ user.email }}</p>
      <p class="mb-2"><strong>Role:</strong> {{ user.role }}</p>
      <button @click="toggleUserInfo" class="mt-4 bg-primary text-white px-4 py-2 rounded">
        Close
      </button>
    </div>

    <!-- Featured Products -->
    <section class="bg-primary text-white py-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-4 gap-4">
          <div class="col-span-1 bg-primary/20 p-4 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">TOP Categories</h2>
            <ul class="space-y-2">
              <li>Electronics</li>
              <li>Clothing</li>
              <li>Home & Garden</li>
              <li>Sports</li>
              <li>Beauty</li>
            </ul>
          </div>
          <div class="col-span-3">
            <h2 class="text-2xl font-bold mb-4">CHECK OUT FEATURED PRODUCTS</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="aspect-[16/9] bg-secondary rounded-lg"></div>
              <div class="grid grid-rows-2 gap-4">
                <div class="bg-secondary rounded-lg"></div>
                <div class="bg-secondary rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marketing Banner -->
    <div class="bg-secondary text-white py-4 text-center">
      <p class="text-xl font-semibold">
        The Pakistan's First and Biggest Online WholeSale Market. Come Join Us
      </p>
    </div>
    <!-- New Arrivals Section -->
    <NewArrivals />
    <!-- Product Sections -->
    <TrendingProducts />
    <WholesaleProducts />
    <FeaturedProducts />
    <DiscountedProducts />
    <TopSellingProducts />

    <!-- Bottom Section -->
    <section class="py-8 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <div class="border border-primary rounded px-4 py-2">
            <p>SALE BEGINS IN</p>
          </div>
          <h2 class="text-xl font-bold text-primary">
            EXPLORE ALL PRODUCTS
          </h2>
          <div class="border border-primary rounded px-4 py-2">
            <p>{{ formattedCountdown }}</p>
          </div>
        </div>
        
        <!-- All Products Section -->
        <AllProducts :products="allProductsList" />
      </div>
    </section>
  </div>
</template>

<script>
import NewArrivals from './NewArrivals.vue'
import TrendingProducts from './TrendingProducts.vue'
import WholesaleProducts from './WholesaleProducts.vue'
import FeaturedProducts from './FeaturedProducts.vue'
import DiscountedProducts from './DiscountedProducts.vue'
import TopSellingProducts from './TopSellingProducts.vue'
import AllProducts from './AllProducts.vue'

export default {
  components: {
    NewArrivals,
    TrendingProducts,
    WholesaleProducts,
    FeaturedProducts,
    DiscountedProducts,
    TopSellingProducts,
    AllProducts,
  },
  data() {
    return {
      user: null,
      dropdownOpen: false,
      countdown: {
        hours: 2,
        minutes: 59,
        seconds: 59
      },
      countdownInterval: null,
      productSections: [
        "TOP TRENDING PRODUCTS",
        "TOP WHOLESALE PRODUCTS",
      ],
      showUserInfo: false,
      showAllProducts: false,
      allProductsList: [],
    };
  },
  computed: {
    formattedCountdown() {
      const { hours, minutes, seconds } = this.countdown;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
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
    
    // Start countdown
    this.startCountdown();
    
    // Fetch products immediately
    this.fetchAllProducts();
  },
  beforeUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleUserInfo() {
      this.showUserInfo = !this.showUserInfo;
    },
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown.seconds > 0) {
          this.countdown.seconds--;
        } else {
          if (this.countdown.minutes > 0) {
            this.countdown.minutes--;
            this.countdown.seconds = 59;
          } else {
            if (this.countdown.hours > 0) {
              this.countdown.hours--;
              this.countdown.minutes = 59;
              this.countdown.seconds = 59;
            } else {
              clearInterval(this.countdownInterval);
              // Handle countdown finished
            }
          }
        }
      }, 1000);
    },
    async fetchAllProducts() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/products/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.allProductsList = data;
      } catch (error) {
        console.error('Error:', error);
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
.bg-secondary {
  background-color: #8B0000;
}
.border-primary {
  border-color: #003366;
}
</style>