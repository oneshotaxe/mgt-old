<template>
  <app-download
    title="Автобусы"
    @download="get_file"
    :loading="isLoading"
  >
  </app-download>
</template>

<script>
import moment from 'moment'
import FileSaver from "file-saver";

import AppDownload from "@/components/Download.vue";
import BusesExcel from '@/models/excel/buses_excel'

export default {
  components: {
    AppDownload,
  },
  data() {
    return {
      isLoading: false,
      renderer: BusesExcel
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
        buses: this.buses
      });
      FileSaver(new Blob([buf]), `Автобусы ${moment(this.date).format('DD-MM-YY')}.xlsx`);

      this.isLoading = false;
    }
  }
};
</script>

<style>
</style>