<template>
  <app-download
    title="Согласие"
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
import AgreementExcel from '@/models/excel/agreement_excel'

export default {
  components: {
    AppDownload,
    MenuDatePicker
  },
  data() {
    return {
      file: null,
      isLoading: false,
      renderer: AgreementExcel,
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
    drivers() {
      return this.$store.getters['drivers/list']
    },
    template() {
      return this.$store.getters['templates/template']('templates/agreement.xlsx')
    }
  },
  methods: {
    async get_file(empty = false) {
      this.isLoading = true;

      await Promise.all([
        this.$store.dispatch('drivers/readAll'),
        this.$store.dispatch('templates/download', { filename: 'templates/agreement.xlsx' })
      ])
      let buf = null
      if(empty){
        buf = this.template
      } else {
        buf = await this.renderer.render({ 
        drivers: this.drivers,
        template: this.template,
        month: this.month
      });
        
      }
      FileSaver(new Blob([buf]), `Согласие за ${this.items.find(value => (value.value == this.month)).text}.xlsx`);

      this.isLoading = false;
    },
    onFileChange(file) {
      this.file = file
    },
    async uploadFile() {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("template", this.file);
      let { data } = await this.$axios.post("/api/templates/agreement.xlsx", formData, {
        headers: { enctype: "multipart/form-data" }
      });
      this.isLoading = false;
    },
  }
};
</script>

<style>
</style>