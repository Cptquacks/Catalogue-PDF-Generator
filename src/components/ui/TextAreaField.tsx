import { useId } from 'react';

interface TextAreaFieldProps {
	label: string;
	name: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	maxLength?: number;
	rows?: number;
}

export default function TextAreaField({
	label,
	name,
	value,
	onChange,
	placeholder,
	maxLength,
	rows = 3,
}: TextAreaFieldProps) {
	const id = useId();

	return (
		<label className="mb-[18px] grid gap-2 text-[13px] font-semibold text-[#26352d]">
			<span>{label}</span>
			<textarea
				className="min-h-[82px] w-full resize-y rounded-[9px] border border-[#dfe6e0] bg-white px-3 py-[11px] text-sm font-normal text-[#17251f] outline-none transition placeholder:text-[#9aa49c] focus:border-[#75a087] focus:ring-[3px] focus:ring-[#4c8065]/[0.12]"
				id={id}
				maxLength={maxLength}
				name={name}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				rows={rows}
				value={value}
			/>
		</label>
	);
}
