import React, { ErrorInfo } from "react";

export type ErrorBoundaryProps = {
	onError?: (error: Error, info: ErrorInfo) => React.ReactNode;
};

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	{ error: Error | null; info: ErrorInfo | null }
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = { error: null, info: null };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		this.setState({ error, info });
	}

	render() {
		if (this.state.error && this.state.info) {
			return <div>{this.props.onError && this.props.onError(this.state.error, this.state.info)}</div>;
		}

		return this.props.children;
	}
}
