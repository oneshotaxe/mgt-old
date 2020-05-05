<template>
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
    <v-date-picker :value="value" @change="changeDate" no-title></v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment"

export default {
  props: ['value'],
  data() {
    return {
      menu: false
    }
  },
  computed: {
    formattedDate() {
      return this.value ? moment(this.value).format("DD/MM/YYYY") : "";
    }
  },
  methods: {
    changeDate(date) {
      this.$emit('input', date)
      this.menu = false
    },
    nextDay() {
      this.$emit('input', moment(this.value)
        .add(1, "d")
        .format("YYYY-MM-DD"))
    },
    prevDay() {
      this.$emit('input', moment(this.value)
        .subtract(1, "d")
        .format("YYYY-MM-DD"))
    }
  }
};
</script>

<style>
</style>