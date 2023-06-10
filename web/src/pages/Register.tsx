import { FormEvent, useState } from "react"
import { Link } from 'react-router-dom'

import { Input } from "../components/Input"
import { api } from "../lib/axios"

export function Register() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<any>()

	async function handleRegisterFormSubmit(event: FormEvent) {
		event.preventDefault()

		try {
			const res = await api.post('users', { name, email, password })
			alert(res.data.message)
			window.location.href = '/login'
		} catch (err: any) {
			alert(err.response.data.message)

			if (err.response.data.errors) {
				setErrors(err.response.data.errors)
			} else {
				setErrors({})
			}
		}
	}

	return (
		<div className="h-screen flex justify-center items-center">
			<form className="w-96" onSubmit={handleRegisterFormSubmit}>
				<Input
					label='Nome'
					type="text"
					id="name"
					autoFocus
					value={name}
					onChange={e => setName(e.target.value)}
					error={errors?.name}
					labelClasses="mt-8"
				/>

				<Input
					label='E-mail'
					type="email"
					id="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					error={errors?.email}
					labelClasses="mt-8"
				/>

				<Input
					label='Senha'
					type="password"
					id="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					error={errors?.password}
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
					Cadastrar
				</button>

				<div className="text-center mt-8">
					Já tem conta? <Link to='/login' className="text-violet-400 underline">Fazer login</Link>
				</div>
			</form>
		</div>
	)
}
