type AgentHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type AgentClientConfig = {
  baseUrl: string
  chatPath: string
  apiKey: string
  apiKeyHeader: string
  timeoutMs: number
  fallbackToMock: boolean
  model: string
  stream: boolean
  maxTokens: number
  temperature: number
}

export type AgentChatRequest = {
  message?: string
  input?: string
  query?: string
  messages?: Array<{ role: string; content: string }>
  [key: string]: unknown
}

export type AgentChatResponse = {
  reply: string
}

export class AgentRequestError extends Error {
  status?: number
  responseText?: string

  constructor(message: string, options?: { status?: number; responseText?: string }) {
    super(message)
    this.name = 'AgentRequestError'
    this.status = options?.status
    this.responseText = options?.responseText
  }
}

function toBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue
  return value.toLowerCase() === 'true'
}

/** 百炼智能体应用 ID（非普通 qwen 模型名；底层模型由应用在控制台配置，当前为 qwen-plus-latest） */
const DEFAULT_AGENT_APP_ID = '6514ae87b0d343059a30840269606735'

function readAgentConfig(): AgentClientConfig {
  const baseUrl = (import.meta.env.VITE_AGENT_API_BASE_URL as string | undefined)?.trim() || ''
  const chatPath =
    (import.meta.env.VITE_AGENT_CHAT_PATH as string | undefined)?.trim() || '/api/chat'
  const apiKey = (import.meta.env.VITE_AGENT_API_KEY as string | undefined)?.trim() || ''
  const apiKeyHeader =
    (import.meta.env.VITE_AGENT_API_KEY_HEADER as string | undefined)?.trim() || 'Authorization'
  const timeoutRaw = (import.meta.env.VITE_AGENT_TIMEOUT_MS as string | undefined)?.trim() || ''
  const timeoutMs = Number.isFinite(Number(timeoutRaw)) ? Number(timeoutRaw) : 0
  const fallbackToMock = toBool(import.meta.env.VITE_AGENT_ENABLE_FALLBACK_MOCK, false)
  const model =
    (import.meta.env.VITE_AGENT_MODEL as string | undefined)?.trim() || DEFAULT_AGENT_APP_ID
  const stream = toBool(import.meta.env.VITE_AGENT_STREAM, false)
  const maxTokensRaw = (import.meta.env.VITE_AGENT_MAX_TOKENS as string | undefined)?.trim() || ''
  const maxTokens = Number.isFinite(Number(maxTokensRaw)) ? Number(maxTokensRaw) : 10000
  const temperatureRaw =
    (import.meta.env.VITE_AGENT_TEMPERATURE as string | undefined)?.trim() || ''
  const temperature = Number.isFinite(Number(temperatureRaw)) ? Number(temperatureRaw) : 1.5

  return {
    baseUrl,
    chatPath,
    apiKey,
    apiKeyHeader,
    timeoutMs,
    fallbackToMock,
    model,
    stream,
    maxTokens,
    temperature,
  }
}

function buildUrl(baseUrl: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (!baseUrl) return normalizedPath
  try {
    return new URL(normalizedPath, baseUrl).toString()
  } catch {
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    return `${normalizedBase}${normalizedPath}`
  }
}

async function request<TResponse>(
  method: AgentHttpMethod,
  path: string,
  body?: unknown,
): Promise<TResponse> {
  const config = readAgentConfig()
  const url = buildUrl(config.baseUrl, path)
  const shouldTimeout = config.timeoutMs > 0
  const controller = shouldTimeout ? new AbortController() : null
  const timer = shouldTimeout ? window.setTimeout(() => controller?.abort(), config.timeoutMs) : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
  }
  if (config.apiKey) {
    if (config.apiKeyHeader.toLowerCase() === 'authorization') {
      headers.Authorization = `Bearer ${config.apiKey}`
    } else {
      headers[config.apiKeyHeader] = config.apiKey
    }
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller?.signal,
    })
    if (!res.ok) {
      const responseText = await res.text()
      throw new AgentRequestError(`HTTP ${res.status}`, { status: res.status, responseText })
    }
    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('text/event-stream')) {
      const text = await readSseAsText(res)
      return { reply: text } as TResponse
    }
    if (contentType.includes('application/json')) {
      return (await res.json()) as TResponse
    }
    const text = await res.text()
    return { reply: text } as TResponse
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AgentRequestError(`请求超时（>${config.timeoutMs}ms）`)
    }
    throw error
  } finally {
    if (timer !== null) window.clearTimeout(timer)
  }
}

function extractSseLineContent(line: string): { done: boolean; chunk: string } {
  if (!line.startsWith('data:')) return { done: false, chunk: '' }
  const payload = line.slice(5).trim()
  if (!payload) return { done: false, chunk: '' }
  if (payload === '[DONE]') return { done: true, chunk: '' }
  try {
    const obj = JSON.parse(payload) as Record<string, unknown>
    const choices = Array.isArray(obj.choices) ? obj.choices : []
    const first = (choices[0] as Record<string, unknown> | undefined) ?? undefined
    const delta = (first?.delta as Record<string, unknown> | undefined)?.content
    const message = (first?.message as Record<string, unknown> | undefined)?.content
    const text = first?.text
    if (typeof delta === 'string') return { done: false, chunk: delta }
    if (typeof message === 'string') return { done: false, chunk: message }
    if (typeof text === 'string') return { done: false, chunk: text }
    return { done: false, chunk: '' }
  } catch {
    return { done: false, chunk: '' }
  }
}

async function readSseAsText(res: Response): Promise<string> {
  if (!res.body) return ''
  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let collected = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const rawLine of lines) {
      const line = rawLine.trim()
      const parsed = extractSseLineContent(line)
      if (parsed.chunk) collected += parsed.chunk
      if (parsed.done) {
        await reader.cancel()
        return collected
      }
    }
  }
  return collected
}

export async function postAgentChat(payload: AgentChatRequest): Promise<AgentChatResponse> {
  const config = readAgentConfig()
  const resolvedModel = (payload.model as string | undefined) ?? config.model
  const normalizedPayload: AgentChatRequest = {
    ...payload,
    stream: payload.stream ?? config.stream,
    max_tokens: payload.max_tokens ?? config.maxTokens,
    temperature: payload.temperature ?? config.temperature,
  }
  if (resolvedModel) normalizedPayload.model = resolvedModel
  return request<AgentChatResponse>('POST', config.chatPath, normalizedPayload)
}

export function shouldFallbackToMock(): boolean {
  return readAgentConfig().fallbackToMock
}
