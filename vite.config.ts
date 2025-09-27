import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        test1: 'test1.html',
        test2: 'test2.html', 
        test3: 'test3.html',
        result: 'result.html'
      }
    }
  }
});
