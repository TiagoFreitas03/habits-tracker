import { useState } from "react"
import { Text, View, Pressable } from "react-native"
import { Feather } from '@expo/vector-icons'
import dayjs from "dayjs"
import colors from 'tailwindcss/colors'

import { useAuth } from "../contexts/AuthContext"
import { Header } from "../components/Header"
import clsx from "clsx"
import { SummaryTable } from "../components/SummaryTable"

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function Home() {
	const { user } = useAuth()

	const [date, setDate] = useState(new Date())

	const [year, month] = [date.getFullYear(), date.getMonth()]

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
		<View className="flex-1 bg-background px-8 pt-16">
			<Header />

			<View className="flex flex-row justify-between items-center py-8">
				<Pressable
					className={clsx("bg-violet-600 flex justify-center items-center w-10 h-10 rounded-lg", {
							"bg-zinc-400" : month === user!.created_at.getMonth() && year === user!.created_at.getFullYear(),
						})
					}
					onPress={handleDecrementDate}
					disabled={month === user!.created_at.getMonth() && year === user!.created_at.getFullYear()}
				>
					<Feather name="chevrons-left" size={20} color={colors.white} />
				</Pressable>

				<Text className="text-white text-lg">{months[month]} {year}</Text>

				<Pressable
					className={clsx("bg-violet-600 flex justify-center items-center w-10 h-10 rounded-lg", {
						"bg-zinc-400" : month === new Date().getMonth() && year === new Date().getFullYear()
					})
				}
					onPress={handleIncrementDate}
					disabled={month === new Date().getMonth() && year === new Date().getFullYear()}
				>
					<Feather name="chevrons-right" size={20} color={colors.white} />
				</Pressable>

			</View>

			<SummaryTable year={year} month={month} />
		</View>
	)
}
