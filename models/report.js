import Driver from '@/models/driver'

export default class Report {
    constructor(date, buses) {
        this.errors = []
        this.workTable = []
        this.driverReserveCount = 0
        this.driverReserveTable = []
        this.busReserve = []
        this.outDrivers = {
            'Выходной': [],
            'Больничный': [],
            'Отпуск': []
        }
        this.outBuses = {
            'Ремонт': [],
            'СВАРЗ': []
        }
        buses.forEach((bus) => {
            let row = { 'Рабочий': [], 'Первая см.': [], 'Вторая см.': [] }
            let workedDriversCount = 0
            bus.drivers.forEach((driver) => {
                driver = new Driver(driver)
                let status = driver.statusesByDate({ date: date, count: 1, isShort: false, withExceptions: true })[0].status
                if (!status) {
                    this.errors.push(`У водителя ${driver.tabnumber} нет статуса`)
                    return
                }
                if (['Рабочий', 'Первая см.', 'Вторая см.'].includes(status)) {
                    workedDriversCount++
                    row[status].push(driver)
                } else {
                    this.outDrivers[status].push(driver)
                }
            })
            if (['Ремонт', 'СВАРЗ', 'Долгостой'].includes(bus.status)) {
                if (bus.status == 'Долгостой') {
                    this.outBuses['Ремонт'].push(bus)
                } else {
                    this.outBuses[bus.status].push(bus)
                }
                if (workedDriversCount !== 0) {
                    this.driverReserveCount += workedDriversCount
                    row['Автобус'] = Object.assign({}, bus)
                    row['Автобус'].busnumber += ` ${bus.status}`
                    this.driverReserveTable.push(row)
                }
            } else {
                if (workedDriversCount === 0) {
                    this.busReserve.push(bus)
                } else {
                    row['Автобус'] = bus
                    this.workTable.push(row)
                }
            }
        })
        this.workTable = this.workTable.concat(
            this.busReserve.map(bus => ({ 'Автобус': bus, 'Первая см.': [], 'Вторая см.': [], 'Рабочий': [] }))
        )
        this.workTable = this.workTable.concat(
            this.driverReserveTable
        )
    }
}