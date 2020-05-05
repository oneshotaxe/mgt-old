import Excel from "exceljs/dist/exceljs"

export default class AgreementExcel {
  static async render({ drivers, template, month }) {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(template)

      let sortedDrivers = Array.from(drivers).sort((a, b) => (a.tabnumber - b.tabnumber)) 

      var worksheet = workbook.getWorksheet('main')

      let text_month = [
          'январе',
          'феврале',
          'марте',
          'апреле',
          'мае',
          'июне',
          'июле',
          'фвгусте',
          'сентябре',
          'октябре',
          'ноябре',
          'декабре'
      ]

      worksheet.getRow(1)
          .getCell(1)
          .value = `Администрация Филиала "Юго-Западный", в лице директора  Р.А. Езохова, \
предлагает нижеперечисленным водителям 13-ой автоколонны выполнять сверхурочную \
работу за пределами установленной продолжительности рабочего времени (баланса), \
а так же работу в выходные, праздничные дни в ${text_month[+month - 1]} 2019  года.`

      var rowNumber = 3
      var columnNumber = 0
      var globalColumnNumber = 0
      sortedDrivers.forEach(driver => {
          columnNumber = 2 + globalColumnNumber * 4
          worksheet.getRow(rowNumber)
              .getCell(columnNumber)
              .value = driver.tabnumber
          columnNumber = 3 + globalColumnNumber * 4
          worksheet.getRow(rowNumber)
              .getCell(columnNumber)
              .value = driver.shortName
          rowNumber++
          if (rowNumber == 51) {
              rowNumber = 3
              globalColumnNumber++
          }
      })

      return await workbook.xlsx.writeBuffer();
  }
}
