import { Request, Response } from 'express'
import { z } from 'zod'
import dayjs from 'dayjs'

import { connection } from '../database/connection'

export class DaysController {
	async show(req: Request, res: Response) {
		const { user_id } = req

		const getDayParams = z.object({
			date: z.coerce.date({ required_error: 'Data não informada', invalid_type_error: 'Data inválida' })
		})

		const { date } = getDayParams.parse(req.params)

		const parsedDate = dayjs(date).startOf('day')
		const weekDay = parsedDate.get('day')

		const possibleHabits = await connection.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
				user_id,
        weekDays: {
          some: { week_day: weekDay }
        }
      }
    })

		const day = await connection.day.findFirst({
      where: {
        date: parsedDate.toDate(),
				completed: {
					every: {
						habit: { user_id }
					}
				}
      },
      include: { completed: true }
    })

		const completedHabits = day?.completed.map(completedHabit => completedHabit.habit_id) ?? []

		return res.json({ possibleHabits, completedHabits })
	}
}
