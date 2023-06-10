import { useEffect, useState } from "react"
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react'
import dayjs from "dayjs"

import { useAuth } from "../contexts/AuthContext"
import { api } from "../lib/axios"
import { HabitDay } from "./HabitDay"
import { generateReferenceDates, DateOrNull } from "../utils/generate-reference-dates"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

type Summary = {
	id: string
	date: string
	amount: number
	completed: number
}[]

export function SummaryTable() {
	const { user } = useAuth()

	const [date, setDate] = useState(new Date())
	const [summary, setSummary] = useState<Summary>([])

	const [year, month] = [date.getFullYear(), date.getMonth()]

	const [summaryDates, setSummaryDates] = useState<DateOrNull[]>([])

	useEffect(() => {
		api.get(`summary/${year}/${month}`).then(res => {
			setSummary(res.data)
			setSummaryDates(generateReferenceDates(year, month))
		})
	}, [year, month])

	function handleDecrementDate() {
		const d = dayjs(date).subtract(1, 'month')

		if (d.endOf('month').isAfter(user!.created_at)) {
			setDate(d.toDate())
		}
	}

	const handleIncrementDate = () => {
		const d = dayjs(date).add(1, 'month')

		if (d.startOf('month').isBefore(dayjs(new Date()))) {
			setDate(d.toDate())
		}
	}

	return (
		<div>
			<div className="w-full flex justify-between items-center mb-10 px-4">
				<button
					onClick={handleDecrementDate}
					className="bg-violet-600 w-10 h-10 flex justify-center items-center rounded-lg disabled:bg-zinc-400"
					disabled={month === user!.created_at.getMonth() && year === user!.created_at.getFullYear()}
				>
					<CaretDoubleLeft />
				</button>

				<span className="text-zinc-200 text-xl font-bold">
					{months[month]} {year}
				</span>

				<button
					onClick={handleIncrementDate}
					className="bg-violet-600 w-10 h-10 flex justify-center items-center rounded-lg disabled:bg-zinc-400"
					disabled={month === new Date().getMonth() && year === new Date().getFullYear()}
				>
					<CaretDoubleRight />
				</button>
			</div>

			<div className="w-full flex flex-col items-center">
				<div className="grid grid-cols-7 grid-flow-col gap-4">
					{weekDays.map((weekDay, index) => {
						return (
							<div
								key={`${weekDay}-${index}`}
								className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
							>
								{weekDay}
							</div>
						)
					})}
				</div>

				<div className="grid grid-cols-7 grid-flow-row gap-4">
					{
						summaryDates.map((d) => {
							const dayInSummary = summary.find(day => dayjs(d).isSame(day.date, 'day'))

							return d ? (
								<HabitDay
									key={d.toString()}
									date={d}
									amount={dayInSummary?.amount}
									defaultCompleted={dayInSummary?.completed}
								/>
							) : (
								<span key={Math.random() * 1000} className="w-10 h-10 bg-black rounded-lg" />
							)
						}
					)}
				</div>
			</div>
		</div>
	)
}
