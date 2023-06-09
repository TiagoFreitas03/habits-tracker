import { Request, Response } from 'express'
import { z } from 'zod'
import { hash as encrypt } from 'bcrypt'

import { connection } from '../database/connection'

export class UsersController {
	async create(req: Request, res: Response) {
		const createUserBody = z.object({
			email: z.string({ required_error: 'Informe seu e-mail' }).email('E-mail inválido'),
			password: z.string({ required_error: 'Informe sua senha' }).min(6, 'Senha muito curta'),
			name: z.string({ required_error: 'Informe seu nome' })
		})

		const { email, password, name } = createUserBody.parse(req.body)

		const userExists = await connection.user.findUnique({
			where: { email }
		})

		if (userExists) {
			return res.status(400).json({ message: 'Já existe um usuário com este e-mail' })
		}

		await connection.user.create({
			data: {
				email,
				password: await encrypt(password, 8),
				name
			}
		})

		return res.status(201).json({ message: 'Usuário cadastrado' })
	}
}
