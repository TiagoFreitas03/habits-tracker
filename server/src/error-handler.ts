import { ErrorRequestHandler } from "express"
import { ZodError } from 'zod'

interface ZodValidationError {
	[key: string]: string
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
	if (error instanceof ZodError) {
		let errors: ZodValidationError = {}

		error.issues.forEach(err => errors[err.path.join('.')] = err.message)

		return res.status(400).json({ message: 'Validação falhou.', errors })
	}

	console.error(error)

	return res.status(500).json({ message: 'Erro interno do servidor.' })
}
