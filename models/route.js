import moment from 'moment'

import form from '@/components/RouteForm.vue'

export default class Route {
  title = ''
  ways = []

  constructor(params) {
    Object.assign(this, params)
    this.type = 'routes'
  }
  
  get form() {
    return form
  }

  hasActiveWays(date = '') {
    let isWeekend = [0, 6].includes(moment(date).day())
    return this.ways.reduce(
      (a, b) =>
        a + +((b.isWeekend && isWeekend) || (b.isWeekday && !isWeekend)),
      0
    )
  }
}