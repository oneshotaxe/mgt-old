import form from '@/components/BusForm.vue'

export default class Bus {
  busnumber = ''
  color = ''
  mark = ''
  capacity = ''
  drivers = []
  way = null
  status = ''
  year = ''

  constructor(params) {
    Object.assign(this, params)
    this.type = 'buses'
  }
  
  get form() {
    return form
  }
}