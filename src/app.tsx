import React, { useEffect } from "react";
import { Router, Switch, Route, Link, Redirect, useParams, RouteComponentProps, withRouter } from "react-router-dom";
import { createBrowserHistory, History } from "history";

import "./app.scss";

import { Header } from "shared/nav";

type HistoryLocationState = {
	from: string;
};

export const history = createBrowserHistory<unknown & HistoryLocationState>({
	basename: "/",
});

const App: React.FC = () => {
	return (
		<div className="bg-concrete">
			<div>
				<Router history={history}>
					<Switch>
						<Route exact path="/">
							<Header title="HOME"></Header>
						</Route>
						<Route path="*">
							<Redirect to="/" />
						</Route>
					</Switch>
				</Router>
			</div>
		</div>
	);
};

export default App;
