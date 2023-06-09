import { Request, Response } from 'express'
import { z } from 'zod'
import dayjs from 'dayjs'

import { connection } from '../database/connection'

export class HabitsController {
	async create(req: Request, res: Response) {
		const { user_id } = req

		const createHabitBody = z.object({
			title: z.string({ required_error: 'Informe o hábito' }),
			weekDays: z.array(
				z.number({ required_error: 'Informe o dia da semana', invalid_type_error: 'Dia inválido' })
					.min(0, 'Dia inválido').max(6, 'Dia inválido'), { required_error: 'Informe o período' }
			).min(1, 'Selecione ao menos um dia da semana')
		})

		const { title, weekDays } = createHabitBody.parse(req.body)

		const today = dayjs().startOf('day').toDate()

		await connection.habit.create({
			data: {
				title,
				created_at: today,
				user_id,
				weekDays: {
          create: weekDays.map((weekDay) => {
            return { week_day: weekDay }
          })
        }
			}
		})

		return res.status(201).json({ message: 'Hábito cadastrado' })
	}

	async toggle(req: Request, res: Response) {
		const { user_id } = req

		const toggleHabitParams = z.string({ required_error: 'Informe o id do hábito' }).uuid()
		const id = toggleHabitParams.parse(req.params.id)

		const habit = await connection.habit.findFirst({
			where: { id, user_id },
			include: { weekDays: true }
		})

		if (!habit) {
			return res.status(404).json({ message: 'Hábito não encontrado' })
		}

		const today = dayjs().startOf('day').toDate()

		if (!habit.weekDays.map(wd => wd.week_day).includes(today.getDay())) {
			return res.status(400).json({ message: 'Esse hábito não pode ser completado hoje' })
		}

		let day = await connection.day.findUnique({
			where: { date: today }
		})

		if (!day) {
			day = await connection.day.create({
				data: { date: today }
			})
		}

		const dayHabit = await connection.completedHabits.findUnique({
			where: {
				day_id_habit_id: { day_id: day.id, habit_id: id }
			}
		})

		if (dayHabit) {
			await connection.completedHabits.delete({
				where: { id: dayHabit.id }
			})

			return res.json({ message: "Hábito 'descompletado'" })
		} else {
			await connection.completedHabits.create({
				data: { day_id: day.id, habit_id: id }
			})

			return res.json({ message: 'Hábito completado' })
		}
	}
}
