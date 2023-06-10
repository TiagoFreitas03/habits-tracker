import { useState } from 'react'
import { View, TouchableOpacity, Text, Dimensions, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from 'tailwindcss/colors'

import { Input } from '../components/Input'
import { api } from '../lib/axios'
import { useAuth } from '../contexts/AuthContext'

export function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { signIn } = useAuth()
	const { navigate } = useNavigation()

	async function handleLogin() {
		try {
			const res = await api.post('login', { email, password })
			const { token, name, created_at } = res.data
			signIn(token, { name, created_at: new Date(created_at) })
		} catch (err: any) {
			Alert.alert('Ops!', err.response.data.message)
		}
	}

	return (
		<View
			className="flex-1 justify-center bg-background px-8 pt-16"
			style={{ height: Dimensions.get('screen').height }}
		>
			<Input
				label='E-mail'
				keyboardType='email-address'
				placeholderTextColor={colors.zinc[400]}
				onChangeText={setEmail}
				value={email}
			/>

			<Input
				label='Senha'
				secureTextEntry
				placeholderTextColor={colors.zinc[400]}
				onChangeText={setPassword}
				value={password}
			/>

			<TouchableOpacity
				activeOpacity={0.7}
				className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
				onPress={handleLogin}
			>
				<Text className="font-semibold text-base text-white ml-2">
					Entrar
				</Text>
			</TouchableOpacity>

			<Text className='mt-4 text-white text-center'>
				Não tem conta? <Text
					onPress={() => navigate('register')}
					className='underline text-violet-600'
				>
					Clique aqui
				</Text>
			</Text>
		</View>
	)
}
