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
            <th class="px-4 py-2 text-left">Subcategory</th>
            <th class="px-4 py-2">
              <div class="grid grid-cols-6 gap-2 text-center">
                <button 
                  @click="filterByLabel('is_new_arrival')"
                  :class="{
                    'px-2 py-1 text-xs rounded transition-colors': true,
                    'bg-blue-100 text-blue-800': !activeLabels.includes('is_new_arrival'),
                    'bg-blue-500 text-white': activeLabels.includes('is_new_arrival')
                  }"
                >
                  New
                </button>
                <button 
                  @click="filterByLabel('is_trending')"
                  :class="{
                    'px-2 py-1 text-xs rounded transition-colors': true,
                    'bg-purple-100 text-purple-800': !activeLabels.includes('is_trending'),
                    'bg-purple-500 text-white': activeLabels.includes('is_trending')
                  }"
                >
                  Trending
                </button>
                <button 
                  @click="filterByLabel('is_featured')"
                  :class="{
                    'px-2 py-1 text-xs rounded transition-colors': true,
                    'bg-green-100 text-green-800': !activeLabels.includes('is_featured'),
                    'bg-green-500 text-white': activeLabels.includes('is_featured')
                  }"
                >
                  Featured
                </button>
                <button 
                  @click="filterByLabel('is_wholesale')"
                  :class="{
                    'px-2 py-1 text-xs rounded transition-colors': true,
                    'bg-yellow-100 text-yellow-800': !activeLabels.includes('is_wholesale'),
                    'bg-yellow-500 text-white': activeLabels.includes('is_wholesale')
                  }"
                >
                  Wholesale
                </button>
                <button 
                  @click="filterByLabel('is_discounted')"
                  :class="{
                    'px-2 py-1 text-xs rounded transition-colors': true,
                    'bg-red-100 text-red-800': !activeLabels.includes('is_discounted'),
                    'bg-red-500 text-white': activeLabels.includes('is_discounted')
                  }"
                >
                  Discounted
                </button>
                <button 
                  @click="filterByLabel('is_top_selling')"
                  :class="{
                    'px-2 py-1 text-xs rounded transition-colors': true,
                    'bg-indigo-100 text-indigo-800': !activeLabels.includes('is_top_selling'),
                    'bg-indigo-500 text-white': activeLabels.includes('is_top_selling')
                  }"
                >
                  Top Selling
                </button>
              </div>
            </th>
            <th class="px-4 py-2 text-left">Price</th>
            <th class="px-4 py-2 text-left">Stock</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" class="border-b">
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
            <td class="px-4 py-2">{{ product.category?.name }}</td>
            <td class="px-4 py-2">{{ product.subcategory?.name }}</td>
            <td class="px-4 py-2">
              <div class="grid grid-cols-6 gap-2 text-center">
                <span 
                  @click="updateProductLabel(product.id, 'is_new_arrival', !product.labels?.is_new_arrival)"
                  :class="{
                    'cursor-pointer hover:opacity-70': true,
                    'text-green-600': product.labels?.is_new_arrival,
                    'text-red-600': !product.labels?.is_new_arrival
                  }"
                >
                  {{ product.labels?.is_new_arrival ? '✓' : '✗' }}
                </span>
                <span 
                  @click="updateProductLabel(product.id, 'is_trending', !product.labels?.is_trending)"
                  :class="{
                    'cursor-pointer hover:opacity-70': true,
                    'text-green-600': product.labels?.is_trending,
                    'text-red-600': !product.labels?.is_trending
                  }"
                >
                  {{ product.labels?.is_trending ? '✓' : '✗' }}
                </span>
                <span 
                  @click="updateProductLabel(product.id, 'is_featured', !product.labels?.is_featured)"
                  :class="{
                    'cursor-pointer hover:opacity-70': true,
                    'text-green-600': product.labels?.is_featured,
                    'text-red-600': !product.labels?.is_featured
                  }"
                >
                  {{ product.labels?.is_featured ? '✓' : '✗' }}
                </span>
                <span 
                  @click="updateProductLabel(product.id, 'is_wholesale', !product.labels?.is_wholesale)"
                  :class="{
                    'cursor-pointer hover:opacity-70': true,
                    'text-green-600': product.labels?.is_wholesale,
                    'text-red-600': !product.labels?.is_wholesale
                  }"
                >
                  {{ product.labels?.is_wholesale ? '✓' : '✗' }}
                </span>
                <span 
                  @click="updateProductLabel(product.id, 'is_discounted', !product.labels?.is_discounted)"
                  :class="{
                    'cursor-pointer hover:opacity-70': true,
                    'text-green-600': product.labels?.is_discounted,
                    'text-red-600': !product.labels?.is_discounted
                  }"
                >
                  {{ product.labels?.is_discounted ? '✓' : '✗' }}
                </span>
                <span 
                  @click="updateProductLabel(product.id, 'is_top_selling', !product.labels?.is_top_selling)"
                  :class="{
                    'cursor-pointer hover:opacity-70': true,
                    'text-green-600': product.labels?.is_top_selling,
                    'text-red-600': !product.labels?.is_top_selling
                  }"
                >
                  {{ product.labels?.is_top_selling ? '✓' : '✗' }}
                </span>
              </div>
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
      },
      activeLabels: []
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
        
        // Debug logs for products and their labels
        console.log('All Products Response:', response.data);
        response.data.forEach(product => {
          // Fix: Get the first item from labels array if it exists
          const labelData = product.labels?.[0] || {};
          console.log(`Product ID ${product.id}:`, {
            title: product.title,
            labels: labelData,
            hasLabels: !!labelData,
            labelValues: {
              new_arrival: labelData.is_new_arrival || false,
              trending: labelData.is_trending || false,
              featured: labelData.is_featured || false,
              wholesale: labelData.is_wholesale || false,
              discounted: labelData.is_discounted || false,
              top_selling: labelData.is_top_selling || false,
            }
          });
        });

        // Fix: Transform the data to use first labels array item
        this.products = response.data.map(product => ({
          ...product,
          labels: product.labels?.[0] || {
            is_new_arrival: false,
            is_trending: false,
            is_featured: false,
            is_wholesale: false,
            is_discounted: false,
            is_top_selling: false
          }
        }));

      } catch (error) {
        console.error('Error fetching products:', error);
        console.error('Error response:', error.response?.data);
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
    }, 300),

    filterByLabel(label) {
      console.log('Filtering by label:', label);
      console.log('Current active labels:', this.activeLabels);
      const index = this.activeLabels.indexOf(label);
      if (index === -1) {
        this.activeLabels.push(label);
      } else {
        this.activeLabels.splice(index, 1);
      }
      console.log('Updated active labels:', this.activeLabels);
    },

    async updateProductLabel(productId, label, value) {
      try {
        console.log('Updating label:', {
          productId,
          label,
          value
        });

        const token = localStorage.getItem('access_token');
        
        // Create labels object with just the updated label
        const labelUpdate = {
          [label]: value
        };

        console.log('Sending label update:', labelUpdate);

        const response = await axios.patch(
          `http://localhost:8000/api/products/${productId}/update_labels/`,  // Use update_labels endpoint
          labelUpdate,  // Send only the updated label
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Label update response:', response.data);
        await this.fetchProducts(); // Refresh the products list
      } catch (error) {
        console.error('Error updating product label:', error);
        console.error('Error response:', error.response?.data);
        alert(error.response?.data?.detail || 'Failed to update label');
      }
    }
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
  },
  computed: {
    filteredProducts() {
      console.log('Filtering products with labels:', this.activeLabels);
      if (this.activeLabels.length === 0) {
        console.log('No active filters, returning all products');
        return this.products;
      }
      
      const filtered = this.products.filter(product => {
        console.log(`Checking product ${product.id}:`, {
          title: product.title,
          labels: product.labels,
          matches: this.activeLabels.every(label => product.labels?.[label])
        });
        return this.activeLabels.every(label => product.labels?.[label]);
      });
      
      console.log('Filtered products:', filtered);
      return filtered;
    }
  }
}
</script> 

</rewritten_file>