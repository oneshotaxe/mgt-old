<template>
  <v-overflow-btn
    :label="label"
    editable
    style="align-items: center"
    full-width
    clearable
    hide-details
    :items="items"
    :value="value"
    @input="(data) => {$emit('input', data)}"
  >
    <template v-slot:selection="{ item }">
      <slot v-bind:item="item"></slot>
    </template>
    <template v-slot:item="{ item }">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <slot v-bind:item="item" v-on="on"></slot>
        </template>
        <v-slot name="tooltip" v-bind:item="item"></v-slot>
      </v-tooltip>
    </template>
  </v-overflow-btn>
</template>

<script>
export default {
  props: ['value', 'items', 'label']
};
</script>

<style>
  /* .v-select__selections input {
    display: none !important;
  } */
</style>