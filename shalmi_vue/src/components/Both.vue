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
    <section class="py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-primary">NEW ARRIVALS</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div v-for="product in newArrivals" :key="product.id" class="aspect-square bg-primary/20 rounded-lg p-4">
            <div class="h-32 w-full bg-gray-200 rounded-lg flex items-center justify-center">
              <img v-if="product.image" :src="product.image" alt="Product Image" class="h-full w-full object-cover rounded-lg" />
              <span v-else class="text-gray-500">No Image Available</span>
            </div>
            <h3 class="mt-2 text-lg font-semibold">{{ product.title }}</h3>
            <p class="text-sm text-gray-600">{{ product.description }}</p>
            <p class="mt-1 text-sm" :class="{'text-green-500': product.quantity > 0, 'text-red-500': product.quantity === 0}">
              {{ product.quantity > 0 ? 'In Stock' : 'Out of Stock' }}
            </p>
            <p class="text-sm text-gray-600">Items Sold: {{ product.items_sold }}</p>
            <p class="mt-2 text-lg font-bold text-primary">${{ product.price }}</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Product Sections -->
    <section v-for="title in productSections" :key="title" class="py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-primary">{{ title }}</h2>
          <div class="flex gap-2">
            <button class="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90">
              SORT BY
            </button>
            <button class="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90">
              MOST SELL
            </button>
            <button class="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90">
              PRICE
            </button>
            <button class="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90">
              NEWLY ADDED
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div v-for="i in 7" :key="i" class="aspect-square bg-primary/20 rounded-lg"></div>
        </div>
      </div>
    </section>

    <!-- Bottom Section -->
    <section class="py-8 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <div class="border border-primary rounded px-4 py-2">
            <p>SALE BEGINS IN</p>
          </div>
          <button class="px-8 py-2 bg-primary text-white rounded hover:bg-primary/90">
            EXPLORE ALL PRODUCTS
          </button>
          <div class="border border-primary rounded px-4 py-2">
            <p>{{ countdown }} hours</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="aspect-[4/3] bg-secondary rounded-lg"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      dropdownOpen: false,
      countdown: "00:02:98",
      productSections: [
        " SELLING PRODUCTS TOP",
        "TOP TRENDING PRODUCTS",
        "TOP WHOLESALE PRODUCTS",
      ],
      showUserInfo: false,
      newArrivals: [],
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

    this.fetchNewArrivals();
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleUserInfo() {
      this.showUserInfo = !this.showUserInfo;
    },
    async fetchNewArrivals() {
      try {
        const response = await fetch('/api/new-arrivals');
        const data = await response.json();
        this.newArrivals = data;
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
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