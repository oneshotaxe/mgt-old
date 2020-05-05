<template>
  <v-card class="mt-5">
    <v-card-title>
      Маршруты
      <v-spacer></v-spacer>
      <v-text-field
        v-model="table.search"
        label="Поиск"
      ></v-text-field>
      <v-btn
        fab
        dark
        absolute
        top
        right
        color="green lighten-2"
        @click="onNewItem"
      >
        <v-icon>fa-plus</v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table
      :loading="table.isLoading"
      :headers="table.headers"
      :search="table.search"
      :items="items"
      :mobile-breakpoint="0" 
      loading-text="Loading..."
      @click:row="onRowClick"
    >
      <template v-slot:item.ways="{ value }">
        <v-chip v-for="way in value" :key="way._id">{{ way.title }}</v-chip>
      </template>
    </v-data-table>
    <app-modal
      ref="modal"
    ></app-modal>
  </v-card>
</template>

<script>
import Model from '@/models/route'
import AppModal from '@/components/TheModal.vue'

export default {
  transition: 'fade', 
  components: {
    AppModal
  },
  data() {
    return {
      table: {
        isLoading: true,
        search: '',
        headers: [
          { text: 'Название', value: 'title' },
          { text: 'Номера выходов', value: 'ways' }
        ]
      }
    }
  },
  computed: {
    items() {
      return this.$store.getters['routes/list']
    }
  },
  methods: {
    onNewItem() {
      this.$refs.modal.open(new Model())
    },
    onRowClick(item) {
      this.$refs.modal.open(item)
    }
  },
  mounted() {
    this.$store.dispatch('routes/readAll').then(() => {
      this.table.isLoading = false
    })
  }
}
</script>

<style>

</style>