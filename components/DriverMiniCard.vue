<template>
  <v-tooltip
    content-class="pa-0"
    :left="left"
    :right="right"
    open-on-hover
    offset-x
    :disabled="$vuetify.breakpoint.xs"
  >
    <template v-slot:activator="{ on }">
      <slot v-bind:on="on" v-bind:item="item"></slot>
    </template>
    <v-card min-width="500">
      <v-card-text>
        <v-input
          error-count="5"
          :messages="item.phones.map(phone => phone.value)"
        >
          <template v-slot:prepend>
            <v-avatar size="100" color="grey">
              <img
                v-if="item.image"
                :src="item.image" 
              />
            </v-avatar>
          </template>
          {{ item.name }}
        </v-input>
      </v-card-text>
    </v-card>
  </v-tooltip>
</template>

<script>
export default {
  props: ['item', 'left', 'right']
}
</script>

<style>

</style>