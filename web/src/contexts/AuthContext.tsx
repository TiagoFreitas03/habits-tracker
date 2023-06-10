import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import { api } from '../lib/axios'

interface ContextProps {
	children: ReactNode
}

interface AuthContextData {
	token: string
	signed: boolean
	loading: boolean
	signIn: (token: string) => void
	signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: ContextProps) {
	const [token, setToken] = useState('')
	const [loading, setLoading] = useState(true)

	function setApiHeader(jwt: string) {
		api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

		setToken(jwt)
	}

	useEffect(() => {
		const storagedToken = localStorage.getItem('token')

		if (storagedToken)
			setApiHeader(storagedToken)

		setLoading(false)
	}, [])

	function signIn(token: string) {
		localStorage.setItem('token', token)
		setApiHeader(token)
	}

	function signOut() {
		localStorage.removeItem('token')
		setToken('')
	}

	return (
		<AuthContext.Provider
			value={{
				token,
				loading,
				signed: token !== '',
				signIn,
				signOut
			}}
		>
			{ children }
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
