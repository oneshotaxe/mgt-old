<template>
  <app-download
    title="A3"
    @download="get_file"
    :loading="isLoading"
  >
    <v-select v-model="month" :items="items" label="Месяц"></v-select>
    <v-file-input label="Шаблон"  @change="onFileChange"></v-file-input>
    <v-layout>
      <v-row>
        <v-col class="text-center" cols="12" md="6">
          <v-btn rounded color="green" @click="uploadFile" dark>Загрузить</v-btn>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <v-btn rounded color="green" @click="get_file(true)" dark>Скачать</v-btn>
        </v-col>
      </v-row>
    </v-layout>
  </app-download>
</template>

<script>
import moment from 'moment'
import FileSaver from "file-saver";

import AppDownload from "@/components/Download.vue";
import MenuDatePicker from "@/components/MenuDatePicker.vue";
import A3Excel from '@/models/excel/a3_excel'

export default {
  components: {
    AppDownload,
    MenuDatePicker
  },
  data() {
    return {
      file: null,
      isLoading: false,
      renderer: A3Excel,
      month: "01",
      items: [
        { text: "Январь", value: "01" },
        { text: "Февраль", value: "02" },
        { text: "Март", value: "03" },
        { text: "Апрель", value: "04" },
        { text: "Май", value: "05" },
        { text: "Июнь", value: "06" },
        { text: "Июль", value: "07" },
        { text: "Август", value: "08" },
        { text: "Сентябрь", value: "09" },
        { text: "Октябрь", value: "10" },
        { text: "Ноябрь", value: "11" },
        { text: "Декабрь", value: "12" }
      ]
    };
  },
  computed: {
    buses() {
      return this.$store.getters['buses/list']
    },
    template() {
      return this.$store.getters['templates/template']('templates/a3.xlsx')
    }
  },
  methods: {
    async get_file(empty = false) {
      this.isLoading = true;

      await Promise.all([
        this.$store.dispatch('buses/readAll'),
        this.$store.dispatch('templates/download', { filename: 'templates/a3.xlsx' })
      ])
      let buf = null
      if(empty){
        buf = this.template
      } else {
        buf = await this.renderer.render({ 
        buses: this.buses,
        template: this.template,
        month: this.month
      });
        
      }
      FileSaver(new Blob([buf]), `Журнал A3 на ${this.items.find(value => (value.value == this.month)).text}.xlsx`);

      this.isLoading = false;
    },
    onFileChange(file) {
      this.file = file
    },
    async uploadFile() {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("template", this.file);
      let { data } = await this.$axios.post("/api/templates/a3.xlsx", formData, {
        headers: { enctype: "multipart/form-data" }
      });
      this.isLoading = false;
    },
  }
};
</script>

<style>
</style>