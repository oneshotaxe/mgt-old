<template>
  <v-menu
    :return-value.sync="localTime"
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        clearable
        v-model="localTime"
        :label="label"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      format="24hr"
      v-model="localTime"
      @click:minute="changeTime"
    ></v-time-picker>
  </v-menu>
</template>

<script>
export default {
  props: ['time', 'label'],
  data() {
    return {
      localTime: this.time,
      menu: false
    }
  },
  watch: {
    localTime(val) {
      this.$emit('change:time', val)
    }
  },
  methods: {
    changeTime() {
      this.$refs.menu.save(this.localTime)
    }
  }
}
</script>

<style>

</style>