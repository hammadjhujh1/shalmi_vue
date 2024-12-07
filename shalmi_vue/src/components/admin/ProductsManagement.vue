<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Products Management</h2>
      <button 
        @click="showProductModal = true"
        class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
      >
        Add New Product
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex gap-4">
      <div class="flex-1">
        <select 
          v-model="filters.category"
          class="w-full px-3 py-2 border rounded"
          @change="fetchProducts"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="flex-1">
        <select 
          v-model="filters.status"
          class="w-full px-3 py-2 border rounded"
          @change="fetchProducts"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div class="flex-1">
        <input 
          v-model="filters.search"
          type="search"
          placeholder="Search products..."
          class="w-full px-3 py-2 border rounded"
          @input="debounceSearch"
        >
      </div>
    </div>

    <!-- Products Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left">Title</th>
            <th class="px-4 py-2 text-left">Category</th>
            <th class="px-4 py-2 text-left">Price</th>
            <th class="px-4 py-2 text-left">Stock</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-b">
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <img 
                  v-if="product.image" 
                  :src="product.image" 
                  class="w-10 h-10 object-cover rounded"
                  alt="Product image"
                >
                {{ product.title }}
              </div>
            </td>
            <td class="px-4 py-2">
              {{ product.category?.name }}
              <span v-if="product.subcategory" class="text-gray-500">
                / {{ product.subcategory.name }}
              </span>
            </td>
            <td class="px-4 py-2">${{ product.price }}</td>
            <td class="px-4 py-2">{{ product.stock }}</td>
            <td class="px-4 py-2">
              <span :class="{
                'px-2 py-1 rounded text-sm': true,
                'bg-yellow-100 text-yellow-800': product.status === 'draft',
                'bg-green-100 text-green-800': product.status === 'published',
                'bg-gray-100 text-gray-800': product.status === 'archived'
              }">
                {{ product.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <button 
                @click="editProduct(product)"
                class="text-blue-600 hover:text-blue-800 mr-2"
              >
                Edit
              </button>
              <button 
                @click="deleteProduct(product.id)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">
          {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
        </h3>
        <form @submit.prevent="saveProduct">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">Title</label>
              <input 
                v-model="productForm.title"
                type="text"
                class="w-full px-3 py-2 border rounded"
                required
              >
            </div>
            <div>
              <label class="block mb-1">Price</label>
              <input 
                v-model="productForm.price"
                type="number"
                step="0.01"
                class="w-full px-3 py-2 border rounded"
                required
              >
            </div>
            <div>
              <label class="block mb-1">Category</label>
              <select 
                v-model="productForm.category"
                class="w-full px-3 py-2 border rounded"
                required
                @change="loadSubcategories"
              >
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block mb-1">Subcategory</label>
              <select 
                v-model="productForm.subcategory"
                class="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Subcategory</option>
                <option 
                  v-for="subcategory in availableSubcategories" 
                  :key="subcategory.id" 
                  :value="subcategory.id"
                >
                  {{ subcategory.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block mb-1">Stock</label>
              <input 
                v-model="productForm.stock"
                type="number"
                min="0"
                class="w-full px-3 py-2 border rounded"
                required
              >
            </div>
            <div>
              <label class="block mb-1">Status</label>
              <select 
                v-model="productForm.status"
                class="w-full px-3 py-2 border rounded"
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block mb-1">Description</label>
              <textarea 
                v-model="productForm.description"
                class="w-full px-3 py-2 border rounded"
                rows="3"
              ></textarea>
            </div>
            <div class="col-span-2">
              <label class="block mb-1">Image</label>
              <input 
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                class="w-full px-3 py-2 border rounded"
              >
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button 
              type="button"
              @click="showProductModal = false"
              class="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-primary text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { debounce } from 'lodash';

export default {
  data() {
    return {
      products: [],
      categories: [],
      availableSubcategories: [],
      showProductModal: false,
      editingProduct: null,
      filters: {
        category: '',
        status: '',
        search: ''
      },
      productForm: {
        title: '',
        description: '',
        category: null,
        subcategory: null,
        price: 0,
        stock: 0,
        status: 'draft',
        image: null
      }
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const token = localStorage.getItem('access_token');
        const params = {
          category: this.filters.category,
          status: this.filters.status,
          search: this.filters.search
        };
        const response = await axios.get('http://localhost:8000/api/products/', { 
          params,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },

    async fetchCategories() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/categories/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    async loadSubcategories() {
      if (!this.productForm.category) {
        this.availableSubcategories = [];
        return;
      }
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/api/subcategories/`, {
          params: {
            category: this.productForm.category
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Subcategories response:', response.data);
        this.availableSubcategories = response.data || [];
        
      } catch (error) {
        console.error('Error loading subcategories:', error);
        console.error('Response:', error.response?.data);
        this.availableSubcategories = [];
      }
    },

    editProduct(product) {
      this.editingProduct = product;
      this.productForm = { 
        ...product,
        category: product.category?.id,
        subcategory: product.subcategory?.id
      };
      this.showProductModal = true;
      if (this.productForm.category) {
        this.loadSubcategories();
      }
    },

    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const token = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('image', file);
        try {
          const response = await axios.post('http://localhost:8000/api/upload/', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          this.productForm.image = response.data.url;
        } catch (error) {
          console.error('Error uploading image:', error);
          alert(error.response?.data?.detail || 'Failed to upload image');
        }
      }
    },

    async saveProduct() {
      try {
        const token = localStorage.getItem('access_token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // Format the data following Django REST Framework conventions
        const productData = {
          title: this.productForm.title,
          description: this.productForm.description,
          category: parseInt(this.productForm.category),      // Using 'category' not 'category_id'
          subcategory: this.productForm.subcategory ? parseInt(this.productForm.subcategory) : null,  // Using 'subcategory' not 'subcategory_id'
          price: parseFloat(this.productForm.price),
          stock: parseInt(this.productForm.stock),
          status: this.productForm.status,
          image: this.productForm.image
        };

        console.log('Product data being sent:', productData);

        if (this.editingProduct) {
          await axios.put(
            `http://localhost:8000/api/products/${this.editingProduct.id}/`, 
            productData,
            config
          );
        } else {
          await axios.post('http://localhost:8000/api/products/', productData, config);
        }
        await this.fetchProducts();
        this.showProductModal = false;
        this.resetForm();
      } catch (error) {
        console.error('Error saving product:', error);
        console.error('Response data:', error.response?.data);
        alert(error.response?.data?.detail || 'Failed to save product');
      }
    },

    async deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const token = localStorage.getItem('access_token');
          await axios.delete(`http://localhost:8000/api/products/${productId}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          await this.fetchProducts();
        } catch (error) {
          console.error('Error deleting product:', error);
          alert(error.response?.data?.detail || 'Failed to delete product');
        }
      }
    },

    // Initialize form with proper field names
    resetForm() {
      this.productForm = {
        title: '',
        description: '',
        category: null,        // Using 'category' not 'category_id'
        subcategory: null,     // Using 'subcategory' not 'subcategory_id'
        price: 0,
        stock: 0,
        status: 'draft',
        image: null
      };
      this.editingProduct = null;
    },

    debounceSearch: debounce(function() {
      this.fetchProducts();
    }, 300)
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategories();
  },
  watch: {
    'productForm.category': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadSubcategories();
        } else {
          this.availableSubcategories = [];
        }
      }
    }
  }
}
</script> 