import React from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";

import { history } from "app";

export let Link: React.FC<React.ComponentProps<typeof RouterLink>> = (props) => {
	// always include state with "to"
	let to =
		typeof props.to === "string" ? { pathname: props.to, state: { from: history.location.pathname } } : props.to;

	let newProps = Object.assign({}, props, { to });

	return <RouterLink {...newProps}>{props.children}</RouterLink>;
};

export let NoHoverLink = styled(Link)`
	&:hover {
		color: white !important;
	}
`;

export let ButtonLink: React.FC<React.ComponentProps<typeof Link> & { disabled?: boolean }> = ({
	to,
	children,
	onClick,
	disabled = false,
	...props
}) => {
	return (
		<div className={`nowrap ${props.className}`}>
			{disabled === true ? (
				<div className="bg-alto text-gray p-7-15 cursor">{children}</div>
			) : (
				<div className="nowrap p-7-0">
					<NoHoverLink
						className="text-white p-7-15 bg-denim pointer"
						to={to}
						onClick={(e) => onClick && onClick(e)}>
						{children}
					</NoHoverLink>
				</div>
			)}
		</div>
	);
};

export let Header: React.FC<{ title: string }> = ({ title, children }) => {
	return (
		<div className="m-b-20">
			<div className="flex-row flex-wrap space-between p-10-15 align-end lh-1_4 space-between bg-onahau b-b-1 b-anakiwa m-b-10">
				<div className="flex-row align-self-start flex-wrap m-r-25">
					<div className="fs-29 text-big-stone ls-0_4 bold flex m-t-4 m-r-15 align-center">{title}</div>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
};
