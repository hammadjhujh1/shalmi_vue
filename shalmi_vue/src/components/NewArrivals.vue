<template>
  <ProductSection 
    title="NEW ARRIVALS" 
    endpoint="new-arrivals"
    @product-added-to-cart="handleProductAdded"
  />
</template>

<script>
import ProductSection from './ProductSection.vue'

export default {
  name: 'NewArrivals',
  components: {
    ProductSection
  },
  methods: {
    handleProductAdded({ product, quantity }) {
      // Handle the event, e.g., update cart count in header
      console.log(`Added ${quantity} of ${product.title} to cart`);
    }
  }
}
</script> 