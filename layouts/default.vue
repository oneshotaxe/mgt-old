<template>
  <v-app>
    <v-navigation-drawer
      v-if="$auth.loggedIn"
      v-model="drawer"
      app
      clipped
    >
      <v-list>
        <v-list-item v-for="item in menu" :key="item.title" :to="item.link">
          <v-list-item-content>
            {{ item.title }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon
        v-if="$auth.loggedIn"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn v-if="$auth.loggedIn" rounded color="grey lighten-2" elevation="0" @click="$auth.logout()" dark><v-icon>fa-door-open</v-icon></v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt class="fade"></nuxt>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    menu: [
      { title: 'Главная', link: '/' },
      { title: 'Наряд', link: '/outfit' },
      { title: 'Водители', link: '/drivers' },
      { title: 'Автобусы', link: '/buses' },
      { title: 'Маршруты', link: '/routes' },
      { title: 'Выходы', link: '/ways' },
      { title: 'Выгрузки', link: '/downloads' },
    ],
    drawer: false
  })
}
</script>

<style>
.fade {
  transition: .3s all ease !important;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateY(35px)
}
</style>