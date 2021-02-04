import React from "react";
import { Div } from "shared";

export let Spinner: React.FC<{ text?: string } & Div> = ({ text, ...props }) => {
	return (
		<div {...props}>
			<div>
				<img className="rotate" src="https://content.rotowire.com/images/rw-logo-circle.png" />
			</div>
			{text ? <div className="m-t-10">{text}</div> : null}
		</div>
	);
};

// the "loader" class comes from RW universal styles
export let Circle: React.FC<{ text?: string } & Div> = ({ text, ...props }) => {
	return (
		<div {...props} className={`flex-row ${props.className}`}>
			<div className="loader"></div>
			{text ? <div className="m-t-10">{text}</div> : null}
		</div>
	);
};

export let Progress: React.FC<{ percentage: number }> = ({ percentage }) => {
	return (
		<svg viewBox="0 0 36 36" style={{ maxWidth: "none" }}>
			<path
				style={{ strokeWidth: "3.3", fill: "none", stroke: "#eee" }}
				d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
			<path
				style={{ fill: "white", stroke: "#126cd3", strokeWidth: "2.3", strokeLinecap: "round" }}
				strokeDasharray={`${percentage}, 100`}
				d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
			<text
				x="19"
				y="22"
				style={{
					fill: "#126cd3",
					fontWeight: "bold",
					fontSize: "10px",
					transform: "translate(-1px, 0)",
					textAnchor: "middle",
				}}>
				{percentage}%
			</text>
		</svg>
	);
};
