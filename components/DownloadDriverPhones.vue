<template>
  <app-download
    title="Номера телефонов"
    @download="get_file"
    :loading="isLoading"
  >
  </app-download>
</template>

<script>
import moment from 'moment'
import FileSaver from "file-saver";

import AppDownload from "@/components/Download.vue";
import DriverPhonesExcel from '@/models/excel/driver_phones_excel'

export default {
  components: {
    AppDownload,
  },
  data() {
    return {
      isLoading: false,
      renderer: DriverPhonesExcel
    };
  },
  computed: {
    drivers() {
      return this.$store.getters['drivers/list']
    }
  },
  methods: {
    async get_file() {
      this.isLoading = true;

      await Promise.all([
        this.$store.dispatch('drivers/readAll')
      ])
      const buf = await this.renderer.render({ 
        drivers: this.drivers
      });
      FileSaver(new Blob([buf]), `Номера телефонов ${moment(this.date).format('DD-MM-YY')}.xlsx`);

      this.isLoading = false;
    }
  }
};
</script>

<style>
</style>