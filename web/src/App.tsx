import { AuthContextProvider } from './contexts/AuthContext'

export function App() {
	return (
		<AuthContextProvider>
			<p>hello world</p>
		</AuthContextProvider>
	)
}
