<template>
  <v-form ref="form">
    <v-layout wrap justify-space-between>
      <v-flex xs12 md6>
        <v-text-field v-model="item.tabnumber" label="Табельный номер"></v-text-field>
        <v-text-field v-model="item.name" label="Ф.И.О."></v-text-field>
        <v-select v-model="item.bus" :items="buses" label="Б.н. автобуса"></v-select>
        <driver-form-calendar class="mb-3" :item="item"></driver-form-calendar>
      </v-flex>

      <v-flex xs12 md5>
        <driver-form-avatar :item="item"></driver-form-avatar>
        <driver-form-phones :phones="item.phones"></driver-form-phones>
        <v-select v-model="item.ways" :items="ways" multiple label="Выходы"></v-select>
        <driver-form-graphic :graphic="item.graphic"></driver-form-graphic>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import DriverFormCalendar from "@/components/DriverFormCalendar.vue"
import DriverFormGraphic from "@/components/DriverFormGraphic.vue"
import DriverFormAvatar from "@/components/DriverFormAvatar.vue"
import DriverFormPhones from "@/components/DriverFormPhones.vue"

export default {
  components: {
    DriverFormCalendar,
    DriverFormGraphic,
    DriverFormAvatar,
    DriverFormPhones
  },
  props: ["item"],
  data() {
    return {
      path: "",
      file: null
    };
  },
  computed: {
    buses() {
      let buses = Array.from(this.$store.getters["buses/list"]);
      return buses
        .sort((a, b) => a.busnumber - b.busnumber)
        .map(value => ({ text: value.busnumber, value: value._id }));
    },
    ways() {
      let ways = Array.from(this.$store.getters["ways/list"]);
      return ways
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
    }
  },
  methods: {
    removeAvatar() {
      this.item.image = "";
      this.$refs.avatar.clear();
    }
  },
  mounted() {
    this.$store.dispatch("buses/readAll");
    this.$store.dispatch("ways/readAll");
  }
};
</script>
