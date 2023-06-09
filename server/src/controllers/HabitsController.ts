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
}
