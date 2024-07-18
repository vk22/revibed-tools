// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index.js'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: '/labels',
        name: 'Labels',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Labels.vue'),
      },
      {
        path: '/labels/:id',
        name: 'LabelPage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/LabelPage.vue'),
      },
      {
        path: '/releases',
        name: 'Releases',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Releases.vue'),
      },
      {
        path: '/releases/:id',
        name: 'ReleasePage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ReleasePage.vue'),
      },
      {
        path: '/releases-not-goods',
        name: 'Releases',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ReleasesNotGoods.vue'),
      },
      // {
      //   path: '/releases-not-goods/:id',
      //   name: 'ReleasePage',
      //   component: () => import(/* webpackChunkName: "home" */ '@/views/ReleasePage.vue'),
      // },
      {
        path: '/youtubes',
        name: 'Youtubes',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Youtubes.vue'),
      },
      {
        path: '/youtubes/:id',
        name: 'YoutubePage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/YoutubePage.vue'),
      },
      {
        path: '/distributors',
        name: 'Distributors',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Distributors.vue'),
      },
      {
        path: '/distributors/:id',
        name: 'DistributorPage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/DistributorPage.vue'),
      },
      {
        path: '/owners',
        name: 'Owners',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Owners.vue'),
      },
      {
        path: '/owners/:id',
        name: 'OwnerPage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/OwnerPage.vue'),
      },
      {
        path: '/artists',
        name: 'Artists',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Artists.vue'),
      },
      {
        path: '/artists/:id',
        name: 'ArtistPage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ArtistPage.vue'),
      },
      {
        path: '/countries',
        name: 'Countries',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Countries.vue'),
      },
      {
        path: '/countries/:id',
        name: 'CountryPage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/CountryPage.vue'),
      }
    
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/default/Login.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/default/Admin.vue'),
    children: [
      {
        path: '/admin',
        name: 'AdminPage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/AdminPage.vue'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from) => {
  // console.log('beforeEach ', store.state.auth.status)
  let isAuthenticated = store.state.auth.status.loggedIn
  console.log('isAuthenticated ', isAuthenticated, to)
  if (!isAuthenticated && to.name !== 'Login') {
    // redirect the user to the login page
    return { name: 'Login' }
  } 
})

export default router
