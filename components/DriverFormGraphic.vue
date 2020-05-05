<template>
  <div>
    Graphic
    <v-select
      v-model="graphic.status"
      :items="[{value: '', text: 'По умолчанию'}, 'Больничный', 'Отпуск']"
      label="Статус"
    ></v-select>
    <v-menu v-model="menu" :close-on-content-click="false" max-width="290">
      <template v-slot:activator="{ on }">
        <v-text-field :value="formattedDate" clearable label="Дата" readonly v-on="on"></v-text-field>
      </template>
      <v-date-picker v-model="graphic.date" no-title @change="menu = false"></v-date-picker>
    </v-menu>
    <v-layout v-for="(item, index) in graphic.items" :key="index">
      <v-flex xs6>
        <v-select
          v-model="item.status"
          single-line
          :items="['Рабочий', 'Выходной', 'Первая см.', 'Вторая см.']"
          label="Статус"
        ></v-select>
      </v-flex>
      <v-flex xs4>
        <v-select
          v-model="item.days"
          single-line
          :items="['1', '2', '3', '4', '5', '6', '7']"
          label="Дней"
        ></v-select>
      </v-flex>
      <v-layout xs2 justify-center align-center>
        <v-btn @click="removeItem(item)" color="error" fab small dark>
          <v-icon>fa-trash-alt</v-icon>
        </v-btn>
      </v-layout>
    </v-layout>
    <v-layout justify-center align-center>
      <v-btn @click="addItem" color="success" fab small dark>
        <v-icon>fa-plus</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: ["graphic"],
  data: () => ({
    status: null,
    today: moment().format("YYYY-MM-DD"),
    menu: false
  }),
  computed: {
    formattedDate() {
      return this.graphic.date
        ? moment(this.graphic.date).format("DD/MM/YYYY")
        : "";
    }
  },
  methods: {
    addItem() {
      this.graphic.items.push({ status: "Рабочий", days: "1" });
    },
    removeItem(item) {
      var index = this.graphic.items.indexOf(item);
      console.log(index);
      this.graphic.items.splice(index, 1);
    }
  }
};
</script>

<style>
</style>