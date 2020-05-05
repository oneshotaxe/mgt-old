import Excel from "exceljs/dist/exceljs"

import Way from '@/models/way'

export default class ReportExcel {
  static async render({ outfitItems, routes, drivers, buses, date }) {
      const workbook = new Excel.Workbook()
      var worksheet = workbook.addWorksheet('Main')

      for(let i=0; i<11; i++) {
          let column = worksheet.getColumn(i+1)
          column.width = 11
          column.style = { font: { size: 14 } }
      }

      let sortedRoutes = Array.from(routes).sort((a, b) => (a.title != b.title ? a.title < b.title ? -1 : 1 : 0))
      
      worksheet.addRow(['Маршрут', 'Выход', 'Автобус', 'Первая', 'Вторая', 'Полный'])

      let row = 2
      
      sortedRoutes.forEach(route => {
        if(!route.hasActiveWays(date)) {
          return
        }
        // Нарисовать линию над маршрутом
        for(let i=0; i<6; i++) {
          worksheet
            .getRow(row)
            .getCell(i + 1)
            .border = { top: {style:'thin'}}
        }
        worksheet
            .getRow(row++)
            .getCell(1)
            .value = route.title
        let ways = Array.from(route.ways).sort((a, b) => (a.title.slice(1) != b.title.slice(1) ? a.title.slice(1) < b.title.slice(1) ? -1 : 1 : 0))
        ways.forEach(way => {
          if(!(new Way(way)).isActive(date)) {
            return
          }
          let outfitItem = outfitItems.find(value => (value.wayId == way._id))
          if(!outfitItem) {
            return
          }
          // Нарисовать линию над выходом
          for(let i=0; i<6; i++) {
            worksheet
              .getRow(row)
              .getCell(i + 1)
              .border = { top: {style:'thin'}}
          }
          worksheet
            .getRow(row)
            .getCell(2)
            .value = way.title
          let bus = buses.find(value => (value._id == outfitItem.bus))
          if(bus) {
            worksheet
              .getRow(row)
              .getCell(3)
              .value = bus.busnumber
          }
          let driver = drivers.find(value => (value._id == outfitItem.firstSmene))
          if(driver) {
            worksheet
              .getRow(row)
              .getCell(4)
              .value = driver.tabnumber
          }
          driver = drivers.find(value => (value._id == outfitItem.secondSmene))
          if(driver) {
            worksheet
              .getRow(row)
              .getCell(5)
              .value = driver.tabnumber
          }
          driver = drivers.find(value => (value._id == outfitItem.allDay))
          if(driver) {
            worksheet
              .getRow(row)
              .getCell(6)
              .value = driver.tabnumber
          }
          row++
        })
      })

      return await workbook.xlsx.writeBuffer()
  }
}
