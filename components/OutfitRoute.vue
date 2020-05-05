<template>
  <v-card>
    <v-card-title>
      <v-layout row class="pl-3">
        <v-flex xs12 md3>
          <h3>Маршрут {{ route.title }}</h3>
        </v-flex>
        <v-flex xs3 class="hidden-sm-and-down">Автобус</v-flex>
        <v-flex xs3 class="hidden-sm-and-down">Первая смена</v-flex>
        <v-flex xs3 class="hidden-sm-and-down">Вторая смена</v-flex>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <outfit-way 
        v-for="way in localWays" 
        :key="way._id" 
        :way="way"
        :date="date"
        :isFiltering="isFiltering"
        :isActive="activeWay && activeWay._id == way._id"
      ></outfit-way>
    </v-card-text>
  </v-card>
</template>

<script>
import OutfitWay from "@/components/OutfitWay";

export default {
  components: {
    OutfitWay
  },
  props: ["route", "date", "isFiltering", "activeWay"],
  computed: {
    localWays() {
      return Array.from(this.route.ways).sort((a, b) => (a.title.slice(1) != b.title.slice(1) ? a.title.slice(1) < b.title.slice(1) ? -1 : 1 : 0))
    }
  },
  methods: {
  }
};
</script>

<style>
</style>