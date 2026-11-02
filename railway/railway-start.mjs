// Railway start wrapper for Doop: wait for Postgres (DATABASE_URL) to accept TCP
// connections, then hand over to upstream's command (tsx server/index.ts).
import net from 'node:net'
import { spawn } from 'node:child_process'

const url = process.env.DATABASE_URL
const limit = Number(process.env.DOOP_RAILWAY_DB_WAIT_SECONDS || 180) * 1000

function reachable(host, port) {
  return new Promise((resolve) => {
    const s = net.connect({ host, port, timeout: 3000 })
    s.once('connect', () => { s.destroy(); resolve(true) })
    s.once('error', () => resolve(false))
    s.once('timeout', () => { s.destroy(); resolve(false) })
  })
}

if (url) {
  const u = new URL(url)
  const host = u.hostname, port = Number(u.port || 5432)
  const start = Date.now()
  while (!(await reachable(host, port))) {
    if (Date.now() - start > limit) { console.error(`[railway] Postgres ${host}:${port} not reachable after ${limit / 1000}s`); process.exit(1) }
    console.log(`[railway] waiting for Postgres at ${host}:${port}...`)
    await new Promise((r) => setTimeout(r, 2000))
  }
  console.log(`[railway] Postgres at ${host}:${port} is reachable`)
}

const child = spawn('node_modules/.bin/tsx', ['server/index.ts'], { stdio: 'inherit', cwd: '/app' })
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => child.kill(sig))
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)))
