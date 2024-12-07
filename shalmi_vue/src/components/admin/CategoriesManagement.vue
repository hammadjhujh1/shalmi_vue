<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Categories Management</h2>
      <button 
        @click="showAddModal = true; modalType = 'category'"
        class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
      >
        Add New Category
      </button>
    </div>

    <!-- Categories List -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="text-red-600 p-4 text-center">
      {{ error }}
      <button 
        @click="fetchCategories" 
        class="ml-2 underline hover:text-red-800"
      >
        Try again
      </button>
    </div>

    <div v-else class="space-y-4">
      <div v-if="categories.length === 0" class="text-center text-gray-500 py-8">
        No categories found. Create your first category!
      </div>
      
      <div v-for="category in categories" :key="category.id" class="border rounded-lg p-4">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <button 
              @click="toggleCategory(category.id)"
              class="text-gray-600 hover:text-gray-800"
            >
              <i :class="expandedCategories.has(category.id) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
            </button>
            <div>
              <h3 class="text-xl font-semibold">{{ category.name }}</h3>
              <p class="text-gray-600">{{ category.description }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              @click="editCategory(category)"
              class="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button 
              @click="deleteCategory(category.id)"
              class="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
            <button 
              @click="addSubcategory(category)"
              class="text-green-600 hover:text-green-800"
            >
              Add Subcategory
            </button>
          </div>
        </div>

        <!-- Subcategories (now with transition) -->
        <transition name="slide">
          <div v-if="expandedCategories.has(category.id)" class="ml-6 space-y-2">
            <div v-if="category.subcategories?.length === 0" class="text-gray-500 italic">
              No subcategories found
            </div>
            <div v-for="subcategory in category.subcategories" :key="subcategory.id"
              class="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <div>
                <span class="font-medium">{{ subcategory.name }}</span>
                <p class="text-sm text-gray-600">{{ subcategory.description }}</p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="editSubcategory(subcategory, category)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button 
                  @click="deleteSubcategory(subcategory.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">
          {{ getModalTitle }}
        </h3>
        <form @submit.prevent="saveItem">
          <div class="space-y-4">
            <div>
              <label class="block mb-1">Name</label>
              <input 
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2 border rounded"
                required
              >
            </div>
            <div>
              <label class="block mb-1">Description</label>
              <textarea 
                v-model="form.description"
                class="w-full px-3 py-2 border rounded"
                rows="3"
              ></textarea>
            </div>
            <div v-if="modalType === 'subcategory'">
              <label class="block mb-1">Parent Category</label>
              <select 
                v-model="form.category_id"
                class="w-full px-3 py-2 border rounded"
                required
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button 
              type="button"
              @click="showAddModal = false"
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

export default {
  data() {
    return {
      categories: [],
      isLoading: false,
      error: null,
      showAddModal: false,
      modalType: 'category', // 'category' or 'subcategory'
      editingItem: null,
      form: {
        name: '',
        description: '',
        category_id: null
      },
      expandedCategories: new Set(), // Track which categories are expanded
    }
  },
  computed: {
    getModalTitle() {
      const action = this.editingItem ? 'Edit' : 'Add New';
      const type = this.modalType === 'category' ? 'Category' : 'Subcategory';
      return `${action} ${type}`;
    }
  },
  methods: {
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('access_token');
        console.log('Token being used:', token);

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:8000/api/categories/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('API Response:', response.data);
        this.categories = response.data;
      } catch (error) {
        console.error('Full error object:', error);
        console.error('Response data:', error.response?.data);
        this.error = error.response?.data?.message || 
                     error.response?.data?.detail ||
                     error.message ||
                     'Failed to fetch categories';
      } finally {
        this.isLoading = false;
      }
    },
    editCategory(category) {
      this.modalType = 'category';
      this.editingItem = category;
      this.form = {
        name: category.name,
        description: category.description
      };
      this.showAddModal = true;
    },
    addSubcategory(category) {
      this.modalType = 'subcategory';
      this.editingItem = null;
      this.form = {
        name: '',
        description: '',
        category_id: category.id
      };
      this.showAddModal = true;
    },
    editSubcategory(subcategory, category) {
      this.modalType = 'subcategory';
      this.editingItem = subcategory;
      this.form = {
        name: subcategory.name,
        description: subcategory.description,
        category_id: category.id
      };
      this.showAddModal = true;
    },
    async saveItem() {
      try {
        const token = localStorage.getItem('access_token');
        console.log('Form data being sent:', this.form);
        
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        if (this.modalType === 'category') {
          if (this.editingItem) {
            await axios.put(
              `http://localhost:8000/api/categories/${this.editingItem.id}/`, 
              this.form,
              config
            );
          } else {
            await axios.post(
              'http://localhost:8000/api/categories/', 
              this.form,
              config
            );
          }
        } else {
          // Ensure subcategory data is properly formatted
          const subcategoryData = {
            name: this.form.name,
            description: this.form.description,
            category: parseInt(this.form.category_id) // Changed from category_id to category
          };
          
          console.log('Subcategory data being sent:', subcategoryData);

          if (this.editingItem) {
            await axios.put(
              `http://localhost:8000/api/subcategories/${this.editingItem.id}/`, 
              subcategoryData,
              config
            );
          } else {
            await axios.post(
              'http://localhost:8000/api/subcategories/', 
              subcategoryData,
              config
            );
          }
        }
        await this.fetchCategories();
        this.showAddModal = false;
        this.resetForm();
      } catch (error) {
        console.error('Error saving item:', error);
        console.error('Full error response:', error.response);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        alert(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          JSON.stringify(error.response?.data) ||
          'Failed to save item'
        );
      }
    },
    async deleteCategory(categoryId) {
      if (confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
        try {
          const token = localStorage.getItem('access_token');
          await axios.delete(`http://localhost:8000/api/categories/${categoryId}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          this.fetchCategories();
        } catch (error) {
          console.error('Error deleting category:', error);
          alert(error.response?.data?.detail || 'Failed to delete category');
        }
      }
    },
    async deleteSubcategory(subcategoryId) {
      if (confirm('Are you sure you want to delete this subcategory?')) {
        try {
          const token = localStorage.getItem('access_token');
          await axios.delete(`http://localhost:8000/api/subcategories/${subcategoryId}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          this.fetchCategories();
        } catch (error) {
          console.error('Error deleting subcategory:', error);
          alert(error.response?.data?.detail || 'Failed to delete subcategory');
        }
      }
    },
    resetForm() {
      this.form = {
        name: '',
        description: '',
        category_id: null
      };
      this.editingItem = null;
    },
    toggleCategory(categoryId) {
      if (this.expandedCategories.has(categoryId)) {
        this.expandedCategories.delete(categoryId);
      } else {
        this.expandedCategories.add(categoryId);
      }
    },
  },
  mounted() {
    this.fetchCategories();
  }
}
</script> 