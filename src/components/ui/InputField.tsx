import { useId } from 'react';

interface InputFieldProps {
	label: string;
	name: string;
	value: string;
	onChange: (value: string) => void;
	type?: 'text' | 'number';
	required?: boolean;
	placeholder?: string;
	hint?: string;
	error?: string;
	autoComplete?: string;
	inputMode?: 'decimal' | 'numeric' | 'text';
	maxLength?: number;
	min?: number;
	step?: number | 'any';
	pattern?: string;
	title?: string;
}

export default function InputField({
	label,
	name,
	value,
	onChange,
	type = 'text',
	required = false,
	placeholder,
	hint,
	error,
	autoComplete,
	inputMode,
	maxLength,
	min,
	step,
	pattern,
	title,
}: InputFieldProps) {
	const id = useId();
	const messageId = `${id}-message`;
	const message = error || hint;

	return (
		<label className="mb-[18px] grid gap-2 text-[13px] font-semibold text-[#26352d]">
			<span>
				{label} {required && <span className="text-[#b34d3b]">*</span>}
			</span>
			<input
				autoComplete={autoComplete}
				aria-describedby={message ? messageId : undefined}
				aria-invalid={Boolean(error)}
				className="w-full rounded-[9px] border border-[#dfe6e0] bg-white px-3 py-2.75 text-sm font-normal text-[#17251f] outline-none transition placeholder:text-[#9aa49c] focus:border-[#75a087] focus:ring-[3px] focus:ring-[#4c8065]/[0.12]"
				inputMode={inputMode}
				maxLength={maxLength}
				min={min}
				name={name}
				onChange={(event) => onChange(event.target.value)}
				pattern={pattern}
				placeholder={placeholder}
				required={required}
				step={step}
				title={title}
				type={type}
				value={value}
			/>
			{message && (
				<small
					className={`text-[11px] font-normal ${
						error ? 'text-[#9c3e30]' : 'text-[#849087]'
					}`}
					id={messageId}
				>
					{message}
				</small>
			)}
		</label>
	);
}
