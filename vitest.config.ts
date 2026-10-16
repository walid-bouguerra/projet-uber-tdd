import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		include: ["test/**/*.{spec,test}.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			reportsDirectory: "./coverage",
			include: ["app/**/*.ts"],
			exclude: [
				"app/clock.ts",
				"app/driver.ts",
				"app/estimate.ts",
				"app/id-generator.ts",
				"app/ride.ts",
				"app/rider.ts",
				"app/**/*.repository.ts",
			],
			thresholds: {
				lines: 100,
				branches: 100,
				functions: 100,
				statements: 100,
			},
		},
	},
});
