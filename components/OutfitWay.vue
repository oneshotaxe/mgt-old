<template>
  <v-layout v-if="localWay.isActive(date)" align-center>
    <v-row class="px-3">
      <v-col class="px-0" cols="0" md="1"></v-col>
      <v-col class="px-0 align-center" cols="12" md="2"><h3 :class="isActive ? 'black--text' : ''">Выход {{ way.title }}</h3></v-col>
      <v-subheader class="hidden-md-and-up">Автобус</v-subheader>
      <v-col class="px-0" cols="12" md="3">
        <outfit-bus-select
          :key="localWay._id+'1'"
          :way="localWay"
          field="bus"
          :isFiltering="isFiltering"
        ></outfit-bus-select>
      </v-col>
      <v-subheader class="hidden-md-and-up" v-if="!localWay.isTwoSmene">Первая см.</v-subheader>
      <v-col class="px-0" cols="12" md="3" v-if="!localWay.isTwoSmene">
        <outfit-driver-select
          :key="localWay._id+'2'"
          :way="localWay"
          field="firstSmene"
          :isFiltering="isFiltering"
        ></outfit-driver-select>
      </v-col>
      <v-subheader class="hidden-md-and-up" v-if="!localWay.isTwoSmene">Вторая см.</v-subheader>
      <v-col class="px-0" cols="12" md="3" v-if="!localWay.isTwoSmene">
        <outfit-driver-select
          :key="localWay._id+'3'"
          :way="localWay"
          field="secondSmene"
          :isFiltering="isFiltering"
        ></outfit-driver-select>
      </v-col>
      <v-subheader class="hidden-md-and-up" v-if="localWay.isTwoSmene">Полный день</v-subheader>
      <v-col class="px-0" cols="12" md="6" v-if="localWay.isTwoSmene">
        <outfit-driver-select
          :key="localWay._id+'4'"
          :way="localWay"
          field="allDay"
          :isFiltering="isFiltering"
        ></outfit-driver-select>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import OutfitDriverSelect from "@/components/OutfitDriverSelect.vue";
import OutfitBusSelect from "@/components/OutfitBusSelect.vue";
import Way from '@/models/way'

export default {
  components: {
    OutfitDriverSelect,
    OutfitBusSelect,
  },
  props: ["way", "date", "isFiltering", "isActive"],
  data() {
    return {

    };
  },
  watch: {
    
  },
  computed: {
    localWay() {
      return new Way(this.way)
    }
  },
  methods: {
  }
};
</script>

<style>
</style>