import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Dev only: POST /__figma?name=x saves a captured layer tree to ../figma/x.json for the Figma bridge */
function figmaCapture(): Plugin {
  const dir = resolve(__dirname, '../figma')
  return {
    name: 'figma-capture',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__figma', (req, res) => {
        const name = new URL(req.url ?? '', 'http://x').searchParams.get('name')?.replace(/[^a-z0-9-]/gi, '')
        if (req.method !== 'POST' || !name) { res.statusCode = 400; res.end(); return }
        let body = ''
        req.on('data', c => (body += c))
        req.on('end', () => {
          mkdirSync(dir, { recursive: true })
          writeFileSync(resolve(dir, `${name}.json`), body)
          res.end('ok')
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), figmaCapture()],
})
