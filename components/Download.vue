<template>
  <v-card>
    <v-card-title class="green">
      <v-icon dark>fa-file-excel</v-icon>
      <span class="ml-3 white--text">{{ title }}</span>
    </v-card-title>
    <v-card-text class="pt-2">
      <slot></slot>
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-btn
        :loading="loading"
        height="52"
        style="font-size: 1.4rem; border-top-left-radius: 0; border-top-right-radius: 0"
        block
        color="green"
        dark
        @click="$emit('download')"
      >
        <span>Скачать</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['title', 'loading']
};
</script>

<style>
</style>