<template>
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-8">Contact Us</h1>
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-2">Name</label>
              <input 
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg"
                required
              >
            </div>
            <!-- Add more form fields -->
            <button 
              type="submit"
              class="bg-secondary hover:bg-primary text-white font-bold py-3 px-6 rounded-lg"
            >
              Send Message
            </button>
          </form>
        </div>
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-semibold mb-4">Get in Touch</h2>
            <div class="space-y-3">
              <p class="flex items-center">
                <MapPinIcon class="h-5 w-5 mr-2" />
                <span>Location Address</span>
              </p>
              <!-- Add more contact details -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { MapPinIcon, PhoneIcon, MailIcon } from 'vue-feather-icons'
  
  export default {
    name: 'ContactPage',
    components: {
      MapPinIcon,
      PhoneIcon,
      MailIcon
    },
    data() {
      return {
        form: {
          name: '',
          email: '',
          message: ''
        }
      }
    },
    methods: {
      submitForm() {
        // Implement form submission logic
      }
    }
  }
  </script>