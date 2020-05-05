import Excel from "exceljs/dist/exceljs"

export default class DriverPhonesExcel {
    static async render({ buses, template, month }) {
        const workbook = new Excel.Workbook();

        let sortedBuses = Array.from(buses).sort((a, b) => (a.busnumber - b.busnumber))

        var worksheet = workbook.addWorksheet('main')

        let column = worksheet.getColumn(1)
        column.width = 22
        column.style = { font: { size: 14 } }
        column = worksheet.getColumn(2)
        column.width = 22
        column.style = { font: { size: 14 } }
        column = worksheet.getColumn(3)
        column.width = 17
        column.style = { font: { size: 14 } }
        column = worksheet.getColumn(4)
        column.width = 17
        column.style = { font: { size: 14 } }
        column = worksheet.getColumn(5)
        column.width = 34
        column.style = { font: { size: 14 } }

        worksheet.addRow(['Борт. номер/Вмест.', 'Марка', 'Цвет', 'Год', 'Примечание'])

        sortedBuses.forEach((bus, index) => {
            worksheet.addRow([`${bus.busnumber} ${bus.capacity}`, bus.mark, bus.color, bus.year, ''])
            for(let i=0; i<4; i++) {
                worksheet
                    .getRow(index + 2)
                    .getCell(i + 1)
                    .border = { top: { style: 'thin' } }
            }
            worksheet
                .getRow(index + 2)
                .getCell(5)
                .border = { left: { style: 'thin' }, top: { style: 'thin' } }
        })

        return await workbook.xlsx.writeBuffer();
    }
}
