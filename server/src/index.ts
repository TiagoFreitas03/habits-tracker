import 'express-async-errors'
import 'dotenv/config'
import express from 'express'

import { routes } from './routes'
import { errorHandler } from './error-handler'

const server = express()

const port = Number(process.env.PORT) ?? 3333

server.use(express.json())
server.use(routes)
server.use(errorHandler)

server.listen(port, () => {
	console.log(`server running on port ${port}`)
})
