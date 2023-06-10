import { Router } from 'express'

import { verifyJwt } from './middlewares/auth'
import { UsersController } from './controllers/UsersController'
import { HabitsController } from './controllers/HabitsController'
import { DaysController } from './controllers/DaysController'
import { SummaryController } from './controllers/SummaryController'

const routes = Router()

const usersCtrl = new UsersController()
const habitsCtrl = new HabitsController()
const daysCtrl = new DaysController()
const summaryCtrl = new SummaryController()

routes.post('/users', usersCtrl.create)
routes.post('/login', usersCtrl.login)

routes.post('/habits', verifyJwt, habitsCtrl.create)
routes.patch('/habits/:id/toggle', verifyJwt, habitsCtrl.toggle)

routes.get('/day/:date', verifyJwt, daysCtrl.show)

routes.get('/summary/:year/:month', verifyJwt, summaryCtrl.index)

export { routes }
