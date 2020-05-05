import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _ce9b24c6 = () => interopDefault(import('..\\pages\\buses.vue' /* webpackChunkName: "pages_buses" */))
const _70a0615a = () => interopDefault(import('..\\pages\\downloads.vue' /* webpackChunkName: "pages_downloads" */))
const _2d2a3f7a = () => interopDefault(import('..\\pages\\drivers.vue' /* webpackChunkName: "pages_drivers" */))
const _7fd9dc58 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _74c6af24 = () => interopDefault(import('..\\pages\\outfit.vue' /* webpackChunkName: "pages_outfit" */))
const _1d9f58eb = () => interopDefault(import('..\\pages\\routes.vue' /* webpackChunkName: "pages_routes" */))
const _7b8f2645 = () => interopDefault(import('..\\pages\\ways.vue' /* webpackChunkName: "pages_ways" */))
const _939b8d7e = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
      path: "/buses",
      component: _ce9b24c6,
      name: "buses"
    }, {
      path: "/downloads",
      component: _70a0615a,
      name: "downloads"
    }, {
      path: "/drivers",
      component: _2d2a3f7a,
      name: "drivers"
    }, {
      path: "/login",
      component: _7fd9dc58,
      name: "login"
    }, {
      path: "/outfit",
      component: _74c6af24,
      name: "outfit"
    }, {
      path: "/routes",
      component: _1d9f58eb,
      name: "routes"
    }, {
      path: "/ways",
      component: _7b8f2645,
      name: "ways"
    }, {
      path: "/",
      component: _939b8d7e,
      name: "index"
    }],

  fallback: false
}

export function createRouter() {
  return new Router(routerOptions)
}
