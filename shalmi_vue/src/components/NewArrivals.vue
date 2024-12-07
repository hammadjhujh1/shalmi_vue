<template>
  <section class="py-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-primary">NEW ARRIVALS</h2>
        <div class="flex gap-2">
          <button 
            @click="sortProducts('default')"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            SORT BY
          </button>
          <button 
            @click="sortProducts('most_sold')"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            MOST SELL
          </button>
          <button 
            @click="sortProducts('price')"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            PRICE
          </button>
          <button 
            @click="sortProducts('newest')"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            NEWLY ADDED
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div v-for="product in products" :key="product.id" class="aspect-square bg-primary/20 rounded-lg p-4">
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
</template>

<script>
export default {
  name: 'NewArrivals',
  data() {
    return {
      products: [],
      currentSort: 'default'
    }
  },
  async mounted() {
    await this.fetchNewArrivals()
  },
  methods: {
    async fetchNewArrivals(sortBy = 'default') {
      try {
        const response = await fetch(`http://localhost:8000/api/new-arrivals/?sort=${sortBy}`);
        const data = await response.json();
        this.products = data;
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      }
    },
    async sortProducts(sortBy) {
      this.currentSort = sortBy;
      await this.fetchNewArrivals(sortBy);
    }
  }
}
</script>

<style scoped>
.text-primary {
  color: #003366;
}
.bg-primary {
  background-color: #003366;
}
</style> 