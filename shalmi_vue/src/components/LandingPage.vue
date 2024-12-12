<template>
    <div class="min-h-screen flex flex-col bg-white text-primary">
      <header class="bg-primary text-white py-4 px-6 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
          <div class="flex items-center">
            <img src="@/assets/images/logo.png" alt="Shalmi Online Logo" class="h-10 w-10 mr-2">
            <div class="text-2xl font-bold">Shalmi Online</div>
          </div>
          <nav class="flex items-center space-x-6">
            <a href="/about" class="text-sm hover:underline">About</a>
            <a href="/contact" class="text-sm hover:underline">Contact</a>
            <a href="/returns" class="text-sm hover:underline">Returns</a>
            <a href="/blog" class="text-sm hover:underline">Blog</a>
            <a href="/testimonials" class="text-sm hover:underline">Testimonials</a>
            <a href="/token-generator" class="text-sm hover:underline">Generate API Token</a>
            <select class="bg-white text-primary border border-white rounded px-2 py-1 text-sm">
              <option>English</option>
              <option>Urdu</option>
            </select>
            <a href="#" class="text-sm hover:underline">Help</a>
          </nav>
        </div>
      </header>
  
      <main class="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 mb-8 md:mb-0">
          <h1 class="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome to Shalmi Online
          </h1>
          <p class="text-xl text-primary mb-6">
            Pakistan's First & Biggest Online Wholesale Market
          </p>
          <ul class="space-y-2 mb-8">
            <li class="flex items-center">
              <CheckCircleIcon class="h-6 w-6 text-[#7f1c1d] mr-2" />
              <span>Wide range of wholesale products</span>
            </li>
            <li class="flex items-center">
              <CheckCircleIcon class="h-6 w-6 text-[#7f1c1d] mr-2" />
              <span>Competitive prices for retailers</span>
            </li>
            <li class="flex items-center">
              <CheckCircleIcon class="h-6 w-6 text-[#7f1c1d] mr-2" />
              <span>Seamless online ordering process</span>
            </li>
          </ul>
        </div>
        <div class="md:w-1/2 flex flex-col items-center md:items-end space-y-4">
          <picture>
            <img
              :src="heroImage"
              alt="Shalmi Online Marketplace"
              class="rounded-lg shadow-xl mb-6 transition-transform hover:scale-105 duration-300 w-full max-w-lg"
              loading="lazy"
            />
          </picture>
          <button
            @click="login"
            class="bg-primary hover:bg-white text-white hover:text-red-900 border-2 border-transparent hover:border-red-900 font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Login to Proceed
          </button>
          <button
            @click="continueWithoutLogin"
            class="bg-white hover:bg-[#7f1c1d] text-red-900 hover:text-white border-2 border-red-900 hover:border-transparent font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Continue Without Login
          </button>
          <button
            @click="goToAdmin"
            class="bg-gray-800 hover:bg-white text-white hover:text-gray-800 border-2 border-transparent hover:border-gray-800 font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Admin Panel
          </button>
        </div>
      </main>
  
      <footer class="bg-primary text-white pt-12 pb-6">
    <!-- Company Description -->
    <div class="container mx-auto px-4 mb-8">
      <h2 class="text-2xl font-bold mb-4">Shalmi Online - Pakistan's Premier Wholesale Marketplace</h2>
      <p class="text-white/80 mb-8 max-w-4xl">
        Shalmi Online, established as Pakistan's first online wholesale marketplace, connects thousands of registered buyers and sellers nationwide. Our comprehensive platform offers products across multiple categories, including textiles, electronics, home goods, and more. We prioritize reliability, convenience, and efficiency, enabling our esteemed buyers and sellers to connect and trade seamlessly.
      </p>
    </div>
  
    <!-- Updated Footer Links -->
    <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <!-- Customer Support -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Customer Support</h3>
        <ul class="space-y-2">
          <li><a href="/faq" class="text-white hover:text-white">FAQ</a></li>
          <li><a href="/support" class="text-white hover:text-white">Support Center</a></li>
          <li><a href="/shipping" class="text-white hover:text-white">Shipping Information</a></li>
        </ul>
      </div>
  
      <!-- Legal -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Legal</h3>
        <ul class="space-y-2">
          <li><a href="/privacy" class="text-white hover:text-white">Privacy Policy</a></li>
          <li><a href="/terms" class="text-white hover:text-white">Terms & Conditions</a></li>
          <li><a href="/guidelines" class="text-white hover:text-white">Seller Guidelines</a></li>
        </ul>
      </div>
  
      <!-- Business -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Business</h3>
        <ul class="space-y-2">
          <li><a href="#" class="text-white hover:text-white">Seller Center</a></li>
          <li><a href="#" class="text-white hover:text-white">Wholesale Info</a></li>
          <li><a href="#" class="text-white hover:text-white">Partnership</a></li>
        </ul>
      </div>
  
      <!-- About -->
      <div>
        <h3 class="text-lg font-semibold mb-4">About</h3>
        <ul class="space-y-2">
          <li><a href="#" class="text-white hover:text-white">About Us</a></li>
          <li><a href="#" class="text-white hover:text-white">Privacy Policy</a></li>
          <li><a href="#" class="text-white hover:text-white">Terms of Use</a></li>
        </ul>
      </div>
    </div>
  
    <!-- Community & Mobile App -->
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center border-t border-white/20 pt-8">
      <div class="flex items-center space-x-4 mb-4 md:mb-0">
        <a href="https://www.facebook.com/ShalmiOnline" target="_blank" rel="noopener noreferrer" class="text-white hover:text-white">
          <FacebookIcon class="h-6 w-6" />
        </a>
        <a href="https://www.instagram.com/shalmionline" target="_blank" rel="noopener noreferrer" class="text-white hover:text-white">
          <InstagramIcon class="h-6 w-6" />
        </a>
        <a href="https://twitter.com/ShalmiOnline" target="_blank" rel="noopener noreferrer" class="text-white hover:text-white">
          <TwitterIcon class="h-6 w-6" />
        </a>
        <a href="https://www.youtube.com/@ShalmiOnline" target="_blank" rel="noopener noreferrer" class="text-white hover:text-white">
          <YoutubeIcon class="h-6 w-6" />
        </a>
        <a href="https://wa.me/+923XXXXXXXXX" target="_blank" rel="noopener noreferrer" class="text-white hover:text-white">
          <PhoneIcon class="h-6 w-6" />
        </a>
      </div>
      
      <div class="flex items-center space-x-4">
        <img src="@/assets/app-play.svg" alt="Get the App" class="h-10 cursor-pointer hover:opacity-90 transition-opacity" />
      </div>
    </div>
  
    <!-- Bottom Footer -->
    <div class="container mx-auto px-4 mt-8 pt-6 border-t border-white/20">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-white/80 text-sm mb-4 md:mb-0">
          © 2023 Shalmi Online. All rights reserved.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <img src="@/assets/visa-card.svg" alt="Visa" class="h-8" />
          <img src="@/assets/master-card.svg" alt="Mastercard" class="h-8" />
          <img src="@/assets/paypal-card.svg" alt="PayPal" class="h-8" />
        </div>
      </div>
    </div>
  </footer>
    </div>
  </template>
  
  <script>
  import { 
    CheckCircleIcon,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    YoutubeIcon,
    PhoneIcon
  } from 'vue-feather-icons'
  import heroImage from '../assets/images/hero-banner.png'
  
  export default {
    name: 'LandingPage',
    components: {
      CheckCircleIcon,
      FacebookIcon,
      InstagramIcon,
      TwitterIcon,
      YoutubeIcon,
      PhoneIcon,
      TokenGenerator
    },
    data() {
      return {
        heroImage
      }
    },
    methods: {
      login() {
        this.$router.push('/login')
      },
      continueWithoutLogin() {
        // Implement continue without login functionality
        console.log('Continue without login clicked')
      },
      goToAdmin() {
        this.$router.push('/admin')
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
  }
  </style>
  
  