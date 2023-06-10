import dayjs from "dayjs"

export type DateOrNull = Date | null

export function generateReferenceDates(year: number, month: number) {
	const monthFirstDay = new Date(year, month, 1, 0, 0, 0, 0)
	const monthLastDay = dayjs(monthFirstDay).endOf('month').toDate()
	const today = new Date()

	const dates: DateOrNull[] = []
	const endDate = today.getTime() < monthLastDay.getTime() ? today : monthLastDay
	let compareDate = dayjs(monthFirstDay)

	while (compareDate.isBefore(endDate)) {
		dates.push(compareDate.toDate())
		compareDate = compareDate.add(1, 'day')
	}

	let firstWeekDay = dates[0]!.getDay()
	while (firstWeekDay > 0) {
		dates.unshift(null)
		firstWeekDay--
	}

	while (dates.length < (6 * 7)) {
		dates.push(null)
	}

	return dates
}
