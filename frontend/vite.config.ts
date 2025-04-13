import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Получаем путь к текущей директории (вместо __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'custom-proxy',
      configureServer(server) {
        server.middlewares.use(
          '/api',
          createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
          }),
        );
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // теперь alias @ работает
    },
  },
});
