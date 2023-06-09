import 'dotenv/config'
import express from 'express'

const server = express()

const port = Number(process.env.PORT) ?? 3333

server.listen(port, () => {
	console.log(`server running on port ${port}`)
})
