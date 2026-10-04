import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "@": path.resolve(fileURLToPath(new URL(".", import.meta.url)), "src") } },
  test: { environment: "jsdom", include: ["src/**/*.test.{ts,tsx}"], clearMocks: true },
})
