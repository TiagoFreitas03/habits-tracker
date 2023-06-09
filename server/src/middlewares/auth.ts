import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { connection } from '../database/connection'

interface DecodedToken {
	id: string
}

export async function verifyJwt(req: Request, res: Response, next: NextFunction) {
	const { authorization } = req.headers

	if (!authorization) {
		return res.status(401).json({ message: 'Nenhum token fornecido' })
	}

	const [_, token] = authorization.split(' ')

	const decoded = await verify(token, process.env.JWT_SECRET ?? '') as DecodedToken

	const userExists = await connection.user.findUnique({
		where: { id: decoded.id }
	})

	if (!userExists) {
		return res.status(404).json({ message: 'Usuário não encontrado' })
	}

	req.user_id = decoded.id

	return next()
}
