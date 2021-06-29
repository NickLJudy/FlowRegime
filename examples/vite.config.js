import path from "path"
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  root:path.join(__dirname, "independent-context"),
  plugins: [reactRefresh()],
})