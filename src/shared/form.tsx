import React, { useRef, forwardRef, useState, Children, useEffect } from "react";
import styled from "styled-components";

import { Div, Input } from "shared";

export let CheckboxInput: React.FC<
	{
		label?: string;
		disabled?: boolean;
		title?: string;
		value: boolean;
		onChange: (b: boolean) => void;
	} & Omit<Input, "onChange">
> = ({ label, title, disabled = false, value, onChange, ...props }) => {
	let input = useRef<HTMLInputElement>(null);
	let checked = Boolean(value);

	let onClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (disabled) {
			return;
		}

		let current = input.current;
		onChange(!Boolean(current?.checked));
	};

	return (
		<div className={`flex-col ${props.className || ""} ${disabled ? "text-silver-chalice" : "text-emperor"}`}>
			<div className="flex-row pointer" onClick={onClick}>
				<div
					className={
						"h-18 w-18 flex-row align-center justify-center b-1 b-gray text-center " +
						(checked ? "bg-denim" : "bg-white")
					}>
					<img
						className="w-60p max-w-100p fs-12"
						alt="X"
						src="https://content.rotowire.com/images/checkmark.png"
					/>
				</div>
				<input
					ref={input}
					className="none fs-14 p-y-3 b-1 b-alto text-center w-50"
					type="checkbox"
					readOnly={true}
					checked={checked}
					disabled={disabled}
				/>
				{label ? (
					<label className="fs-11 lh-18 m-l-8 pointer" title={title}>
						{label}
					</label>
				) : null}
			</div>
		</div>
	);
};

export let RadioInput: React.FC<
	{ label?: string; values: string[]; value: string; onChange: (s: string) => void } & Omit<Div, "onChange">
> = ({ label, values, value, onChange, ...props }) => {
	let radios = values.map((val) => {
		let input = useRef<HTMLInputElement>(null);
		let isSelected = val === value;
		let onClick = (e: React.MouseEvent<HTMLDivElement>) => {
			onChange(val);
		};

		return (
			<div key={val} className="flex-col justify-center m-r-20">
				<div className="flex-row align-center pointer" onClick={onClick}>
					<input
						id={val}
						ref={input}
						className="b-1 b-alto text-center h-18 w-18"
						type="radio"
						readOnly={true}
						value={val}
						checked={isSelected}
					/>
					<label htmlFor={val} className="fs-14 lh-18 m-l-8 pointer">
						{val}
					</label>
				</div>
			</div>
		);
	});

	return (
		<div>
			{label ? <label className="fs-11 text-emperor m-b-10">{label}</label> : null}
			<div className={`fs-14 flex-row flex-wrap align-baseline min-h-38 ${props.className || null}`}>
				{radios}
			</div>
		</div>
	);
};

type NumberInputProps = {
	label?: string;
	title?: string;
	disabled?: boolean;
	value: number;
	min?: number;
	max?: number;
	step?: string | number;
	onChange: (n: number, e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<Input, "onChange">;

export let NumberInput: React.FC<NumberInputProps> = (
	{ label, value, disabled, min, max, step = "any", onChange, title, ...props },
	ref
) => {
	// this is so leading zeros get removed (unless the value is 0)
	let fixed = 0 === value ? 0 : value.toString().replace(/^[0]+/g, "");

	let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(Number(e.target.value), e);
	};

	return (
		<div className={`flex-col ${props.className || ""}`}>
			{label ? (
				<label className="fs-11 text-emperor m-b-3" title={title}>
					{label}
				</label>
			) : null}
			<input
				disabled={disabled}
				className="fs-14 p-y-5 h-38 bg-white b-1 b-silver-chalice text-center"
				type="number"
				pattern="[1-9]\d*"
				step={step}
				min={min}
				max={max}
				value={fixed}
				onChange={handleChange}
				onFocus={props.onFocus}
				onKeyDown={props.onKeyDown}
			/>
		</div>
	);
};

export let DollarInput = styled(NumberInput)`
	position: relative;

	&::after {
		position: absolute;
		font-size: 14px;
		top: 26px;
		left: 3px;
		transition: all 0.05s ease-in-out;
		content: "$";
	}

	> input {
		width: 60px !important;
	}
`;

type TextInputProps = {
	label?: string;
	title?: string;
	placeholder?: string;
	value: string;
	onChange: (s: string) => void;
} & Omit<Input, "onChange">;

export let TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
	let { label, title, placeholder, value, onChange } = props;

	return (
		<div className={`flex-col ${props.className || ""}`}>
			{label ? (
				<label className="fs-11 text-emperor m-b-3" title={title}>
					{label}
				</label>
			) : null}
			<input
				ref={ref}
				className="fs-16 bg-white b-1 b-silver-chalice p-4-6 lh-28px"
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={props.onFocus}
				onBlur={props.onBlur}
			/>
		</div>
	);
});

type DebouncedTextInputProps = {
	label?: string;
	title?: string;
	placeholder?: string;
	value?: string;
	defaultValue?: string;
	delay?: number;
	onChange: (s: string) => void;
} & Omit<Input, "onChange">;

export let DebouncedTextInput = forwardRef<HTMLInputElement, DebouncedTextInputProps>((props, ref) => {
	let { label, title, placeholder, delay = 0, value, defaultValue = "", onChange } = props;

	let [inputText, setInputText] = useState(value || defaultValue);

	useEffect(() => {
		let timeout = setTimeout(() => {
			onChange(inputText);
		}, delay);

		return () => {
			clearTimeout(timeout);
		};
	}, [inputText]);

	// override input if value changes (say if parent passes new value)
	useEffect(() => {
		setInputText(value || defaultValue);
	}, [value]);

	return (
		<TextInput
			ref={ref}
			{...props}
			title={title}
			label={label}
			value={inputText}
			placeholder={placeholder}
			onChange={(text: string) => setInputText(text)}
		/>
	);
});

export let SelectInput = <T extends string | number | string[] | undefined>({
	label,
	title,
	value,
	onChange,
	children,
	disabled = false,
}: {
	label?: string;
	title?: string;
	value: T;
	onChange: (value: T) => void;
	children: React.ReactNode;
	disabled?: boolean;
}) => {
	let handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange((e.target.value as unknown) as T);
	};

	return (
		<div className="flex-col">
			{label ? (
				<label className="fs-11 text-emperor m-b-3" title={title}>
					{label}
				</label>
			) : null}
			<select
				disabled={disabled}
				className="fs-16 b-1 b-silver-chalice p-y-6 p-x-16 h-38 m-b-0"
				value={value}
				onChange={handleChange}>
				{children}
			</select>
		</div>
	);
};

export let TabSelect: React.FC<
	{ label?: string; value: number; onChange: (n: number) => void } & Omit<Div, "onChange">
> = ({ label, value, onChange, children }) => {
	let tabs = React.Children.map(children, (child, index) => {
		if (!React.isValidElement(child)) {
			return child;
		}

		return React.cloneElement(child, {
			className: "flex-col justify-center p-6-10 text-center nowrap text-denim pointer b-1 flex-1",
			style: {
				backgroundColor: value === index ? "#f0f7ff" : "white",
				borderColor: value === index ? "#85beff" : "#ddd",
				textOverflow: "ellipsis",
				display: "block",
				overflow: "hidden",
			},
			onClick: () => onChange(index),
		});
	});

	let style = {
		display: "grid",
		gridGap: "2px",
		gridTemplateColumns: `repeat(auto-fill, minmax(100px, 1fr))`,
	};

	return (
		<div>
			{label ? <label className="fs-11 text-emperor m-b-3">{label}</label> : null}
			<div className="fs-14" style={style}>
				{tabs}
			</div>
		</div>
	);
};
