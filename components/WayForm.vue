<template>
  <v-form ref="form">
    <v-layout wrap justify-space-between>
      <v-flex xs12 md6>
        <v-text-field v-model="item.title" label="Название"></v-text-field>
        <v-select v-model="item.route" :items="routes" label="Маршрут"></v-select>
        Продолжительность работы
        <v-layout row>
          <v-flex xs6 class="pl-3">
            <menu-time-picker 
              :time="item.times.durationFirstSmene" 
              @change:time="(time) => { item.times.durationFirstSmene = time }"
              label="1 смена"></menu-time-picker>
          </v-flex>
          <v-flex xs6 class="pl-3">
            <menu-time-picker 
              :time="item.times.durationSecondSmene" 
              @change:time="(time) => { item.times.durationSecondSmene = time }"
              label="2 смена"></menu-time-picker>
          </v-flex>
        </v-layout>
        <menu-time-picker 
          :time="item.times.outPark" 
          @change:time="(time) => { item.times.outPark = time }"
          label="Выезд из парка"></menu-time-picker>
        <menu-time-picker 
          :time="item.times.change" 
          @change:time="(time) => { item.times.change = time }"
          label="Время смены"></menu-time-picker>
        <menu-time-picker 
          :time="item.times.endWork" 
          @change:time="(time) => { item.times.endWork = time }"
          label="Окончание работы"></menu-time-picker>
        Время обеда
        <v-layout row>
          <v-flex xs6 class="pl-3">
            <menu-time-picker 
              :time="item.times.lunchFirstSmene" 
              @change:time="(time) => { item.times.lunchFirstSmene = time }"
              label="1 смена"></menu-time-picker>
          </v-flex>
          <v-flex xs6 class="pl-3">
            <menu-time-picker 
              :time="item.times.lunchSecondSmene" 
              @change:time="(time) => { item.times.lunchSecondSmene = time }"
              label="2 смена"></menu-time-picker>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 md5>
        <v-switch v-model="item.isTwoSmene" label="Две смены"></v-switch>
        <v-switch v-model="item.isWeekend" label="Выходные"></v-switch>
        <v-switch v-model="item.isWeekday" label="Будни"></v-switch>
        <v-switch v-model="item.isSummer" label="Лето"></v-switch>
        <v-switch v-model="item.isWinter" label="Зима"></v-switch>
        <v-select v-model="item.familyWay" :items="ways" label="Смежный выход"></v-select>
        <v-select v-model="item.capacities" :items="['МВ','СВ','БВ','ОБВ']" multiple label="Вместимости автобусов"></v-select>
        <v-select v-model="item.colors" :items="['Зеленый','Голубой','Синий']" multiple label="Цвета автобусов"></v-select>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import MenuTimePicker from '@/components/MenuTimePicker.vue'

export default {
  components: {
    MenuTimePicker
  },
  props: ["item"],
  computed: {
    routes() {
      return this.$store.getters['routes/list'].map((value) => ({ text: value.title, value: value._id }))
    },
    ways() {
      let ways = Array.from(this.$store.getters["ways/list"])
      ways = ways.filter(way => (way._id != this.item._id))
      ways = ways
        .sort(function(a, b) {
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title) {
            return -1;
          }
          return 0;
        })
        .sort(function(a, b) {
          if (a.route.title > b.route.title) {
            return 1;
          }
          if (a.route.title < b.route.title) {
            return -1;
          }
          return 0;
        })
        .map(value => ({
          text: `${value.route.title}/${value.title} ${
            value.isWeekend ? "В" : ""
          }`,
          value: value._id
        }));
      ways.unshift({text: '', value: null})
      return ways
    },
  },
  methods: {
  },
  mounted() {
    this.$store.dispatch('routes/readAll')
    this.$store.dispatch('ways/readAll')
  }
}
</script>

<style>

</style>