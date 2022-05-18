import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  const __DEV__ = mode === 'development'

  return {
    plugins: [react()],
    base: __DEV__ ? '/' : '/demo/360/'
  }
})
