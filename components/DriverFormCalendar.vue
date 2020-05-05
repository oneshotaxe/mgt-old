<template>
  <v-sheet :elevation="1">
    <v-toolbar elevation="0">
        <v-btn fab small elevation="1" @click="$refs.calendar.prev()"><v-icon>fa-chevron-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-btn fab small elevation="1" @click="$refs.calendar.next()"><v-icon>fa-chevron-right</v-icon></v-btn>
    </v-toolbar>
    <v-calendar 
      @change="onChangeCalendar"
      ref="calendar"
      v-model="date"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]" 
      locale="ru"
    >
      <template v-slot:day-label="{ day, date }">
        <v-menu offset-y hidden>
          <template v-slot:activator="{ on }">
            <v-layout column class="px-2" v-on="on">
              <v-layout
                justify-start
                :class="date == today? 'primary--text font-weight-bold' : 'grey--text'"
              >{{ day }}</v-layout>
              <v-layout v-if="!statuses[date]"></v-layout>
              <v-layout v-else justify-end :class="statuses[date].isException ? 'orange--text' : ''">{{ statuses[date].status }}</v-layout>
            </v-layout>
          </template>
          <v-btn-toggle
            @change="(value) => { onChangeToggle(date, value) }"
            :value="null"
          >
            <v-btn :value="null"></v-btn>
            <v-btn value="Рабочий">Р</v-btn>
            <v-btn value="Первая см.">1</v-btn>
            <v-btn value="Вторая см.">2</v-btn>
            <v-btn value="Выходной">В</v-btn>
            <v-btn value="Больничный">Б</v-btn>
            <v-btn value="Отпуск">О</v-btn>
          </v-btn-toggle>
        </v-menu>
      </template>
    </v-calendar>
  </v-sheet>
</template>

<script>
import moment from "moment";

export default {
  props: ["item"],
  data: () => ({
    today: moment().format("YYYY-MM-DD"),
    date: moment().format("YYYY-MM-DD"),
    statuses: []
  }),
  watch: {
    item: {
      handler: function(val){
        this.statuses = this.calculate_statuses()
      },
      deep: true
    }
  },
  methods: {
    onChangeToggle(date, status) {
      if(status) {
        let changed = 0
        this.item.graphic.exceptions.map((value) => {
          if(value.date === date) {
            changed++
            value.status = status
            return value
          } else {
            return value
          }
        })
        if(!changed) {
          this.item.graphic.exceptions.push({ date, status })
        }
      } else {
        this.item.graphic.exceptions = this.item.graphic.exceptions.filter((value) => {
          return value.date !== date
        })
      }
    },
    onChangeCalendar() {
      this.statuses = this.calculate_statuses()
    },
    calculate_statuses() {
      let start_of_month = moment(this.date).startOf('month')
      let end_of_month = moment(this.date).endOf('month')
      let start_of_calendar = start_of_month.subtract((start_of_month.day()+6)%7, 'd')
      let end_of_calendar = end_of_month.add(6-((end_of_month.day()+6)%7), 'd')
      let difference = end_of_calendar.diff(start_of_calendar, 'd')
      return this.item.statusesByDate({date: start_of_calendar, count: difference+1, isShort: true, withExceptions: true, withDate: true})
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
  }
};
</script>

<style>
</style>