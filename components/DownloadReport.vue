<template>
  <app-download
    title="Отчет"
    @download="get_file"
    :loading="isLoading"
  >
    <menu-date-picker v-model="date"></menu-date-picker>
  </app-download>
</template>

<script>
import moment from 'moment'
import FileSaver from "file-saver";

import AppDownload from "@/components/Download.vue";
import MenuDatePicker from "@/components/MenuDatePicker.vue";
import ReportExcel from '@/models/excel/report_excel'

export default {
  components: {
    AppDownload,
    MenuDatePicker
  },
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      isLoading: false,
      renderer: ReportExcel
    };
  },
  computed: {
    buses() {
      return this.$store.getters['buses/list']
    }
  },
  methods: {
    async get_file() {
      this.isLoading = true;

      await Promise.all([
        this.$store.dispatch('buses/readAll')
      ])
      const buf = await this.renderer.render({ 
        buses: this.buses,
        date: this.date
      });
      FileSaver(new Blob([buf]), `Отчет за ${moment(this.date).format('DD-MM-YY')}.xlsx`);

      this.isLoading = false;
    }
  }
};
</script>

<style>
</style>