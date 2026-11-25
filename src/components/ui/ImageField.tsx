interface ImageFieldProps {
	resetKey: number;
	onChange: (file: File | null) => void;
}

export default function ImageField({ resetKey, onChange }: ImageFieldProps) {
	return (
		<label className="mb-[18px] grid gap-2 text-[13px] font-semibold text-[#26352d]">
			<span>
				Imagen
			</span>
			<input
				key={resetKey}
				accept="image/jpeg,image/png"
				className="w-full rounded-[9px] border border-[#dfe6e0] bg-white p-2.5 text-xs font-normal text-[#69766f] file:mr-3 file:rounded-md file:border-0 file:bg-[#edf4ef] file:px-3 file:py-1.5 file:font-medium file:text-[#355a45]"
				name="image"
				onChange={(event) => onChange(event.target.files?.[0] ?? null)}
				type="file"
			/>
			<small className="text-[11px] text-right font-normal text-[#849087]">JPG o PNG, hasta 5 MB.</small>
		</label>
	);
}
