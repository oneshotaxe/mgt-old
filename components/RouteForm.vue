<template>
  <v-form ref="form">
    <v-layout wrap justify-space-between>
      <v-flex xs12 md6>
        <v-text-field v-model="item.title" label="Название"></v-text-field>
      </v-flex>

      <v-flex xs12 md5>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
export default {
  props: ["item"]
}
</script>

<style>

</style>