import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
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
import Checkout from '../components/Checkout.vue'
import PlaceOrder from '../components/PlaceOrder.vue'
import OrdersManagement from '../components/admin/OrdersManagement.vue'
import TrackOrder from '../components/admin/TrackOrder.vue'
import LandingPage from '../components/LandingPage.vue'
import OrderSuccess from '../components/OrderSuccess.vue'
import TrackOrderUser from '../components/TrackOrderUser.vue'
import AboutPage from '../components/pages/AboutPage.vue'
import BlogPage from '../components/pages/BlogPage.vue'
import TestimonialsPage from '../components/pages/TestimonialsPage.vue'
import ReturnsPage from '../components/pages/ReturnsPage.vue'
import ContactPage from '../components/pages/ContactPage.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogPage
    },
    {
      path: '/testimonials',
      name: 'testimonials',
      component: TestimonialsPage
    },
    {
      path: '/returns',
      name: 'returns',
      component: ReturnsPage
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactPage
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
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/place-order',
      name: 'place-order',
      component: PlaceOrder
    },
    {
      path: '/admin/orders',
      name: 'orders',
      component: OrdersManagement
    },
    {
      path: '/admin/track-order',
      name: 'track-order',
      component: TrackOrder
    },
    {
      path: '/order-success/:orderId/:trackingNumber',
      name: 'order-success',
      component: OrderSuccess
    },
    {
      path: '/track-order-user',
      name: 'track-order-user',
      component: TrackOrderUser
    }
  ]
})

// Add navigation guard
router.beforeEach((to, from, next) => {
  // List of routes that require authentication
  const protectedRoutes = ['/admin', '/admin/users', '/admin/products', '/admin/categories'];
  
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  // Check if route requires authentication
  if (protectedRoutes.some(route => to.path.startsWith(route))) {
    if (!accessToken || !refreshToken) {
      // Redirect to login if no tokens
      next('/login');
    } else {
      next();
    }
  } else {
    next();
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
