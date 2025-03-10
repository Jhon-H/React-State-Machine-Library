import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'lib/index.ts',
      name: 'ReactStateMachine',
      formats: ['es'],
      fileName: 'react-fsm-lite'
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React'
        }
      }
    },
    emptyOutDir: true
  }
})
