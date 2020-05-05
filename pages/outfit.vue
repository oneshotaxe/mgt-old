<template>
  <v-layout column>
    <v-snackbar
      v-model="snackbar.isOpen"
      :timeout="3000"
      top
      right
      color="green lighten-1"
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-card class="mb-3">
      <v-card-title class="pt-2">
        <v-flex xs12 sm7 md4>
          <v-layout align-center justify-end>
            <menu-date-picker ref="datePicker" v-model="date"></menu-date-picker>
            <v-btn @click="prevDay" color="white" elevation="1" fab small>
              <v-icon color="grey darken-1">fa-chevron-left</v-icon>
            </v-btn>
            <v-btn @click="update" class="ml-3" color="white" elevation="1" fab small>
              <v-icon color="grey darken-1">fa-redo-alt</v-icon>
            </v-btn>
            <v-btn @click="nextDay" class="ml-3" color="white" elevation="1" fab small>
              <v-icon color="grey darken-1">fa-chevron-right</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
        <v-spacer></v-spacer>
        <v-btn dark color="green lighten-1" @click="save" :loading="isSaving">Сохранить</v-btn>
      </v-card-title>
      <v-card-title class="pt-2">
        <v-menu offset-y left>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text class="mr-3">Очистить</v-btn>
          </template>
          <v-list>
            <v-list-item @click="clear_route">
              <v-list-item-content>Маршрут</v-list-item-content>
            </v-list-item>
            <v-list-item @click="$store.commit('outfit/clear_items')">
              <v-list-item-content>Наряд</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y left>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text class="mr-3">Заполнить</v-btn>
          </template>
          <v-list>
            <v-list-item @click="auto">
              <v-list-item-content>Авто</v-list-item-content>
            </v-list-item>
              <v-list-item @click="$refs.file.click()">
                <v-list-item-content>Из файла</v-list-item-content>
                <input ref="file" type="file" class="d-none" id="file" @input="onFileChange" />
              </v-list-item>
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <v-switch v-model="isFiltering" inset label="Фильтр" class="pr-3"></v-switch>
        <v-switch v-model="micro" inset label="Микрофон"/>
      </v-card-title>
      <v-card-title class="pt-2">
        <v-tabs v-model="currentRoute" centered>
          <template v-for="route in routes">
            <v-tab
              v-if="route.hasActiveWays(date)"
              :key="'tab-'+route._id"
              :href="'#'+route._id"
            >{{ route.title }}</v-tab>
          </template>
        </v-tabs>
      </v-card-title>
    </v-card>
    <v-layout v-if="isLoading" justify-center>
      <v-progress-circular indeterminate></v-progress-circular>
    </v-layout>
    <v-tabs-items v-else v-model="currentRoute">
      <template v-for="route in routes">
        <v-tab-item v-if="route.hasActiveWays(date)" :key="route._id" :value="route._id">
          <outfit-route :route="route" :date="date" :isFiltering="isFiltering" :activeWay="activeWay"></outfit-route>
        </v-tab-item>
      </template>
    </v-tabs-items>
  </v-layout>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import Excel from "exceljs/dist/exceljs"

import Way from '@/models/way'
import OutfitRoute from "@/components/OutfitRoute.vue";
import MenuDatePicker from "@/components/MenuDatePicker";
import Toby from '@/mixins/toby_outfit'

export default {
  transition: "fade",
  mixins: [Toby],
  components: {
    OutfitRoute,
    MenuDatePicker
  },
  data() {
    return {
      activeWay: '',
      snackbar: {
        isOpen: false,
        text: ''
      },
      isFiltering: false,
      isSaving: false,
      isLoading: false,
      currentRoute: null,
      date: moment().format("YYYY-MM-DD")
    };
  },
  watch: {
    async date(val) {
      this.isLoading = true;
      await this.$store.dispatch("outfit/readByDate", { date: val });
      this.isLoading = false;
    }
  },
  computed: {
    ...mapGetters({
      buses: "buses/list",
      items: "outfit/items",
      drivers: "drivers/list",
      routes: "routes/list",
      ways: "ways/list",
      statistic: "outfit/statistic"
    }),
    isWeekend() {
      return [0, 6].includes(moment(this.date).day());
    }
  },
  methods: {
    async onFileChange(e) {
      if (e.target.files && e.target.files.length) {
        let file = e.target.files[0];
        let fileData = null
        let reader = new FileReader();
        reader.onload = async e => {
          fileData = e.target.result;
          const workbook = new Excel.Workbook();
          await workbook.xlsx.load(fileData)
          let worksheet = workbook.getWorksheet(1)
          this.parse_outfit_excel(worksheet)
          this.$refs.file.value = null
        };
        reader.readAsArrayBuffer(file)
      }
    },
    parse_outfit_excel(worksheet) {
      let start_row_number = 10
      let start_column_number = 4
      let row_number = start_row_number
      let column_number = start_column_number
      let bus_column_shift = 1
      let first_smene_column_shift = 3
      let second_smene_column_shift = 7
      let value = ''
      let current_route = null
      let current_way = null
      while(true){
        if(row_number == 89) {
          row_number = start_row_number
          column_number = start_column_number + 13
          first_smene_column_shift = 4
        }
        value = worksheet
          .getRow(row_number)
          .getCell(column_number)
          .value
        if(!value) {
          row_number++
          continue
        }
        if(value.includes('Маршрут')) {
          value = value.trim()
          let route_title = value.split(' ').slice(-1)
          current_route = this.routes.find(route => (route.title == route_title && route.hasActiveWays(this.date)))
        } else if(value.includes('Резерв')) {
          break
        } else {
          if(!current_route) {
            row_number++
            continue
          }
          value = value.trim()
          let way_title = value.split(' ')[0]
          current_way = current_route.ways.find(way => (way.title == way_title && (new Way(way)).isActive(this.date)))
          if(!current_way) {
            row_number++
            continue
          }
          let busnumber = worksheet
            .getRow(row_number)
            .getCell(column_number + bus_column_shift)
            .value
          busnumber = busnumber && (''+busnumber).slice(0, 6)
          let bus = busnumber && this.buses.find(bus => (bus.busnumber == busnumber))
          let first_smene_tabnumber = worksheet
            .getRow(row_number)
            .getCell(column_number + first_smene_column_shift)
            .value
          first_smene_tabnumber = first_smene_tabnumber && (''+first_smene_tabnumber).slice(-4)
          let first_smene = first_smene_tabnumber && this.drivers.find(driver => (driver.tabnumber == first_smene_tabnumber))
          let second_smene_tabnumber = worksheet
            .getRow(row_number)
            .getCell(column_number + second_smene_column_shift)
            .value
          second_smene_tabnumber = second_smene_tabnumber && (''+second_smene_tabnumber).slice(-4)
          let second_smene = first_smene_tabnumber && this.drivers.find(driver => (driver.tabnumber == second_smene_tabnumber))
          
          this.$store.commit('outfit/set_field_value', { wayId: current_way._id, field: 'bus', value: bus && bus._id })
          if(current_way.isTwoSmene) {
            this.$store.commit('outfit/set_field_value', { wayId: current_way._id, field: 'allDay', value: first_smene && first_smene._id })
          } else {
            this.$store.commit('outfit/set_field_value', { wayId: current_way._id, field: 'firstSmene', value: first_smene && first_smene._id })
            this.$store.commit('outfit/set_field_value', { wayId: current_way._id, field: 'secondSmene', value: second_smene && second_smene._id })
          }
        }
        row_number++
      } 
    },
    clear_route() {
      this.$store.commit('outfit/clear_ways', { ways: this.routes.find(route => route._id == this.currentRoute).ways.map(way => way._id)})
    },
    auto() {
      let drivers = { firstSmene: [], secondSmene: [], allDay: [] };
      this.drivers.forEach(driver => {
        switch (driver.statusesByDate({ date: this.date, count: 1, withExceptions: true })[0].status) {
          case "Рабочий":
            drivers.allDay.push(driver);
            break;
          case "Первая см.":
            drivers.firstSmene.push(driver);
            break;
          case "Вторая см.":
            drivers.secondSmene.push(driver);
            break;
        }
      });
      this.$store.commit("outfit/clear_items");
      this.ways.forEach(way => {
        if (!way.isActive(this.date)) {
          return;
        }
        let buses = Array.from(this.buses).filter(bus =>
          way.capacities.includes(bus.capacity) &&
          !bus.status
        );
        let statuses = undefined;
        if (way.isTwoSmene) {
          statuses = ["allDay"];
        } else {
          statuses = ["firstSmene", "secondSmene"];
        }
        statuses.forEach(status => {
          let pair = drivers[status]
            .filter(
              driver =>
                this.statistic[driver._id] &&
                this.statistic[driver._id][way._id]
            )
            .map(driver => ({
              id: driver._id,
              count: this.statistic[driver._id][way._id].count
            }))
            .reduce((p, v) => (p.count < v.count ? v : p), {
              id: null,
              count: 0
            });

          drivers[status].splice(
            drivers[status].findIndex(driver => driver._id == pair.id),
            1
          );
          this.$store.commit("outfit/set_field_value", {
            wayId: way._id,
            field: status,
            value: pair.id
          });
        });

        let pair = buses
          .filter(
            bus =>
              this.statistic[bus._id] && this.statistic[bus._id][way._id]
          )
          .map(bus => ({
            id: bus._id,
            count: this.statistic[bus._id][way._id].count
          }))
          .reduce((p, v) => (p.count < v.count ? v : p), {
            id: null,
            count: 0
          });

        buses.splice(
          buses.findIndex(bus => bus._id == pair.id),
          1
        );
        this.$store.commit("outfit/set_field_value", {
          wayId: way._id,
          field: 'bus',
          value: pair.id
        });
      });
    },
    async save() {
      this.isSaving = true;
      await this.$store.dispatch("outfit/save");
      await this.$store.dispatch("outfit/readByDate", { date: this.date });
      this.isSaving = false;
    },
    nextDay() {
      this.$refs.datePicker.nextDay();
    },
    async update() {
      this.isLoading = true;
      await Promise.all([
        this.$store.dispatch("ways/readAll"),
        this.$store.dispatch("routes/readAll"),
        this.$store.dispatch("drivers/readAll"),
        this.$store.dispatch("buses/readAll"),
        this.$store.dispatch("outfit/readByDate", { date: this.date })
      ]);
      this.isLoading = false;
    },
    prevDay() {
      this.$refs.datePicker.prevDay();
    }
  },
  async mounted() {
    this.isLoading = true;
    await Promise.all([
      this.$store.dispatch("ways/readAll"),
      this.$store.dispatch("routes/readAll"),
      this.$store.dispatch("drivers/readAll"),
      this.$store.dispatch("buses/readAll"),
      this.$store.dispatch("outfit/readByDate", { date: this.date })
    ]);
    this.isLoading = false;
  }
};
</script>

<style>
</style>