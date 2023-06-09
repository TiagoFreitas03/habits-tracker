import { FormEvent, useState } from "react"
import { Check } from "phosphor-react"
import * as Checkbox from '@radix-ui/react-checkbox'

import { api } from "../lib/axios"
import { Input } from "./Input"

const availableWeekDays = [
	'Domingo',
	'Segunda-feira',
	'Terça-feira',
	'Quarta-feira',
	'Quinta-feira',
	'Sexta-feira',
	'Sabádo'
]

export function NewHabitForm() {
	const [title, setTitle] = useState('')
	const [weekDays, setWeekDays] = useState<number[]>([])

	async function createNewHabit(e: FormEvent) {
		e.preventDefault()

		if (!title || weekDays.length === 0) {
			return
		}

		try {
			await api.post('habits', { title, weekDays })
			setTitle('')
			setWeekDays([])
			alert('Hábito criado com sucesso')
			window.location.reload()
		} catch (err: any) {
			alert(err.response.data.message)
		}
	}

	function handleToggleWeekDay(weekDay: number) {
		if (weekDays.includes(weekDay)) {
			setWeekDays(prevState => prevState.filter(day => day !== weekDay))
		} else {
			setWeekDays(prevState => [...prevState, weekDay])
		}
	}

	return (
		<form className="w-full flex flex-col mt-6" onSubmit={createNewHabit}>
			<Input
				label="Qual seu comprometimento?"
				type="text"
				id="title"
				placeholder="ex.: Exercícios, dormir bem, etc..."
				autoFocus
				onChange={e => setTitle(e.target.value)}
				value={title}
			/>

			<label htmlFor=""  className="font-semibold leading-tight mt-2">
				Qual a recorrência?
			</label>

			<div className="flex flex-col gap-2 mt-3">
				{
					availableWeekDays.map((weekDay, index) => (
						<Checkbox.Root
							key={weekDay}
							className='flex items-center gap-3 group focus:outline-none'
							checked={weekDays.includes(index)}
							onCheckedChange={() => handleToggleWeekDay(index)}
						>
							<div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background'>
								<Checkbox.Indicator>
									<Check size={20} className="text-white" />
								</Checkbox.Indicator>
							</div>

							<span className='text-white leading-tight'>{weekDay}</span>
						</Checkbox.Root>
					))
				}
			</div>

			<button
				type="submit"
				className="mt-6 rounded-lg p-4 flex gap-3 items-center justify-center font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
			>
				<Check size={20} weight="bold" />
				Confirmar
			</button>
		</form>
	)
}
