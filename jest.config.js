module.exports = {
	globals: {
		"ts-jest": {
			tsConfig: "tsconfig.json",
		},
	},
	moduleFileExtensions: ["ts", "js"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	testMatch: ["**/(test|src)/**/*.(test|spec).(ts|js)"],
	testEnvironment: "node",
	coverageReporters: [
		"text", // to only outputing coverage result into the console
	],
};
