<template>
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-8">Success Stories</h1>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="testimonial in testimonials" :key="testimonial.id" 
          class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex items-center mb-4">
            <!-- <img :src="testimonial.avatar" :alt="testimonial.name"  -->
              class="w-12 h-12 rounded-full mr-4">
            <div>
              <h3 class="font-semibold">{{ testimonial.name }}</h3>
              <p class="text-sm text-gray-600">{{ testimonial.role }}</p>
            </div>
          </div>
          <p class="text-gray-700">{{ testimonial.content }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TestimonialsPage',
    data() {
      return {
        testimonials: [
          {
            id: 1,
            name: 'Ahmed Khan',
            role: 'Wholesale Buyer',
            content: 'Shalmi Online has transformed how I source products...',
            // avatar: '@/assets/images/testimonials/ahmed.jpg'
          },
          // Add more testimonials
        ]
      }
    }
  }
  </script>