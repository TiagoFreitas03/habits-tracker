import { Request, Response } from 'express'
import { z } from 'zod'
import dayjs from 'dayjs'

import { connection } from '../database/connection'

export class SummaryController {
	async index(req: Request, res: Response) {
		const getSummaryParams = z.object({
			year: z.coerce.number({ required_error: 'Informe o ano' }),
			month: z.coerce.number({ required_error: 'Informe o mês' })
				.min(0, 'Mês inválido').max(11, 'Mês inválido')
		})

		const { year, month } = getSummaryParams.parse(req.params)

		const monthStart = new Date(year, month, 1, 0, 0, 0, 0)
		const monthEnd = dayjs(monthStart).endOf('month').toDate()

		const { user_id } = req

		const user = await connection.user.findFirst({
			where: {
				id: user_id,
				created_at: { lte: monthEnd }
			}
		})

		if (!user) {
			return res.status(404).json({ message: 'Usuário não encontrado' })
		}

		const summary = await connection.$queryRaw`
      SELECT
				d.id,
				d.date,
				(
					SELECT CAST(COUNT(*) AS FLOAT)
					FROM completed_habits c
					JOIN habits h ON h.id = c.habit_id
					WHERE c.day_id = d.id
						AND h.user_id = ${user_id}
				) AS completed,
				(
					SELECT CAST(COUNT(*) AS FLOAT)
					FROM habit_week_days hwd
					JOIN habits h ON h.id = hwd.habit_id
					WHERE hwd.week_day = CAST(strftime('%w', d.date / 1000.0, 'unixepoch') AS INT)
						AND h.created_at <= d.date
						AND h.user_id = ${user_id}
				) AS amount
			FROM days d
			WHERE d.date BETWEEN ${monthStart.getTime()} AND ${monthEnd.getTime()}
    `

		return res.json(summary)
	}
}
