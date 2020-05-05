var dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: 'spa',
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  head: {
    title: 'Мосгортранс '+ (dev ? 'dev' : ''),
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href: "https://use.fontawesome.com/releases/v5.0.13/css/all.css", rel: "stylesheet" }
    ],
    script: [
      { src: '/js/annyang.min.js' }
    ],
  },
  loading: { color: '#fff' },
  css: [
    
  ],
  plugins: [
  ],
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/auth',
    '@nuxtjs/axios',
  ],
  auth: {
      strategies: {
          local: {
              endpoints: {
                  login: { url: '/api/auth/login', method: 'post', propertyName: 'token.accessToken' },
                  logout: { url: '/api/auth/logout', method: 'post' },
                  user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
              }
              // tokenRequired: true,
              //tokenType: 'jwt'
          }
      },
      redirect: {
        login: '/login',
        logout: '/login'
      },
  },
  router: {
      middleware: ['auth']
  },
  axios: {
      baseURL: dev ? '' : 'https://nyashukoff.ru'
  },
  vuetify: {
    icons: {
      iconfont: 'fa',
    },
  },
  build: {
    extend (config, ctx) {
    }
  }
}
