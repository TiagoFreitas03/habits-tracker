import { AuthContextProvider } from './contexts/AuthContext'
import { Router } from './Router'

export function App() {
	return (
		<AuthContextProvider>
			<Router />
		</AuthContextProvider>
	)
}
