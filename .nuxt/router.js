import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5a6f6e91 = () => interopDefault(import('..\\pages\\buses.vue' /* webpackChunkName: "pages_buses" */))
const _194bc84e = () => interopDefault(import('..\\pages\\downloads.vue' /* webpackChunkName: "pages_downloads" */))
const _73aad36e = () => interopDefault(import('..\\pages\\drivers.vue' /* webpackChunkName: "pages_drivers" */))
const _4196dd4c = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _2aac66a0 = () => interopDefault(import('..\\pages\\outfit.vue' /* webpackChunkName: "pages_outfit" */))
const _d8fb1312 = () => interopDefault(import('..\\pages\\routes.vue' /* webpackChunkName: "pages_routes" */))
const _167436d1 = () => interopDefault(import('..\\pages\\ways.vue' /* webpackChunkName: "pages_ways" */))
const _77ef3a35 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
      path: "/buses",
      component: _5a6f6e91,
      name: "buses"
    }, {
      path: "/downloads",
      component: _194bc84e,
      name: "downloads"
    }, {
      path: "/drivers",
      component: _73aad36e,
      name: "drivers"
    }, {
      path: "/login",
      component: _4196dd4c,
      name: "login"
    }, {
      path: "/outfit",
      component: _2aac66a0,
      name: "outfit"
    }, {
      path: "/routes",
      component: _d8fb1312,
      name: "routes"
    }, {
      path: "/ways",
      component: _167436d1,
      name: "ways"
    }, {
      path: "/",
      component: _77ef3a35,
      name: "index"
    }],

  fallback: false
}

export function createRouter() {
  return new Router(routerOptions)
}
