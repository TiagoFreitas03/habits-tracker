import { FormEvent, useState } from "react"
import { Link } from 'react-router-dom'

import { Input } from "../components/Input"
import { api } from "../lib/axios"
import { useAuth } from "../contexts/AuthContext"

export function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { signIn } = useAuth()

	async function handleLoginFormSubmit(event: FormEvent) {
		event.preventDefault()

		try {
			const res = await api.post('login', { email, password })
			signIn(res.data.token)
		} catch (err: any) {
			alert(err.response.data.message)
		}
	}

	return (
		<div className="h-screen flex justify-center items-center">
			<form className="w-96" onSubmit={handleLoginFormSubmit}>
				<Input
					label='E-mail'
					type="email"
					id="email"
					autoFocus
					value={email}
					onChange={e => setEmail(e.target.value)}
					labelClasses="mt-8"
				/>

				<Input
					label='Senha'
					type="password"
					id="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					labelClasses="mt-8"
				/>

				<button
					type="submit"
					className={
						"w-full mt-6 rounded-lg p-4 flex gap-3 items-center justify-center font-semibold " +
						" bg-violet-600 hover:bg-violet-500 transition-colors " +
						"focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
					}
				>
					Entrar
				</button>

				<div className="text-center mt-8">
					Não tem conta? <Link to='/register' className="text-violet-400 underline">Clique aqui</Link>
				</div>
			</form>
		</div>
	)
}
