<template>
  <div class="celebration-message">
    <h2 class="text-2xl font-bold text-green-600">Order Placed Successfully!</h2>
    <p>Your tracking number is: <strong>{{ $route.params.trackingNumber }}</strong></p>
    <div class="flex justify-center gap-4 mt-4">
      <button @click="goToTrackOrder" class="bg-primary text-white px-4 py-2 rounded">
        Track Order
      </button>
      <button @click="exploreMoreProducts" class="bg-secondary text-white px-4 py-2 rounded">
        Explore More Products
      </button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    trackingNumber() {
      return this.$route.params.trackingNumber;
    }
  },
  methods: {
    goToTrackOrder() {
      this.$router.push('/track-order-user');
    },
    exploreMoreProducts() {
      this.$router.push('/both');
    }
  }
}
</script>

<style scoped>
.celebration-message {
  text-align: center;
  padding: 20px;
  background-color: #f0f4f8;
  border-radius: 8px;
}
.bg-secondary {
  background-color: #007bff;
}
.bg-primary {
  background-color: #003366;
}
</style>