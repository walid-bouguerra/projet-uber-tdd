import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		root: path.resolve(__dirname, ".."),
		globals: true,
		include: ["**/*.it-spec.ts"],
		environment: "node",
		// Le container Postgres écoute sur un port fixe (5433) : un seul fichier à la fois.
		fileParallelism: false,
		// Le démarrage du container peut dépasser le timeout par défaut (10s).
		hookTimeout: 60_000,
	},
});
