import { View, Text, TextInput, TextInputProps } from 'react-native'

interface InputProps extends TextInputProps {
	label: string
	error?: string
}

export function Input({ label, error, ...rest }: InputProps) {
	return (
		<View>
			<Text className="mt-6 text-white font-semibold text-base">
				{ label }
			</Text>

			<TextInput
				className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
				{...rest}
			/>

			{
				error &&
				<Text className='mt-2 text-red-600 font-semibold text-base'>
					{ error }
				</Text>
			}
		</View>
	)
}
