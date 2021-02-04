import path from "path";
import express from "express";

let app = express();

let staticPath = path.join(__dirname, "/dist/");

app.use("/dist", express.static(staticPath));

app.get("/api/hello-world", (req, res) => {
	res.json({
		data: "Hello World!",
	});
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/index.htm"));
});

app.listen(5000, () => {
	console.log("app is running at localhost:5000");
});
