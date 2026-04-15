import { AgentRequestError, postAgentChat, shouldFallbackToMock } from './agentClient'

export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: number
}

export type ChatResponse = {
  reply: string
}

function extractReply(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const data = payload as Record<string, unknown>
  const choices = Array.isArray(data.choices) ? data.choices : []
  const firstChoice = (choices[0] as Record<string, unknown> | undefined) ?? undefined
  const choiceMessage =
    (firstChoice?.message as Record<string, unknown> | undefined)?.content ?? firstChoice?.text
  const messageContent = (data.message as Record<string, unknown> | undefined)?.content
  const dataNode = data.data as Record<string, unknown> | undefined
  const resultNode = data.result as Record<string, unknown> | undefined

  let outputText: string | undefined
  if (Array.isArray(data.output)) {
    outputText = data.output.filter((v) => typeof v === 'string').join('\n')
  } else if (typeof data.output === 'string') {
    outputText = data.output
  } else if (data.output && typeof data.output === 'object') {
    const out = data.output as Record<string, unknown>
    if (typeof out.text === 'string') outputText = out.text
  }

  const candidates = [
    data.reply,
    data.answer,
    data.content,
    outputText,
    data.text,
    dataNode?.reply,
    dataNode?.answer,
    dataNode?.content,
    resultNode?.reply,
    resultNode?.answer,
    resultNode?.content,
    messageContent,
    choiceMessage,
  ]
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value
  }
  return undefined
}

/**
 * 仅请求智能体 API，默认不做模板回退。
 */
export async function requestChatReply(input: string): Promise<ChatResponse> {
  const text = input.trim()
  if (!text) return { reply: '' }

  try {
    const data = (await postAgentChat({
      messages: [{ role: 'user', content: text }],
    })) as Partial<ChatResponse>
    const reply = extractReply(data)
    if (!reply) {
      return { reply: '未收到有效回复内容。' }
    }
    return { reply }
  } catch (error) {
    if (shouldFallbackToMock()) {
      return { reply: `请求失败：${error instanceof Error ? error.message : '未知错误'}` }
    }

    if (error instanceof AgentRequestError) {
      const detail = error.responseText?.trim()
      return {
        reply:
          `请求失败：${error.message}` + (detail ? `\n${detail.slice(0, 500)}` : ''),
      }
    }

    return {
      reply: `请求失败：${error instanceof Error ? error.message : '未知错误'}`,
    }
  }
}

