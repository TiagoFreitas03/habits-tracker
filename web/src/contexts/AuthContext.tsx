import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import { api } from '../lib/axios'

interface ContextProps {
	children: ReactNode
}

interface User {
	name: string
	created_at: Date
}

interface AuthContextData {
	token: string
	signed: boolean
	loading: boolean
	user: User | undefined
	signIn: (token: string, user: User) => void
	signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: ContextProps) {
	const [token, setToken] = useState('')
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState<User>()

	function setApiHeader(jwt: string) {
		api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

		setToken(jwt)
	}

	useEffect(() => {
		const storagedToken = localStorage.getItem('token')
		const storagedUser = localStorage.getItem('user')

		if (storagedToken) {
			setApiHeader(storagedToken)
		}

		if (storagedUser) {
			const aux = JSON.parse(storagedUser)

			setUser({
				name: aux.name,
				created_at: new Date(aux.created_at)
			})
		}

		setLoading(false)
	}, [])

	function signIn(token: string, user: User) {
		localStorage.setItem('token', token)
		localStorage.setItem('user', JSON.stringify(user))
		setApiHeader(token)
		setUser(user)
	}

	function signOut() {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		setToken('')
		setUser(undefined)
	}

	return (
		<AuthContext.Provider
			value={{
				token,
				loading,
				signed: token !== '',
				user,
				signIn,
				signOut
			}}
		>
			{ children }
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
