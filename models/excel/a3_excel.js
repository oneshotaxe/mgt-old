import Excel from "exceljs/dist/exceljs"
import moment from 'moment'

import Driver from '@/models/driver'

export default class A3Excel {
  static async render({ buses, template, month }) {
      let year = '2020'

      let sortedBuses = Array.from(buses)
      sortedBuses = sortedBuses.sort((a, b) => {
          return a.busnumber - b.busnumber
      })

      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(template)

      let listCount = Math.ceil(sortedBuses.length / 4)
      if (listCount % 2 == 0) {
          listCount++
      }

      let pages = []
      for (let i = 0; i < listCount; i++) {
          pages.push([])
          for (let j = 0; j < 4; j++) {
              pages[i].push(sortedBuses[i * 4 + j] || {})
          }
      }
      // Вставить в начало, чтобы оборот первого листа был пустым
      pages.unshift([{}, {}, {}, {}])
      let N = pages.length

      var worksheet = workbook.getWorksheet('Page 1')
      for (let i = 1; i < N; i++) {
          let copySheet = workbook.addWorksheet("Sheet")
          copySheet.model = Object.assign(worksheet.model, {
              mergeCells: worksheet.model.merges
          });
          copySheet.name = "Page " + (1 + i)
      }

      for (let i = 0; i < N / 2; i++) {
          worksheet = workbook.getWorksheet('Page ' + (i * 2 + 1))

          drawLeft(worksheet, pages[i + 1], i + 1)
          drawRight(worksheet, pages[N - (i + 1)], N - (i + 1))

          worksheet = workbook.getWorksheet('Page ' + (i * 2 + 2))

          drawLeft(worksheet, pages[(N - i) % N], (N - i) % N)
          drawRight(worksheet, pages[i], i)
      }

      return await workbook.xlsx.writeBuffer();

      function drawLeft(worksheet, page, pageNumber = 0) {
          let rowNumber = 9
          let columnNumber = 2

          worksheet.getRow(1)
              .getCell(2)
              .value = pageNumber

          page.forEach((bus) => {
              drawLeftBus(worksheet, bus, rowNumber, columnNumber)
              rowNumber += 8
          })

          function drawLeftBus(worksheet, bus, row, column) {
              let rowNumber = row
              let columnNumber = column

              if (!bus.busnumber) {
                  return
              }

              worksheet.getRow(rowNumber)
                  .getCell(columnNumber)
                  .value = bus.busnumber

              let shifts = []
              switch (bus.drivers.length) {
                  case 1:
                      shifts = [4]
                      break
                  case 2:
                      shifts = [2, 6]
                      break
                  case 3:
                      shifts = [1, 4, 7]
                      break
                  case 4:
                      shifts = [1, 3, 5, 7]
                      break
              }

              bus.drivers.forEach((driverData, index) => {
                  let driver = new Driver(driverData)
                  drawLeftDriver(worksheet, driver, rowNumber + shifts[index], columnNumber)
              })

              function drawLeftDriver(worksheet, driver, row, column) {
                  let rowNumber = row
                  let columnNumber = column

                  worksheet.getRow(rowNumber)
                      .getCell(columnNumber + 1)
                      .value = driver.shortName
                  worksheet.getRow(rowNumber)
                      .getCell(columnNumber + 2)
                      .value = driver.tabnumber

                  let statuses = driver.statusesByDate({ date: `${year}-${month}-01`, count: 12, isShort: true })

                  for (let i = 0; i < 12; i++) {
                      worksheet.getRow(rowNumber)
                          .getCell(columnNumber + 4 + i)
                          .value = statuses[i]
                  }

              }
          }
      }
      function drawRight(worksheet, page, pageNumber = 0) {
          let rowNumber = 9
          let columnNumber = 20

          worksheet.getRow(1)
              .getCell(44)
              .value = pageNumber

          page.forEach((bus) => {
              drawRightBus(worksheet, bus, rowNumber, columnNumber)
              rowNumber += 8
          })

          function drawRightBus(worksheet, bus, row, column) {
              let rowNumber = row
              let columnNumber = column

              if (!bus.busnumber) {
                  return
              }

              let shifts = []
              switch (bus.drivers.length) {
                  case 1:
                      shifts = [4]
                      break
                  case 2:
                      shifts = [2, 6]
                      break
                  case 3:
                      shifts = [1, 4, 7]
                      break
                  case 4:
                      shifts = [1, 3, 5, 7]
                      break
              }

              bus.drivers.forEach((driverData, index) => {
                  let driver = new Driver(driverData)

                  let number_of_days = moment(`${year}-${month}`, "YYYY-MM").daysInMonth()
                  let statuses = driver.statusesByDate({ date: `${year}-${month}-13`, count: number_of_days - 12, isShort: true })

                  for (let i = 0; i < number_of_days - 12; i++) {
                      worksheet.getRow(rowNumber + shifts[index])
                          .getCell(columnNumber + i)
                          .value = statuses[i]
                  }
              })

              if (!bus.way) {
                  return
              }

              worksheet.getRow(rowNumber)
                  .getCell(columnNumber + 19)
                  .value = `Выход: ${bus.way.route.title}/${bus.way.title}`

              worksheet.getRow(rowNumber + 2)
                  .getCell(columnNumber + 19)
                  .value = `1 смена: ${bus.way.times.durationFirstSmene || ''}`

              worksheet.getRow(rowNumber + 2)
                  .getCell(columnNumber + 22)
                  .value = `2 смена: ${bus.way.times.durationSecondSmene || ''}`

              worksheet.getRow(rowNumber + 3)
                  .getCell(columnNumber + 19)
                  .value = `Выезд из парка: ${bus.way.times.outPark || ''}`

              worksheet.getRow(rowNumber + 4)
                  .getCell(columnNumber + 19)
                  .value = `Время смены: ${bus.way.times.change || ''}`

              worksheet.getRow(rowNumber + 5)
                  .getCell(columnNumber + 19)
                  .value = `Окончание работы: ${bus.way.times.endWork || ''}`

              worksheet.getRow(rowNumber + 7)
                  .getCell(columnNumber + 19)
                  .value = `1 смена: ${bus.way.times.lunchFirstSmene || ''}`

              worksheet.getRow(rowNumber + 7)
                  .getCell(columnNumber + 22)
                  .value = `2 смена: ${bus.way.times.lunchSecondSmene || ''}`

          }
      }

  }
}
