import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const keyPath = env.SSL_KEY_PATH || path.resolve(__dirname, '../backend/certs/localhost-key.pem');
  const certPath = env.SSL_CERT_PATH || path.resolve(__dirname, '../backend/certs/localhost.pem');
  const hasCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);
  const isHttps = (env.VITE_HTTPS === 'true' || env.HTTPS === 'true' || hasCerts) && hasCerts;

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      port: 5173,
      ...(isHttps ? {
        https: {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        }
      } : {})
    }
  };
})

