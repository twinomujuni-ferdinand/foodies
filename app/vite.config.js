import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// Import Bootstrap CSS 
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


