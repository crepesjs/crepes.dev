import type { defineConfig } from "astro/config";

export default (await import("astro/config")).defineConfig({
	srcDir: "./Source",
	publicDir: "./Public",
	outDir: "./Target",
	site: "HTTPS://Crepes.Dev",
	compressHTML: true,
	prefetch: {
		defaultStrategy: "hover",
		prefetchAll: true,
	},
	server: {
		port: 9999,
	},
	build: {
		concurrency: 9999,
	},
	integrations: [
		// @ts-ignore
		import.meta.env.MODE === "production"
			? (await import("astrojs-service-worker")).default()
			: null,
		(await import("@astrojs/sitemap")).default(),
		(await import("@playform/inline")).default({ Logger: 1 }),
		(await import("@playform/format")).default({ Logger: 1 }),
		(await import("@playform/compress")).default({ Logger: 1 }),
	],
	experimental: {
		clientPrerender: true,
		contentIntellisense: true,
	},
	vite: {
		build: {
			sourcemap: true,
		},
		resolve: {
			preserveSymlinks: true,
		},
		css: {
			devSourcemap: true,
			transformer: "postcss",
		},
		plugins: [
			{
				name: "crossorigin",
				transform(code, id, options) {
					return code
						.replace(/<script/g, '<script crossorigin="anonymous"')
						.replace(
							/<link[^>]*(?=.*rel="preload")(?=.*href="[^"]*\.js")(?=.*as="script")[^>]*/g,
							'$& crossorigin="anonymous"',
						)
						.replace(
							/<link[^>]*(?=.*rel="preload")(?=.*as="font")[^>]*/g,
							'$& crossorigin="anonymous"',
						)
						.replace(
							/<link[^>]*(?=.*rel="stylesheet")(?=.*href="https?:\/\/[^"]*")[^>]*/g,
							'$& crossorigin="anonymous"',
						);
				},
			},
		],
	},
}) as typeof defineConfig;
