<template>
<v-form ref="form">
    <v-layout wrap justify-space-between>
      <v-flex xs12 md6>
        <v-text-field v-model="item.busnumber" label="Бортовой номер"></v-text-field>
        <v-select v-model="item.color" :items="['Синий','Зеленый','Голубой']" label="Цвет"></v-select>
        <v-select 
          v-model="item.mark" 
          :items="['ГОЛАЗ 525110','ЛиАЗ 4292', 'ЛиАЗ 6213','ЛиАЗ 5292', 'Mercedes Benz 2232']" 
          label="Марка"
        ></v-select>
        <v-select v-model="item.capacity" :items="['МВ','СВ','БВ','ОБВ']" label="Вместимость"></v-select>
      </v-flex>

      <v-flex xs12 md5>
        <v-select
          v-model="item.way"
          :items="ways"
          label="Выход"
        ></v-select>
        <v-select v-model="item.status" :items="['', 'Ремонт','СВАРЗ','Долгостой']" label="Статус"></v-select>
        <v-text-field v-model="item.year" label="Год выпуска"></v-text-field>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
export default {
  props: ['item'],
  computed: {
    ways() {
      let ways = Array.from(this.$store.getters['ways/list'])
      return ways
        .sort(function (a, b) {
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title) {
            return -1;
          }
          return 0;
        })
        .sort(function (a, b) {
          if (a.route.title > b.route.title) {
            return 1;
          }
          if (a.route.title < b.route.title) {
            return -1;
          }
          return 0;
        })
        .map((value) => ({ text: `${value.route.title}/${value.title} ${ value.isWeekend ? 'В' : '' }`, value: value._id }))
    }
  },
  mounted() {
    console.log(this.item)
    this.$store.dispatch('ways/readAll')
  }
}
</script>

<style>

</style>