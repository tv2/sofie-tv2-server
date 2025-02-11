import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    typecheck: {
      tsconfig: './tsconfig.test.json'
    },
    coverage: {
      all: true,
      reporter: ["text", "text-summary", "json-summary", "json", "html"],
      include: ["src"],
      exclude: ["src/model/*.ts"],
    },
  },
})
