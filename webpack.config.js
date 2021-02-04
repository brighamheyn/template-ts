const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = function (env = {}) {
	const mode = env.NODE_ENV || "production";
	const analyse = Boolean(env.ANALYZE || 0);

	console.group(`Building app`);
	console.log(`NODE_ENV: ${mode}`);
	console.log(`ANALYZE: ${analyse}`);
	console.groupEnd();

	return {
		entry: { index: "./src/index.tsx" },
		output: {
			path: path.join(__dirname, "/dist"),
			publicPath: "/dist/",
			filename: "[name].bundle.js",
			chunkFilename: "[name].bundle.js",
		},
		devtool: mode !== "production" ? "eval-source-map" : false,
		optimization: {
			moduleIds: "named",
			chunkIds: "named",
			splitChunks: {
				chunks: "all",
				cacheGroups: {
					// create a single vendors bundle for node_modules
					defaultVendors: {
						enforce: true,
						idHint: "vendors",
						filename: "[name].bundle.js",
						name: "vendors",
						chunks: "all",
					},
					// this is the source for purgecss (look for .css files in output to test against)
					styles: {
						//name: "styles",
						test: /\.css$/,
						chunks: "all",
						enforce: true,
					},
				},
			},
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: ["babel-loader"],
				},
				{
					test: /\.(ts|tsx)$/,
					exclude: /node_modules/,
					use: ["ts-loader"],
				},
				{
					test: /\.s[ac]ss$/,
					exclude: /node_modules/,
					use: [
						// Creates `style` nodes from JS strings
						mode !== "production" ? "style-loader" : MiniCssExtractPlugin.loader,
						// Translates CSS into CommonJS
						"css-loader",
						// Compiles Sass to CSS
						"sass-loader",
					],
				},
			],
		},
		resolve: {
			extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
			modules: [path.resolve(__dirname, "src"), "node_modules"],
		},
		devServer: {
			index: "",
			contentBase: "./",
			open: true,
			historyApiFallback: {
				index: "index.htm",
			},
			hot: true,
			port: "8080",
			proxy: {
				"/api/*": {
					target: "http://localhost:5000",
					secure: false,
				},
			},
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new BundleAnalyzerPlugin({
				analyzerPort: 8111,
				analyzerMode: analyse ? "server" : "disabled",
			}),
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify(mode),
				},
			}),
			new MiniCssExtractPlugin({
				filename: "[name].css",
			}),
			// inspect every file within source directory, compare css classes to those in the index.css (from minicss), and remove unused styles
			new PurgecssPlugin({
				paths: glob.sync(path.join(__dirname, "src") + "/**/*", { nodir: true }),
			}),
		],
		mode: mode,
	};
};
