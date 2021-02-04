import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

(window as any)["api"] = {};
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
		}
	}
}

ReactDOM.render(<App />, document.getElementById("app"));
