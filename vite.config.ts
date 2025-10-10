import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // nếu lucide-react gây lỗi dep
  },
  define: {
    global: "window", // fix một số thư viện node
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'esnext',
  },
});
