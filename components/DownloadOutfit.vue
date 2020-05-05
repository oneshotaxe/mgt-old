<template>
  <app-download
    title="Наряд"
    @download="get_file"
    :loading="isLoading"
  >
    <menu-date-picker v-model="date"></menu-date-picker>
  </app-download>
</template>

<script>
import moment from 'moment'
import FileSaver from "file-saver";

import { mapGetters } from 'vuex'
import AppDownload from "@/components/Download.vue";
import MenuDatePicker from "@/components/MenuDatePicker.vue";
import OutfitExcel from '@/models/excel/outfit_excel'

export default {
  components: {
    AppDownload,
    MenuDatePicker
  },
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      isLoading: false,
      renderer: OutfitExcel
    };
  },
  computed: {
    ...mapGetters({
      buses: 'buses/list',
      drivers: 'drivers/list',
      routes: 'routes/list',
      outfitItems: 'outfit/items'
    })
  },
  methods: {
    async get_file() {
      this.isLoading = true;

      await Promise.all([
        this.$store.dispatch('buses/readAll'),
        this.$store.dispatch('drivers/readAll'),
        this.$store.dispatch('routes/readAll'),
        this.$store.dispatch('outfit/readByDate', {date: this.date})
      ])
      const buf = await this.renderer.render({ 
        outfitItems: this.outfitItems,
        routes: this.routes,
        drivers: this.drivers,
        buses: this.buses,
        date: this.date
      });
      FileSaver(new Blob([buf]), `Наряд на ${moment(this.date).format('DD-MM-YY')}.xlsx`);

      this.isLoading = false;
    }
  }
};
</script>

<style>
</style>