import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    minify: "terser",
    target: "es2020",
    terserOptions: {
      compress: {
        ecma: "2020",
        drop_console: true,
        drop_debugger: true,
      }
    },
    lib: {
      formats: ["iife"],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/motion.ts'),
      name: 'motion',
      // the proper extensions will be added
      fileName: 'motion',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
