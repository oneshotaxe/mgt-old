<template>
  <v-card>
    <v-snackbar v-model="snackbar.isOpen" color="red" multi-line right :timeout="60000" top>
      {{ snackbar.queye[snackbar.current] }}
      <v-btn dark text @click="swapSnackbar">Close</v-btn>
    </v-snackbar>
    <v-card-title>
      <v-flex xs12 sm7 md4>
        <v-layout align-center justify-end>
          <v-menu v-model="menu" :close-on-content-click="false" max-width="290">
            <template v-slot:activator="{ on }">
              <v-text-field
                flat
                style="box-shadow: none"
                class="desable-shadow mr-4"
                solo
                hide-details
                :value="formattedDate"
                label="Date"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title @change="menu = false"></v-date-picker>
          </v-menu>
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
    </v-card-title>
    <v-card-text class="mt-3">
      <v-row>
        <v-col>
          <h1>Автобусы ({{ buses.length }})</h1>
          <h2 class="pt-2">Резерв ({{ report.busReserve.length }})</h2>
          <v-chip
            v-for="bus in report.busReserve.sort((a, b) => (a.busnumber - b.busnumber))"
            :key="bus._id"
          >{{ bus.busnumber }}</v-chip>
          <template v-for="(status, name) in report.outBuses">
            <h2 class="pt-2" :key="name">{{ name }} ({{ status.length }})</h2>
            <v-chip
              v-for="bus in status.sort((a, b) => (a.busnumber - b.busnumber))"
              :key="bus._id"
            >{{ bus.busnumber }}</v-chip>
          </template>
        </v-col>
        <v-col>
          <h1>Водители({{ drivers.length }})</h1>
          <h2 class="pt-2">Резерв ({{ report.driverReserveCount }})</h2>
          <v-simple-table>
            <thead>
              <tr>
                <th>Первая см.</th>
                <th>Вторая см.</th>
                <th>Полный день</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in report.driverReserveTable" :key="i">
                <td>
                  <driver-mini-card
                    v-for="driver in row['Первая см.']"
                    :key="driver._id"
                    :item="driver"
                    left
                  >
                <template v-slot:default="{ on }">
                  <v-chip v-on="on">{{ driver.tabnumber }}</v-chip>
                </template>
              </driver-mini-card>
                </td>
                <td>
                  <driver-mini-card
                    v-for="driver in row['Вторая см.']"
                    :key="driver._id"
                    :item="driver"
                    left
                  >
                <template v-slot:default="{ on }">
                  <v-chip v-on="on">{{ driver.tabnumber }}</v-chip>
                </template>
              </driver-mini-card>
                </td>
                <td>
                  <driver-mini-card
                    v-for="driver in row['Рабочий']"
                    :key="driver._id"
                    :item="driver"
                    left
                  >
                <template v-slot:default="{ on }">
                  <v-chip v-on="on">{{ driver.tabnumber }}</v-chip>
                </template>
              </driver-mini-card>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <template v-for="(status, name) in report.outDrivers">
            <h2 class="pt-2" :key="name">{{ name }} ({{ status.length }})</h2>
            <driver-mini-card
              v-for="driver in status.sort((a, b) => (a.tabnumber - b.tabnumber))"
              :key="driver._id"
              :item="driver"
              left
            >
                <template v-slot:default="{ on }">
                  <v-chip v-on="on">{{ driver.tabnumber }}</v-chip>
                </template>
              </driver-mini-card>
          </template>
        </v-col>
      </v-row>
      <h1>Рабочие</h1>
      <v-simple-table>
        <thead>
          <tr>
            <th>Автобус</th>
            <th>Первая см.</th>
            <th>Вторая см.</th>
            <th>Полный день</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in report.workTable.sort((a,b) => (a['Автобус'].busnumber - b['Автобус'].busnumber))" :key="row['Автобус']._id">
            <td>
              <v-chip>{{ row['Автобус'].busnumber }}</v-chip>
            </td>
            <td>
              <driver-mini-card
                v-for="driver in row['Первая см.']"
                :key="driver._id"
                :item="driver"
                left
              >
                <template v-slot:default="{ on }">
                  <v-chip v-on="on">{{ driver.tabnumber }}</v-chip>
                </template>
              </driver-mini-card>
            </td>
            <td>
              <driver-mini-card
                v-for="driver in row['Вторая см.']"
                :key="driver._id"
                :item="driver"
                left
              >
                <template v-slot:default="{ on }">
                  <v-chip v-on="on">{{ driver.tabnumber }}</v-chip>
                </template>
              </driver-mini-card>
            </td>
            <td>
              <driver-mini-card
                v-for="driver in row['Рабочий']"
                :key="driver._id"
                :item="driver"
                left
              >
                <template v-slot:default="{ on }">
                  <v-chip v-on="on">{{ driver.tabnumber }}</v-chip>
                </template>
              </driver-mini-card>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";
import Report from "@/models/report";
import DriverMiniCard from "@/components/DriverMiniCard.vue";

export default {
  transition: "fade",
  components: {
    DriverMiniCard
  },
  data: () => ({
    snackbar: {
      isOpen: false,
      queye: [],
      current: 0
    },
    date: moment().format("YYYY-MM-DD"),
    menu: false,
    headers: []
  }),
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format("DD/MM/YYYY") : "";
    },
    report() {
      this.snackbar.isOpen = false;
      let report = new Report(this.date, this.buses);
      if (report.errors.length > 0) {
        setTimeout(() => {
          this.snackbar.current = 0;
          this.snackbar.queye = report.errors;
          this.snackbar.isOpen = true;
          console.log(this.snackbar);
        }, 300);
      }
      return report;
    },
    buses() {
      return this.$store.getters["buses/list"];
    },
    drivers() {
      return this.$store.getters["drivers/list"];
    }
  },
  methods: {
    swapSnackbar() {
      if (this.snackbar.queye[this.snackbar.current + 1]) {
        this.snackbar.current++;
      } else {
        this.snackbar.current = 0;
        this.snackbar.isOpen = false;
      }
    },
    nextDay() {
      this.date = moment(this.date)
        .add(1, "d")
        .format("YYYY-MM-DD");
    },
    update() {
      this.$store.dispatch("buses/readAll");
    },
    prevDay() {
      this.date = moment(this.date)
        .subtract(1, "d")
        .format("YYYY-MM-DD");
    }
  },
  mounted() {
    this.$store.dispatch("buses/readAll");
    this.$store.dispatch("drivers/readAll")
  }
};
</script>