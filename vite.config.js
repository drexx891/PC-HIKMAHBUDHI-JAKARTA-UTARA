import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tentang: resolve(__dirname, 'tentang.html'),
        visi_misi: resolve(__dirname, 'visi-misi.html'),
        sejarah: resolve(__dirname, 'sejarah.html'),
        pengurus: resolve(__dirname, 'pengurus.html'),
        opini: resolve(__dirname, 'opini.html'),
        kaderisasi: resolve(__dirname, 'kaderisasi.html'),
        ikrar: resolve(__dirname, 'ikrar.html'),
        berita: resolve(__dirname, 'berita.html'),
        badan_otonom: resolve(__dirname, 'badan-otonom.html')
      }
    }
  }
})
