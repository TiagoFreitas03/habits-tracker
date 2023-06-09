import { Router } from 'express'

import { UsersController } from './controllers/UsersController'

const routes = Router()

const usersCtrl = new UsersController()

routes.post('/users', usersCtrl.create)

export { routes }
