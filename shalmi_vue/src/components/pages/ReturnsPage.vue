<template>
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-8">Returns & Refunds</h1>
      <div class="max-w-3xl mx-auto">
        <div class="space-y-8">
          <section>
            <h2 class="text-2xl font-semibold mb-4">Return Policy</h2>
            <p class="text-gray-700 mb-4">
              We accept returns within 7 days of delivery for most items...
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Item must be unused and in original packaging</li>
              <!-- Add more policy points -->
            </ul>
          </section>
          
          <section>
            <h2 class="text-2xl font-semibold mb-4">How to Return</h2>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">1</div>
                <div>
                  <h3 class="font-semibold mb-2">Initiate Return Request</h3>
                  <p class="text-gray-700">Log into your account and select the order...</p>
                </div>
              </div>
              <!-- Add more steps -->
            </div>
          </section>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReturnsPage'
  }
  </script>