import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
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
    preview: {
      port: 3000,
      host: true
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          signup: resolve(__dirname, 'signup.html'),
          visualization: resolve(__dirname, 'visualization.html'),
          sensorManagement: resolve(__dirname, 'sensor-management.html')
        }
      }
    },
    define: {
      'process.env': {},
    }
  }
})