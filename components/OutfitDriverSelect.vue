<template>
  <outfit-select
    :label="''+drivers.length"
    :items="drivers"
    :value="item[field]"
    @input="(data) => $store.commit('outfit/set_field_value', { wayId: way._id, field, value: data })"
  >
    <template v-slot:default="{ item }">
      <v-layout
        justify-space-between
        fill-height
        :style="'border-right: 3px solid ' + (item.borderColor)"
      >
        <driver-mini-card :item="item" left>
          <template v-slot:default="{ on }">
            <span v-on="on">
              <v-icon x-small>{{ item_bus == item.bus._id ? 'fa-check' : 'fa-times' }}</v-icon>
              {{ item.text }}
            </span>
          </template>
        </driver-mini-card>
        <span class="pr-2">{{ item.count }}</span>
      </v-layout>
    </template>
  </outfit-select>
</template>

<script>
import OutfitSelect from "@/components/OutfitSelect.vue";
import DriverMiniCard from '@/components/DriverMiniCard.vue'
import Driver from "@/models/driver";

var translate_statuses = {
  Рабочий: "allDay",
  "Первая см.": "firstSmene",
  "Вторая см.": "secondSmene"
};

export default {
  components: {
    OutfitSelect,
    DriverMiniCard
  },
  props: ["size", "way", "field", "isFiltering"],
  data() {
    return {};
  },
  computed: {
    date() {
      return this.$store.getters["outfit/date"];
    },
    statistic() {
      return this.$store.getters["outfit/statistic"];
    },
    item() {
      return this.$store.getters["outfit/item"](this.way._id);
    },
    ways() {
      return this.$store.getters["ways/list"]
    },
    item_bus() {
      return this.$store.getters["outfit/item_bus"](this.way._id)
    },
    drivers() {
      let drivers = this.$store.getters["drivers/list"].map(driver => ({
        text: driver.tabnumber,
        value: driver._id,
        count: this.count(driver._id),
        borderColor: this.color(driver._id),
        ...driver
      }));
      drivers = drivers.map(value => new Driver(value));
      let colors = { green: 0, yellow: 1, red: 2 };
      drivers = drivers
        .sort((a, b) => b.count - a.count)
        .sort((a, b) => colors[a.borderColor] - colors[b.borderColor]);
      drivers = drivers.filter(value => {
        let isInclude = true;
        this.$store.getters["outfit/items"].forEach(item => {
          let fields = ["allDay", "firstSmene", "secondSmene"];
          fields.forEach(field => {
            if (value._id == item[field]) {
              let way = this.ways.find(way => way._id == item.wayId)
              if(way) {
                value.text = value.text + " (" + way.route.title + "/" + way.title + ")"
              }
            }
          });
          if (value._id == item[this.field] && item.wayId == this.way._id) {
            isInclude = true;
          }
        });
        let status = value.statusesByDate({ date: this.date, count: 1, withExceptions: true })[0]
        if(['Больничный', 'Отпуск', 'Выходной'].includes(status.status)) {
          value.text += " (" + status.status + ")"
        }

        if (!this.isFiltering) {
          return isInclude;
        }
        // Фильтрация
        
        if (
          (translate_statuses[status.status] != this.field) &&
          (!['Больничный', 'Отпуск', 'Выходной'].includes(status.status))
        ) {
          isInclude = false;
        }
        
        // ---
        return isInclude;
      });
      return drivers;
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