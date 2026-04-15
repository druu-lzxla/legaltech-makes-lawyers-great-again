import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const app = express()
app.use(express.json())
app.disable('x-powered-by')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const hasDist = fs.existsSync(path.join(distDir, 'index.html'))

/** 百炼智能体应用 ID（调用 /api/v1/apps/{id}/completion，非 compatible-mode 千问对话） */
const DEFAULT_AGENT_APP_ID = '6514ae87b0d343059a30840269606735'

const DASHSCOPE_API_BASE = (
  process.env.DASHSCOPE_API_BASE || 'https://dashscope.aliyuncs.com/api/v1'
).replace(/\/$/, '')
const AGENT_APP_ID = (
  process.env.DASHSCOPE_AGENT_APP_ID ||
  process.env.QWEN_MODEL ||
  DEFAULT_AGENT_APP_ID
).trim()
const AGENT_TIMEOUT_MS = Number(process.env.AGENT_TIMEOUT_MS || process.env.QWEN_TIMEOUT_MS || 0)
const SITE_DOMAIN = process.env.SITE_DOMAIN || ''
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || ''

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
    res.setHeader('Vary', 'Origin')
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})

function extractAgentReply(data) {
  const text = data?.output?.text
  if (typeof text === 'string' && text.trim()) return text
  return ''
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'legaltech-aid-gateway',
    hasDist,
    siteDomain: SITE_DOMAIN || null,
    agentAppId: AGENT_APP_ID,
  })
})

app.post('/api/chat', async (req, res) => {
  const message =
    String(req.body?.message ?? req.body?.input ?? req.body?.query ?? '').trim() ||
    String(req.body?.messages?.[0]?.content ?? '').trim()

  if (!message) {
    res.status(400).json({ reply: '消息内容不能为空' })
    return
  }

  const apiKey = process.env.DASHSCOPE_API_KEY
  if (!apiKey) {
    res.status(500).json({ reply: '未配置 DASHSCOPE_API_KEY' })
    return
  }

  const shouldTimeout = AGENT_TIMEOUT_MS > 0
  const controller = shouldTimeout ? new AbortController() : null
  const timer = shouldTimeout ? setTimeout(() => controller?.abort(), AGENT_TIMEOUT_MS) : null
  const endpoint = `${DASHSCOPE_API_BASE}/apps/${AGENT_APP_ID}/completion`

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: { prompt: message },
        parameters: {},
        debug: {},
      }),
      signal: controller?.signal,
    })

    const text = await upstream.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }

    if (!upstream.ok) {
      const msg =
        data && typeof data.message === 'string'
          ? data.message
          : text.slice(0, 500) || `HTTP ${upstream.status}`
      res.status(upstream.status).json({
        reply: `上游错误 HTTP ${upstream.status}: ${msg}`,
        upstream: text.slice(0, 1000),
      })
      return
    }

    if (!data) {
      res.status(502).json({ reply: '上游返回非 JSON', upstream: text.slice(0, 1000) })
      return
    }

    const reply = extractAgentReply(data)
    if (!reply) {
      res.status(502).json({
        reply: '上游未返回 output.text',
        upstream: text.slice(0, 1000),
      })
      return
    }

    res.json({ reply })
  } catch (error) {
    const isAbort = error instanceof Error && error.name === 'AbortError'
    res.status(504).json({
      reply: isAbort ? `请求超时（>${AGENT_TIMEOUT_MS}ms）` : '上游请求失败',
      detail: error instanceof Error ? error.message : String(error),
    })
  } finally {
    if (timer !== null) clearTimeout(timer)
  }
})

const port = Number(process.env.PORT || 5174)

if (hasDist) {
  app.use(express.static(distDir))
  // 将 '*' 改为 / . * / （去掉空格）
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next()
      return
    }
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `gateway listening on http://localhost:${port} | dist=${hasDist ? 'on' : 'off'} | domain=${SITE_DOMAIN || 'unset'} | agentApp=${AGENT_APP_ID}`,
  )
})
