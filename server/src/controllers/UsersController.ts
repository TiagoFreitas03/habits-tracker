import 'dotenv/config'
import { Request, Response } from 'express'
import { z } from 'zod'
import { hash as encrypt, compare as comparePassword } from 'bcrypt'
import { sign as signJwt } from 'jsonwebtoken'

import { connection } from '../database/connection'

export class UsersController {
	async create(req: Request, res: Response) {
		const createUserBody = z.object({
			email: z.string({ required_error: 'Informe seu e-mail' }).email('E-mail inválido'),
			password: z.string({ required_error: 'Informe sua senha' }).min(6, 'Senha muito curta'),
			name: z.string({ required_error: 'Informe seu nome' }).min(1, 'Informe seu nome')
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

	async login(req: Request, res: Response) {
		const authenticateUserBody = z.object({
			email: z.string({ required_error: 'Informe o e-mail' }),
			password: z.string({ required_error: 'Informe a senha' })
		})

		const { email, password } = authenticateUserBody.parse(req.body)

		const user = await connection.user.findUnique({
			where: { email }
		})

		if (!user || !(await comparePassword(password, user.password))) {
			return res.status(400).json({ message: 'Usuário e/ou senha incorreto(s)' })
		}

		const token = signJwt({ id: user.id }, process.env.JWT_SECRET || 'secret')

		return res.json({
			message: 'Usuário autenticado',
			token,
			name: user.name,
			created_at: user.created_at
		})
	}
}
