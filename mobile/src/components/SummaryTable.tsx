import { useState, useEffect, useCallback } from 'react'
import { View, Text, Alert } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import dayjs from "dayjs"

import { api } from '../lib/axios'
import { generateReferenceDates, DateOrNull } from '../utils/generate-reference-dates'
import { HabitDay, DAY_SIZE } from "../components/HabitDay"
import { Loading } from "../components/Loading"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

interface SummaryTableProps {
	year: number
	month: number
}

type Summary = {
	id: string
	date: string
	amount: number
	completed: number
}[]

export function SummaryTable({ year, month }: SummaryTableProps) {
	const { navigate } = useNavigation()

	const [summary, setSummary] = useState<Summary>()
	const [loading, setLoading] = useState(true)
	const [summaryDates, setSummaryDates] = useState<DateOrNull[]>([])

	async function fetchData() {
		try {
			setLoading(true)
			const res = await api.get(`summary/${year}/${month}`)
			setSummary(res.data)
			setSummaryDates(generateReferenceDates(year, month))
		} catch (error) {
			Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos')
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [year, month])

	useFocusEffect(useCallback(() => {
		fetchData()
	}, []))

	if (loading) {
		return <Loading />
	}

	return (
		<>
			<View className="flex-row mt-6 mb-2">
				{
					weekDays.map((weekDay, i) => (
						<Text
							key={`${weekDay}=${i}`}
							className='text-zinc-400 text-xl font-bold text-center mx-1'
							style={{ width: DAY_SIZE }}
						>
							{weekDay}
						</Text>
					))
				}
			</View>

			{
				summary &&
				<View className="flex-row flex-wrap">
					{
						summaryDates.map(d => {
							const dayWithHabits = summary.find(day => dayjs(d).isSame(day.date, 'day'))

							return d ? (
								<HabitDay
									key={d.toISOString()}
									date={d}
									amountOfHabits={dayWithHabits?.amount}
									amountCompleted={dayWithHabits?.completed}
									onPress={() => navigate('habit', { date: d.toISOString() })}
								/>
							) : (
								<View
									key={Math.random() * 1000}
									style={{ width: DAY_SIZE, height: DAY_SIZE }}
									className="rounded-lg border-2 m-1"
								/>
							)
						})
					}
				</View>
			}
		</>
	)
}
