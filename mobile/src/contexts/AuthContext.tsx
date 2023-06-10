import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'

import { api } from '../lib/axios'

export interface ContextProps {
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

	function setApiHeader(t: string) {
		api.defaults.headers.common['Authorization'] = `Bearer ${t}`

		setToken(t)
	}

	useEffect(() => {
		async function getLocalData() {
			const storagedToken = await SecureStore.getItemAsync('token')
			const storagedUser = await SecureStore.getItemAsync('user')

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
		}

		getLocalData().then(() => setLoading(false))
	}, [])

	async function signIn(token: string, user: User) {
		await SecureStore.setItemAsync('token', token)
		await SecureStore.setItemAsync('user', JSON.stringify(user))
		setApiHeader(token)
		setUser(user)
	}

	async function signOut() {
		await SecureStore.deleteItemAsync('token')
		await SecureStore.deleteItemAsync('user')
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
