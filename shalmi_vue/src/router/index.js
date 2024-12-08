import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SingleProductBuyer from '../components/SingleProductBuyer.vue'
import WholesaleBuyer from '../components/WholesaleBuyer.vue'
import Seller from '../components/Seller.vue'
import Both from '../components/Both.vue'
import Manager from '../components/Manager.vue'
import Admin from '../components/Admin.vue'
import Login from '../components/Login.vue'
import UsersManagement from '../components/admin/UsersManagement.vue'
import CategoriesManagement from '../components/admin/CategoriesManagement.vue'
import ProductsManagement from '../components/admin/ProductsManagement.vue' 
import SignUp from '../components/SignUp.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/single-product-buyer',
      name: 'single-product-buyer',
      component: SingleProductBuyer
    },
    {
      path: '/wholesale-buyer',
      name: 'wholesale-buyer',
      component: WholesaleBuyer
    },
    {
      path: '/seller',
      name: 'seller',
      component: Seller
    },
    {
      path: '/both',
      name: 'both',
      component: Both,
      meta: { requiresAuth: true }
    },
    {
      path: '/manager',
      name: 'manager',
      component: Manager
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin/users',
      name: 'users',
      component: UsersManagement
    },  
    {
      path: '/admin/categories',
      name: 'categories',
      component: CategoriesManagement
    },
    {
      path: '/admin/products',
      name: 'products',
      component: ProductsManagement
    }
  ]
})

// Add navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/')
  } else {
    next()
  }
})

// Override the push method after the router is created
const originalPush = router.push;
router.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => {
    if (err.name !== 'NavigationDuplicated') throw err;
  });
};

export default router;
