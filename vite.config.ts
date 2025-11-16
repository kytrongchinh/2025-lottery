import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	// console.log(env, "env");
	return {
		base: env.VITE_PUBLIC_URL || "./", // <--- this must match your final URL path
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		build: {
			outDir: env.VITE_BUILD_PATH || "dist", // dynamic output folder
			emptyOutDir: true,
		},
	};
});

