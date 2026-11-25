import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
	children: ReactNode;
	variant: ButtonVariant;
	type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
	disabled?: boolean;
	fullWidth?: boolean;
	'aria-label'?: string;
	onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary:
		'min-h-11 rounded-[10px] px-4 border-0 bg-[#376d50] text-white hover:-translate-y-px hover:bg-[#2d5b42] disabled:cursor-not-allowed disabled:opacity-45',
	secondary:
		'min-h-11 rounded-[10px] px-4 border border-[#dfe8e1] bg-[#f8faf8] text-[#355a45] hover:-translate-y-px hover:bg-[#eff5f0]',
	danger: 'size-8 rounded-lg border-0 bg-transparent p-0 text-[#869188] hover:bg-[#fbefed] hover:text-[#a74d3e]',
};

export default function Button({
	children,
	variant,
	type = 'button',
	disabled = false,
	fullWidth = false,
	onClick,
	'aria-label': ariaLabel,
}: ButtonProps) {
	return (
		<button
			aria-label={ariaLabel}
			className={`inline-flex items-center justify-center gap-2 text-[13px] font-semibold transition ${VARIANT_CLASSES[variant]} ${
				fullWidth ? 'w-full' : ''
			}`}
			disabled={disabled}
			onClick={onClick}
			type={type}
		>
			{children}
		</button>
	);
}
