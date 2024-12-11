<template>
  <div class="flex-1 max-w-xl relative">
    <input
      type="search"
      v-model="searchQuery"
      placeholder="Search products..."
      class="w-full pr-12 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
      @input="handleSearch"
    />
    <button class="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition">
      🔍
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SearchBar',
  setup(props, { emit }) {
    const searchQuery = ref('')

    const handleSearch = () => {
      emit('search', searchQuery.value)
    }

    return {
      searchQuery,
      handleSearch
    }
  }
}
</script> 