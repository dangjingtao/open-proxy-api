import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  target: "node22",
  tsconfig: "tsconfig.json",
  splitting: false,
  sourcemap: true,
  clean: true,
  esbuildOptions: (options) => {
    options.banner = {
      js: `
        import { createRequire } from 'module';
        import { fileURLToPath } from "url";
        
        const require = createRequire(import.meta.url);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        `,
    };
  },
});
