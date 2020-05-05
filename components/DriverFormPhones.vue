<template>
<v-layout column justify-center>
  <v-row>
    <v-col>
      Phones
    </v-col>
  </v-row>
  <v-row v-for="(phone, index) in phones" :key="'phone-'+index">
    <v-col cols="10" class="py-0">
      <v-text-field v-mask="mask" v-model="phone.value"></v-text-field>
    </v-col>
    <v-col cols="2" align-self="center">
      <v-btn @click="removeItem(phone)" color="error" fab small dark>
        <v-icon>fa-trash-alt</v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col class="pa-0 text-center">
      <v-btn @click="addItem" color="success" fab small dark>
        <v-icon>fa-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</v-layout>
</template>

<script>
import { mask } from "vue-the-mask"

export default {
  directives: {
    mask
  },
  props: ['phones'],
  data() {
    return {
      mask: "+7 (###) ###-##-##"
    };
  },
  methods: {
    addItem() {
      this.phones.push({value: ''})
    },
    removeItem(phone) {
      var index = this.phones.indexOf(phone)
      this.phones.splice(index, 1)
    }
  }
}
</script>

<style>

</style>