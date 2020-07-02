const path = require("path");

module.exports = {
	devServer: {
		contentBase: __dirname + "/frontend/",
		compress: true,
		host: "0.0.0.0",
		port: 8080,
	},
	mode: "production",
	entry: {
		komentar: __dirname + "/frontend/komentar.js",
	},
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.(html)$/,
				use: {
					loader: "html-loader",
				},
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
		],
	},
};
