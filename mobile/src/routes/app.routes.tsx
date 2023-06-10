import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuth } from '../contexts/AuthContext'
import { Login } from '../screens/Login'
import { Register } from '../screens/Register'
import { Home } from '../screens/Home'
import { New } from '../screens/New'
import { Habit } from '../screens/Habit'
import { Loading } from '../components/Loading'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
	const { signed, loading } = useAuth()

	if (loading) {
		return (
			<Loading />
		)
	}

	return (
		<Navigator screenOptions={{ headerShown: false }}>
			{
				!signed ? (
					<>
						<Screen name='login' component={Login} />
						<Screen name='register' component={Register} />
					</>
				) : (
					<>
						<Screen name='home' component={Home} />
						<Screen name='new' component={New} />
						<Screen name='habit' component={Habit} />
					</>
				)
			}
		</Navigator>
	)
}
