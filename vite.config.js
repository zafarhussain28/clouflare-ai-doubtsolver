import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/katex/')) return 'math-renderer';
          if (
            id.includes('/node_modules/rehype-katex/') ||
            id.includes('/node_modules/remark-math/') ||
            id.includes('/node_modules/react-markdown/')
          ) return 'markdown-renderer';
          return undefined;
        },
      },
    },
  },
});