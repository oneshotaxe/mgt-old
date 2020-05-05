import Excel from "exceljs/dist/exceljs"

export default class DriverPhonesExcel {
    static async render({ drivers, template, month }) {
        const workbook = new Excel.Workbook();

        let sortedDrivers = Array.from(drivers).sort((a, b) => (a.tabnumber - b.tabnumber))

        var worksheet = workbook.addWorksheet('main')

        let column = worksheet.getColumn(1)
        column.width = 16
        column.style = { font: { size: 14 } }
        column = worksheet.getColumn(2)
        column.width = 44
        column.style = { font: { size: 14 } }
        column = worksheet.getColumn(3)
        column.width = 33
        column.style = { font: { size: 14 } }

        worksheet.addRow(['Таб. номер', 'Ф.И.О.', 'Номера тел.'])

        let row_number = 1
        sortedDrivers.forEach(driver => {
            for(let i=0; i<3; i++) {
                worksheet
                    .getRow(row_number)
                    .getCell(i + 1)
                    .border = { bottom: { style: 'thin' } }
            }
            let phones = driver.phones.map(phone => phone.value)
            worksheet.addRow([driver.tabnumber, driver.name, phones[0] || ''])
            if(phones.length > 1) {
                for(let i=1; i<phones.length; i++) {
                    worksheet.addRow(['', '', phones[i]])
                    row_number++
                }
            }
            row_number++
        })

        return await workbook.xlsx.writeBuffer();
    }
}
