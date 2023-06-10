import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	labelClasses?: string
	error?: string
}

export function Input({ label, error, labelClasses, ...rest }: InputProps) {
	return (
		<div className='my-2'>
			<label htmlFor={rest.id} className={"block font-semibold leading-tight " + labelClasses}>
				{ label }
			</label>

			<input
				{...rest}
				className={
					"w-full block p-4 rounded-lg mb-2 mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900 " +
					rest.className
				}
			/>

			<span className='text-red-600'>{error}</span>
		</div>
	)
}
