import Way from '@/models/way'

export default {
  data() {
    return {
      micro: false
    }
  },
  created: function () {
    if (annyang) {
      var commands = {
        'выход *way': (way) => { this.set_active_way(way) },
        'автобус *busnumber': (busnumber) => { this.set_bus(busnumber) },
        'первая смена *tabnumber': (tabnumber) => { this.set_driver('firstSmene', tabnumber) },
        'вторая смена *tabnumber': (tabnumber) => { this.set_driver('secondSmene', tabnumber) },
        'полный день *tabnumber': (tabnumber) => { this.set_driver('allDay', tabnumber) },
        'сохранить наряд': () => { this.save() },
        'маршрут *routetitle': (routetitle) => { this.change_route(routetitle) }
      }
      annyang.addCommands(commands);
      annyang.setLanguage('ru');
    }
  },
  beforeDestroy: function() {
    annyang.abort()
  },
  watch: {
    currentRoute() {
      this.activeWay = null
    },
    micro(val) {
      if(val) {
        annyang.start();
      } else {
        annyang.abort()
      }
    }
  },
  methods: {
    change_route(routetitle) {
      let new_route = this.routes.find(route => (route.title == routetitle.replace(/\s/g, '')))
      if(new_route && new_route.hasActiveWays(this.date)) {
        this.currentRoute = new_route._id
        this.snackbar.text = `Выбран маршрут ${new_route.title}`
        this.snackbar.isOpen = true
      } else {
        this.snackbar.text = `Маршрут ${routetitle.replace(/\s/g, '')} не найден`
        this.snackbar.isOpen = true
      }
    },
    set_active_way(waytitle) {
      let route = this.routes.find(route => route._id == this.currentRoute)
      let way = route.ways.find(way => way.title == waytitle.replace(/\s/g, '') && (new Way(way).isActive(this.date)))
      if(way) {
        this.snackbar.text = `Выбран выход ${way.title}`
        this.snackbar.isOpen = true
        this.activeWay = way
      } else {
        this.snackbar.text = `Выход ${waytitle.replace(/\s/g, '')} не найден`
        this.snackbar.isOpen = true
      }
    },
    set_bus(busnumber) {
      let bus = this.buses.find(bus => bus.busnumber == busnumber.replace(/\s/g, '').padStart(6, '0'))
      if(bus && this.activeWay) {
        this.$store.commit('outfit/set_field_value', { wayId: this.activeWay._id, field: 'bus', value: bus._id })
        this.snackbar.text = `Автобус ${bus.busnumber.replace(/\s/g, '')} установлен`
        this.snackbar.isOpen = true
      } else {
        this.snackbar.text = `Автобус ${busnumber.replace(/\s/g, '').padStart(6, '0')} не найден`
        this.snackbar.isOpen = true
      }
    },
    set_driver(field, tabnumber) {
      let driver = this.drivers.find(driver => driver.tabnumber == tabnumber.replace(/\s/g, ''))
      if(driver && this.activeWay) {
        if(this.activeWay.isTwoSmene && field == 'allDay' || !this.activeWay.isTwoSmene && ['firstSmene', 'secondSmene'].includes(field)) {
          this.$store.commit('outfit/set_field_value', { wayId: this.activeWay._id, field , value: driver._id })
          this.snackbar.text = `Водитель ${driver.tabnumber.replace(/\s/g, '')} установлен`
          this.snackbar.isOpen = true
        } else {
          this.snackbar.text = `Выход не соответствует запросу`
          this.snackbar.isOpen = true
        }
      } else {
        this.snackbar.text = `Водитель ${tabnumber.replace(/\s/g, '')} не найден`
        this.snackbar.isOpen = true
      }
    }
  }
}