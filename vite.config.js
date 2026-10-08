import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleGithubProxy } from './apiProxy.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GITHUB_TOKEN && !process.env.GITHUB_TOKEN) {
    process.env.GITHUB_TOKEN = env.GITHUB_TOKEN
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'github-api-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || ''
            if (url.startsWith('/api/github')) {
              await handleGithubProxy(req, res)
            } else {
              next()
            }
          })
        },
      },
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
    },
  }
})
