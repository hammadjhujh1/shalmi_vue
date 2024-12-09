<template>
  <ProductSection 
    title="FEATURED PRODUCTS" 
    endpoint="featured"
    :show-sorting="false"
    class="bg-white text-gray-900"
  />
</template>

<script>
import ProductSection from './ProductSection.vue'

export default {
  components: {
    ProductSection
  }
}
</script>

<style scoped>
:deep(.container) {
  background-color: white;
}

:deep(h2.text-2xl) {
  color: #003366; /* text-primary */
}

:deep(.py-8) {
  background-color: #f9fafb; /* bg-gray-50 */
}
</style> 