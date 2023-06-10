import { useState } from 'react'
import { View, TouchableOpacity, Text, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from 'tailwindcss/colors'

import { Input } from '../components/Input'
import { api } from '../lib/axios'

export function Register() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<any>({})

	const { navigate } = useNavigation()

	async function handleCreateUser() {
		try {
			const res = await api.post('users', { name, email, password })
			alert(res.data.message)
			navigate('login')
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
		<View
			className="flex-1 justify-center bg-background px-8 pt-16"
			style={{
				height: Dimensions.get('screen').height
			}}
		>
			<Input
				label='Nome'
				placeholderTextColor={colors.zinc[400]}
				onChangeText={setName}
				value={name}
				error={errors?.name}
			/>

			<Input
				label='E-mail'
				keyboardType='email-address'
				placeholderTextColor={colors.zinc[400]}
				onChangeText={setEmail}
				value={email}
				error={errors?.email}
			/>

			<Input
				label='Senha'
				secureTextEntry
				placeholderTextColor={colors.zinc[400]}
				onChangeText={setPassword}
				value={password}
				error={errors?.password}
			/>

			<TouchableOpacity
				activeOpacity={0.7}
				className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
				onPress={handleCreateUser}
			>
				<Text className="font-semibold text-base text-white ml-2">
					Cadastrar
				</Text>
			</TouchableOpacity>
		</View>
	)
}
