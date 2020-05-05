import Excel from "exceljs/dist/exceljs"

import Report from '@/models/report'

export default class ReportExcel {
  static async render({ buses, date }) {
      const workbook = new Excel.Workbook()
      var worksheet = workbook.addWorksheet('Main')
      var report = new Report(date, buses)

      for(let i=0; i<11; i++) {
          let column = worksheet.getColumn(i+1)
          column.width = 11
          column.style = { font: { size: 14 } }
      }

      let startRowNumber = 1
      let startColumnNumber = 1

      var rowNumber = drawWorkTable(worksheet, report, 1, 1)
      rowNumber += 2
      drawMoreInfo(worksheet, report, rowNumber, startColumnNumber)

      return await workbook.xlsx.writeBuffer()

      function drawMoreInfo(worksheet, report, row, column) {

          let startRowNumber = row
          let rowNumber = 0
          let startColumnNumber = column

          let endBusesRow = 0
          let endDriversRow = 0

          worksheet
              .getRow(startRowNumber)
              .getCell(startColumnNumber)
              .value = 'Автобусы'
          worksheet
              .getRow(startRowNumber + 1)
              .getCell(startColumnNumber)
              .value = `Резерв (${report.busReserve.length})`

          startRowNumber = startRowNumber + 2
          rowNumber = startRowNumber

          report.busReserve
              .sort((a, b) => (a.busnumber - b.busnumber))
              .forEach((bus, index) => {
                  rowNumber = startRowNumber + Math.floor(index / 5)
                  worksheet
                      .getRow(rowNumber)
                      .getCell(startColumnNumber + index % 5)
                      .value = bus.busnumber
              })

          rowNumber += 2

          for (let status in report.outBuses) {
              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber)
                  .value = `${status} (${report.outBuses[status].length})`
              rowNumber++
              startRowNumber = rowNumber
              report.outBuses[status]
                  .sort((a, b) => (a.busnumber - b.busnumber))
                  .forEach((bus, index) => {
                      rowNumber = startRowNumber + Math.floor(index / 5)

                      worksheet
                          .getRow(rowNumber)
                          .getCell(startColumnNumber + index % 5)
                          .value = bus.busnumber
                  })
              rowNumber += 2
          }
          endBusesRow = rowNumber

          startRowNumber = row
          startColumnNumber += 5

          worksheet
              .getRow(startRowNumber)
              .getCell(startColumnNumber)
              .value = 'Водители'

          worksheet
              .getRow(startRowNumber + 1)
              .getCell(startColumnNumber)
              .value = `Резерв (${report.driverReserveCount})`

          startRowNumber = startRowNumber + 2
          rowNumber = startRowNumber

          worksheet
              .getRow(startRowNumber)
              .getCell(startColumnNumber)
              .value = 'Первая см.'
          worksheet
              .getRow(startRowNumber)
              .getCell(startColumnNumber + 2)
              .value = 'Вторая см.'
          worksheet
              .getRow(startRowNumber)
              .getCell(startColumnNumber + 4)
              .value = 'Полный день'

          rowNumber++
          startRowNumber = rowNumber

          report.driverReserveTable.forEach((row, index) => {
              rowNumber = startRowNumber + index
              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber)
                  .value = row['Первая см.'].map(driver => driver.tabnumber).join(', ')
              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber + 2)
                  .value = row['Вторая см.'].map(driver => driver.tabnumber).join(', ')
              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber + 4)
                  .value = row['Рабочий'].map(driver => driver.tabnumber).join(', ')
              for (let i = 0; i < 6; i++) {
                  worksheet
                      .getRow(rowNumber)
                      .getCell(startColumnNumber + i)
                      .border = { top: { style: 'thin' } }
              }
          })

          rowNumber += 2
          startRowNumber = rowNumber

          for (let status in report.outDrivers) {
              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber)
                  .value = `${status} (${report.outDrivers[status].length})`
              rowNumber++
              startRowNumber = rowNumber
              report.outDrivers[status]
                  .sort((a, b) => (a.tabnumber - b.tabnumber))
                  .forEach((driver, index) => {
                      rowNumber = startRowNumber + Math.floor(index / 6)

                      worksheet
                          .getRow(rowNumber)
                          .getCell(startColumnNumber + index % 6)
                          .value = driver.tabnumber
                  })
              rowNumber += 2
          }
          endDriversRow = rowNumber
          
          return endDriversRow
      }

      function drawWorkTable(worksheet, report, row, column) {

          let endDriversRow = row
          let startColumnNumber = column

          worksheet
              .getRow(endDriversRow)
              .getCell(startColumnNumber)
              .value = 'Рабочие'

          rowNumber++

          let returnedRow = drawColumn(
              worksheet,
              report.workTable
                  .sort((a, b) => (a['Автобус'].busnumber - b['Автобус'].busnumber))
                  .slice(0, Math.ceil(report.workTable.length / 2)),
              endDriversRow,
              startColumnNumber
          )
          drawColumn(
              worksheet,
              report.workTable
                  .sort((a, b) => (a['Автобус'].busnumber - b['Автобус'].busnumber))
                  .slice(Math.ceil(report.workTable.length / 2)),
              endDriversRow,
              startColumnNumber + 6
          )

          return returnedRow

          function drawColumn(worksheet, workTable, row, column) {
              rowNumber = row
              startColumnNumber = column

              rowNumber++

              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber)
                  .value = 'Автобус'
              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber + 2)
                  .value = 'Первая'
              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber + 3)
                  .value = 'Вторая'
              worksheet
                  .getRow(rowNumber)
                  .getCell(startColumnNumber + 4)
                  .value = 'Полный'

              rowNumber++
              startRowNumber = rowNumber

              workTable
                  .forEach((row, index) => {
                      rowNumber = startRowNumber + index
                      worksheet
                          .getRow(rowNumber)
                          .getCell(startColumnNumber)
                          .value = row['Автобус'].busnumber
                      worksheet
                          .getRow(rowNumber)
                          .getCell(startColumnNumber + 2)
                          .value = row['Первая см.'].map(driver => driver.tabnumber).join(', ')
                      worksheet
                          .getRow(rowNumber)
                          .getCell(startColumnNumber + 3)
                          .value = row['Вторая см.'].map(driver => driver.tabnumber).join(', ')
                      worksheet
                          .getRow(rowNumber)
                          .getCell(startColumnNumber + 4)
                          .value = row['Рабочий'].map(driver => driver.tabnumber).join(', ')
                      for (let i = 0; i < 5; i++) {
                          worksheet
                              .getRow(rowNumber)
                              .getCell(startColumnNumber + i)
                              .border = { top: { style: 'thin' } }
                      }
                  })
              return rowNumber
          }
      }
  }
}
