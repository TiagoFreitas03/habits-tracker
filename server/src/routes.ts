import { Router } from 'express'

import { UsersController } from './controllers/UsersController'

const routes = Router()

const usersCtrl = new UsersController()

routes.post('/users', usersCtrl.create)
routes.post('/login', usersCtrl.login)

export { routes }
