import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Bezpieczne ładowanie zmiennych środowiskowych
  const env = loadEnv(mode, process.cwd(), '')
  const backendPort = env.VITE_BACKEND_PORT || 9090
  const backendUrl = `http://localhost:${backendPort}`
  console.log(backendUrl);

  return {
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('Proxy error:', err)
            })
          }
        }
      }
    },
    build: {
      outDir: 'dist'
    },
    define: {
      'process.env': {},
    }
  }
})