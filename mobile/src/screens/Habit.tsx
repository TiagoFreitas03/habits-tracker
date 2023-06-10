import { useEffect, useState } from "react"
import { View, ScrollView, Text, Alert } from "react-native"
import { useRoute } from '@react-navigation/native'
import dayjs from "dayjs"
import clsx from "clsx"

import { BackButton } from "../components/BackButton"
import { ProgressBar } from "../components/ProgressBar"
import { Checkbox } from "../components/Checkbox"
import { Loading } from "../components/Loading"
import { api } from "../lib/axios"
import { generateProgressPercentage } from "../utils/generate-progress-percentage"
import { HabitsEmpty } from "../components/HabitsEmpty"

interface Params {
	date: string
}

interface DayInfoProps {
	completedHabits: string[]
	possibleHabits: {
		id: string
		title: string
	}[]
}

export function Habit() {
	const [loading, setLoading] = useState(true)
	const [dayInfo, setDayInfo] = useState<DayInfoProps>()

	const route = useRoute()
	const { date } = route.params as Params

	const parsedDate = dayjs(date)
	const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
	const dayOfWeek = parsedDate.format('dddd')
	const dayAndMonth = parsedDate.format('DD/MM')

	const habitsProgess = dayInfo?.possibleHabits.length ?
		generateProgressPercentage(dayInfo.possibleHabits.length, dayInfo.completedHabits.length) :
		0

	async function fetchHabits() {
		try {
			setLoading(true)

			const res = await api.get(`/day/${date}`)
			setDayInfo(res.data)

		} catch (err) {
			console.log(err)
			Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
		} finally {
			setLoading(false)
		}
	}

	async function handleToggleHabit(habitId: string) {
		try {
			await api.patch(`/habits/${habitId}/toggle`)
		} catch (error) {
			console.log(error)
			Alert.alert('Ops', 'Não foi possível atualizar o status do hábito')
			return
		}

		const isHabitCompleted = dayInfo!.completedHabits.includes(habitId)

		let completedHabits: string[] = []

		if (isHabitCompleted) {
			completedHabits = dayInfo!.completedHabits.filter(id => id !== habitId)
		} else {
			completedHabits = [...dayInfo!.completedHabits, habitId]
		}

		setDayInfo({
			possibleHabits: dayInfo!.possibleHabits,
			completedHabits
		})
	}

	useEffect(() => {
		fetchHabits()
	}, [])

	if (loading) {
		return <Loading />
	}

	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<BackButton />

				<Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
					{dayOfWeek}
				</Text>

				<Text className="text-white font-extrabold text-3xl">
					{dayAndMonth}
				</Text>

				<ProgressBar progress={habitsProgess} />

				<View className={clsx("mt-6", {
					['opacity-50']: isDateInPast
				})}>
					{
						dayInfo?.possibleHabits.length ?
							dayInfo.possibleHabits.map(habit => (
								<Checkbox
									key={habit.id}
									title={habit.title}
									checked={dayInfo.completedHabits.includes(habit.id)}
									disabled={isDateInPast}
									onPress={() => handleToggleHabit(habit.id)}
								/>
							))
							: <HabitsEmpty />
					}
				</View>

				{
					isDateInPast && (
						<Text className="text-white mt-10 text-center">
							Você não pode editar hábitos de uma data passada
						</Text>
					)
				}
			</ScrollView>
		</View>
	)
}
