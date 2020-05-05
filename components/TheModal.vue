<template>
  <v-dialog
    v-model="dialog.isOpen"
    width="900"
    scrollable
    :persistent="isChanged"
  >
    <v-card
      v-if="dialog.isLoading"
      color="primary"
      dark
    >
      <v-card-text>
        Идет загрузка...
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
    <v-card
      v-else
    >
      <v-card-title class="grey lighten-3 elevation-1" style="z-index: 900" v-text="dialogTitle"></v-card-title>
      <v-card-text class="pt-3">
        <component :is="dialog.model.form" :item="dialog.model"></component>
      </v-card-text>
      <v-card-actions class="grey lighten-3 elevation-1">
        <v-btn v-if="this.dialog.model._id" class="ma-3" dark color="red lighten-2" @click="remove">
            <v-icon class="hidden-md-and-up">fa-trash-alt</v-icon>
            <span class="hidden-sm-and-down">Удалить</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="ma-3" @click="onClose">
            <v-icon class="hidden-md-and-up">fa-door-open</v-icon>
            <span class="hidden-sm-and-down">Закрыть</span>
        </v-btn>
        <template class="ma-3">
          <v-btn style="border-top-right-radius: 0; border-bottom-right-radius: 0" dark color="green lighten-2" @click="save">
            <v-progress-circular v-if="dialog.isSaving" indeterminate></v-progress-circular>
            <template v-else>
              <v-icon class="hidden-md-and-up">fa-save</v-icon>
              <span class="hidden-sm-and-down">Сохранить</span>
            </template>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn 
                v-on="on" 
                style="border-top-left-radius: 0; border-bottom-left-radius: 0" 
                class="ml-0 hidden-sm-and-down" 
                dark 
                color="green lighten-2" 
                @click="saveAndClose"
              >
                <v-icon color="white">fa-sign-out-alt</v-icon>
              </v-btn>
            </template>
            <span>Сохранить и выйти</span>
          </v-tooltip>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: {
      isLoading: false,
      isOpen: false,
      model: { form: { render() {return ''}}},
      oldModel: {}
    }
  }),
  computed: {
    isChanged() {
      return JSON.stringify(this.dialog.model) !== JSON.stringify(this.dialog.oldModel) 
    },
    dialogTitle() {
      return this.dialog.model._id ? 'Редактирование записи' : 'Создание записи '
    }
  },
  methods: {
    async open(model) {
      this.dialog.isLoading = true
      this.dialog.isSaving = false
      this.dialog.isOpen = true
      this.dialog.oldModel = {}
      if(model._id) {
        this.dialog.model = await this.$store.dispatch(`${model.type}/read`, { id: model._id })
      } else {
        this.dialog.model = model
      }
      Object.assign(this.dialog.oldModel, this.dialog.model)
      this.dialog.isLoading = false
    },
    onClose() {
      if(this.isChanged) {
        this.dialog.isOpen = !confirm("Close?");
      } else {
        this.dialog.isOpen = false
      }
    },
    async save() {
      this.dialog.isSaving = true
      this.dialog.oldModel = {}
      if(this.dialog.model._id) {
        this.dialog.model = await this.$store.dispatch(`${this.dialog.model.type}/update`, { updated_item: this.dialog.model })
      } else {
        this.dialog.model = await this.$store.dispatch(`${this.dialog.model.type}/create`, { new_item: this.dialog.model })
      }
      Object.assign(this.dialog.oldModel, this.dialog.model)
      this.dialog.isSaving = false
    },
    async saveAndClose() {
      await this.save()
      this.onClose()
    },
    async remove() {
      await this.$store.dispatch(`${this.dialog.model.type}/remove`, { id: this.dialog.model._id })
      this.dialog.isOpen = false
    }
  }
}
</script>

<style>

</style>