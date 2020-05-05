<template>
  <outfit-select
    :label="''+buses.length"
    :items="buses"
    :value="item[field]"
    @input="(data) => $store.commit('outfit/set_field_value', { wayId: way._id, field, value: data })"
  >
    <template v-slot:default="{ item }">
      <v-layout
        justify-space-between
        fill-height
        :style="'border-right: 3px solid ' + (item.borderColor)"
      >
        <span>{{ item.text }}</span>
        <span class="pr-2">{{ item.count }}</span>
      </v-layout>
    </template>
  </outfit-select>
</template>

<script>
import OutfitSelect from "@/components/OutfitSelect.vue";

export default {
  components: {
    OutfitSelect
  },
  props: ["size", "way", "field", "isFiltering"],
  data() {
    return {};
  },
  computed: {
    statistic() {
      return this.$store.getters["outfit/statistic"];
    },
    item() {
      return this.$store.getters["outfit/item"](this.way._id);
    },
    ways() {
      return this.$store.getters["ways/list"]
    },
    buses() {
      let buses = this.$store.getters["buses/list"].map(bus => ({
        text: bus.busnumber,
        value: bus._id,
        count: this.count(bus._id),
        borderColor: this.color(bus._id),
        ...bus
      }));
      let colors = { green: 0, yellow: 1, red: 2 };
      buses = buses
        .sort((a, b) => b.count - a.count)
        .sort((a, b) => colors[a.borderColor] - colors[b.borderColor]);
      buses = buses.filter(value => {
        let isInclude = true;
        this.$store.getters["outfit/items"].forEach(item => {
          if (value._id == item[this.field]) {
            // isInclude = false;
            let way = this.ways.find(way => way._id == item.wayId)
            if(way) {
              value.text = value.text + " (" + way.route.title + "/" + way.title + ")"
            }
          }
        });
        if (!this.isFiltering) {
          return isInclude;
        }
        // Фильтрация
        if (["Ремонт", "Долгостой", "СВАРЗ"].includes(value.status)) {
          isInclude = false;
        }
        if(!this.way.capacities.includes(value.capacity)) {
          isInclude = false
        }
        if(!this.way.colors.includes(value.color)) {
          isInclude = false
        }
        // ---
        return isInclude;
      });
      return buses;
    }
  },
  methods: {
    count(_id) {
      let count = 0;
      if (this.statistic[_id]) {
        if (this.statistic[_id][this.way._id]) {
          count = this.statistic[_id][this.way._id].count;
        }
      }
      return count;
    },
    color(_id) {
      let isKnow = false;
      let count = false;
      if (this.statistic[_id]) {
        if (this.statistic[_id][this.way._id]) {
          count = this.statistic[_id][this.way._id].count;
          isKnow = this.statistic[_id][this.way._id].isKnow;
        }
      }

      if (count) {
        return "green";
      }
      if (isKnow) {
        return "yellow";
      }
      return "red";
    }
  }
};
</script>

<style>
</style>