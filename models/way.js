import moment from 'moment'

import form from '@/components/WayForm.vue'

export default class Way {
  title = ''
  route = null
  times = {
    durationFirstSmene: null,
    durationSecondSmene: null,
    outPark: null,
    change: null,
    endWork: null,
    lunchFirstSmene: null,
    lunchSecondSmene: null
  }
  isTwoSmene = false
  isWeekend = false
  isWeekday = false
  isSummer = false
  isWinter = false
  buses = []
  familyWay = null
  capacities = []
  colors = []

  constructor(params) {
    Object.assign(this, params)
    this.type = 'ways'
  }
  
  get form() {
    return form
  }

  isActive(date = '') {
    let isWeekend = [0, 6].includes(moment(date).day())
    return  (this.isWeekend && isWeekend) ||
            (this.isWeekday && !isWeekend)
  }
}