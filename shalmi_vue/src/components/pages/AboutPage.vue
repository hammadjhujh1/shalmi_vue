<template>
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-8">About Shalmi Online</h1>
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
          <p class="text-gray-700 mb-6">
            Shalmi Online aims to revolutionize Pakistan's wholesale market by providing a digital platform that connects buyers and sellers nationwide.
          </p>
          <h2 class="text-2xl font-semibold mb-4">Why Choose Us</h2>
          <ul class="space-y-3">
            <li class="flex items-start">
              <CheckCircleIcon class="h-6 w-6 text-secondary mr-2 mt-1" />
              <span>Pakistan's First Digital Wholesale Marketplace</span>
            </li>
            <!-- Add more points -->
          </ul>
        </div>
        <!-- <div>
          <img src="@/assets/images/about-image.jpg" alt="About Shalmi" class="rounded-lg shadow-xl">
        </div> -->
      </div>
    </div>
  </template>
  
  <script>
  import { CheckCircleIcon } from 'vue-feather-icons'
  
  export default {
    name: 'AboutPage',
    components: {
      CheckCircleIcon
    }
  }
  </script>