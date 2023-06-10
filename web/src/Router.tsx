import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'

import { NotFound } from "./pages/NotFound"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"

export function Router() {
	const { signed, loading } = useAuth()

	if (loading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<h1>Carregando...</h1>
			</div>
		)
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route element={signed ? <Outlet /> : <Navigate to='/login' />}>
					<Route path='/' element={<Home />} />
				</Route>

				<Route element={signed ? <Navigate to='/' /> : <Outlet />}>
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login />} />
				</Route>

				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}
