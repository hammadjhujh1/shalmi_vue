<template>
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-8">Blog & Insights</h1>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article v-for="post in blogPosts" :key="post.id" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- <img :src="post.image" :alt="post.title" class="w-full h-48 object-cover"> -->
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
            <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
            <router-link 
              :to="{ name: 'BlogPost', params: { id: post.id }}"
              class="text-secondary hover:text-primary"
            >
              Read More
            </router-link>
          </div>
        </article>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BlogPage',
    data() {
      return {
        blogPosts: [
          {
            id: 1,
            title: 'Wholesale Market Trends 2024',
            excerpt: 'Discover the latest trends in Pakistan\'s wholesale market...',
            // mage: '@/assets/images/blog/trend-analysis.jpg'
          },
          // Add more blog posts
        ]
      }
    }
  }
  </script>