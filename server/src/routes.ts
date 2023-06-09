import { Router } from 'express'

import { verifyJwt } from './middlewares/auth'
import { UsersController } from './controllers/UsersController'
import { HabitsController } from './controllers/HabitsController'

const routes = Router()

const usersCtrl = new UsersController()
const habitsCtrl = new HabitsController()

routes.post('/users', usersCtrl.create)
routes.post('/login', usersCtrl.login)

routes.post('/habits', verifyJwt, habitsCtrl.create)

export { routes }
