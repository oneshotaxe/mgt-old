import Excel from "exceljs/dist/exceljs"
import moment from 'moment'

import Driver from '@/models/driver'

export default class A4Excel {
  static async render({ buses, template, month }) {

      let year = '2020'

      let sortedBuses = Array.from(buses)
      sortedBuses = sortedBuses.sort((a, b) => {
          return a.busnumber - b.busnumber
      })

      let listCount = Math.ceil(sortedBuses.length / 5)
      let pages = []

      for (let i = 0; i < listCount; i++) {
          pages.push([])
          for (let j = 0; j < 5; j++) {
              pages[i].push(sortedBuses[i * 5 + j] || {})
          }
      }

      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(template)

      var worksheet = workbook.getWorksheet('Page 1')

      for (let i = 1; i < pages.length; i++) {
          let copySheet = workbook.addWorksheet("Sheet")
          copySheet.model = Object.assign(worksheet.model, {
              mergeCells: worksheet.model.merges
          });
          copySheet.name = "Page " + (1 + i)
      }

      for (let i = 0; i < pages.length; i++) {
          worksheet = workbook.getWorksheet('Page ' + (i + 1))
          let rowNumber = 10
          let columnNumber = 1

          worksheet.getRow(1)
              .getCell(44)
              .value = i + 1

          pages[i].forEach((bus, index) => {
              if (!bus.busnumber) {
                  return
              }

              drawBus(worksheet, bus, rowNumber + index * 8, columnNumber)
          })
      }

      return await workbook.xlsx.writeBuffer()

      function drawBus(worksheet, bus, row, column) {
          let rowNumber = row
          let columnNumber = column

          worksheet.getRow(rowNumber)
              .getCell(columnNumber + 2)
              .value = bus.busnumber

          let shifts = []
          switch (bus.drivers.length) {
              case 1:
                  shifts = [3]
                  break
              case 2:
                  shifts = [1, 5]
                  break
              case 3:
                  shifts = [0, 3, 6]
                  break
              case 4:
                  shifts = [0, 2, 4, 6]
                  break
          }

          bus.drivers.forEach((driverData, index) => {
              if (!driverData.tabnumber) {
                  return
              }
              let driver = new Driver(driverData)
              drawDriver(worksheet, driver, rowNumber + shifts[index], columnNumber)
          })

          if (!bus.way) {
              return
          }

          worksheet.getRow(rowNumber)
              .getCell(1)
              .value = bus.way.route.title

          worksheet.getRow(rowNumber)
              .getCell(2)
              .value = bus.way.title

          worksheet.getRow(rowNumber)
              .getCell(41)
              .value = `Выход: ${bus.way.route.title}/${bus.way.title}`

          worksheet.getRow(rowNumber + 2)
              .getCell(41)
              .value = `1 смена: ${bus.way.times.durationFirstSmene || ''}`

          worksheet.getRow(rowNumber + 2)
              .getCell(44)
              .value = `2 смена: ${bus.way.times.durationSecondSmene || ''}`

          worksheet.getRow(rowNumber + 3)
              .getCell(41)
              .value = `Выезд из парка: ${bus.way.times.outPark || ''}`

          worksheet.getRow(rowNumber + 4)
              .getCell(41)
              .value = `Время смены: ${bus.way.times.change || ''}`

          worksheet.getRow(rowNumber + 5)
              .getCell(41)
              .value = `Окончание работы: ${bus.way.times.endWork || ''}`

          worksheet.getRow(rowNumber + 7)
              .getCell(41)
              .value = `1 смена: ${bus.way.times.lunchFirstSmene || ''}`

          worksheet.getRow(rowNumber + 7)
              .getCell(44)
              .value = `2 смена: ${bus.way.times.lunchSecondSmene || ''}`

          function drawDriver(worksheet, driver, row, column) {
              let rowNumber = row
              let columnNumber = column + 1

              worksheet.getRow(rowNumber)
                  .getCell(columnNumber + 4)
                  .value = driver.shortName
              worksheet.getRow(rowNumber)
                  .getCell(columnNumber + 5)
                  .value = driver.tabnumber

              const graphicName = driver.graphicName

              worksheet.getRow(rowNumber + 1)
                  .getCell(columnNumber + 4)
                  .value = `(ЛВ${graphicName}) ${graphicName[0]} раб. - ${graphicName[1]} вых.`

              let number_of_days = moment(`${year}-${month}`, "YYYY-MM").daysInMonth()
              let statuses = driver.statusesByDate({ date: `${year}-${month}-01`, count: number_of_days, isShort: true })

              for (let i = 0; i < number_of_days; i++) {
                  worksheet.getRow(rowNumber)
                      .getCell(columnNumber + 8 + i)
                      .value = statuses[i]
              }
          }
      }
  }
}
