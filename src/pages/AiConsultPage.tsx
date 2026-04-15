import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { createId } from '../lib/id'
import type { ChatMessage } from '../lib/chatApi'
import { requestChatReply } from '../lib/chatApi'
import { Link } from 'react-router-dom'

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <div className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
      <div
        className={[
          'max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]',
          isUser
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
            : 'bg-white text-slate-800 ring-1 ring-slate-200/70',
        ].join(' ')}
      >
        {msg.content}
      </div>
    </div>
  )
}

export function AiConsultPage() {
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createId('m'),
      role: 'assistant',
      content:
        '你好，我是小桥\n' +
        '请用几句话描述你的问题：发生了什么，你希望得到什么结果。我会根据你的问题给出风险分析，并给出下一步的行动建议。\n\n' +
        '注意：请避免填写身份证号、住址等敏感信息。',
      createdAt: Date.now(),
    },
  ])

  const listRef = useRef<HTMLDivElement | null>(null)
  const canSend = useMemo(() => draft.trim().length > 0 && !loading, [draft, loading])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, loading])

  async function onSend() {
    const text = draft.trim()
    if (!text || loading) return

    setDraft('')
    setLoading(true)

    const userMsg: ChatMessage = {
      id: createId('m'),
      role: 'user',
      content: text,
      createdAt: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])

    const res = await requestChatReply(text)
    const assistantMsg: ChatMessage = {
      id: createId('m'),
      role: 'assistant',
      content: res.reply,
      createdAt: Date.now(),
    }
    setMessages((prev) => [...prev, assistantMsg])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">AI 咨询</h1>
        <Link to="/services" className="text-sm font-semibold text-blue-700">
          服务选择 →
        </Link>
      </div>

      <Card className="p-0">
        <div className="border-b border-slate-200/70 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">对话</div>
        </div>

        <div
          ref={listRef}
          className="h-[52vh] min-h-[360px] overflow-y-auto px-5 py-4"
        >
          <div className="space-y-3">
            {messages.map((m) => (
              <Bubble key={m.id} msg={m} />
            ))}
            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200/70">
                  正在生成回复…
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-slate-200/70 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="sr-only" htmlFor="chat-input">
                请输入你的问题
              </label>
              <textarea
                id="chat-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onSend()
                  }
                }}
                rows={3}
                placeholder="输入消息，Enter 发送，Shift+Enter 换行"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm shadow-slate-900/5 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-200/40"
              />
            </div>

            <div className="flex gap-2 sm:flex-col sm:items-stretch">
              <Button onClick={onSend} disabled={!canSend} className="w-full">
                发送
              </Button>
              <Link to="/services" className="w-full">
                <Button variant="ghost" className="w-full">
                  查看人工/学生服务
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

