import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Link } from 'react-router-dom'

type Service = {
  title: string
  priceText: string
  desc: string
  notes?: string[]
  badge?: string
}

const services: Service[] = [
  {
    title: '普通长服务',
    priceText: '69 元 / 次（不计时）',
    badge: '保证解决问题',
    desc: '适合需要完整梳理材料与明确下一步路径的情况。按次计费，不计时。',
    notes: ['更偏向“整理 + 方案 + 准备工作”全套服务或同等的复杂法律咨询。'],
  },
  {
    title: '普通短服务 · 极简十五分钟',
    priceText: '9.9 元',
    badge: '快速答疑',
    desc: '适合单点问题快速了解并确认，例如流程入口、材料是否齐全，是否需要准备什么材料等。',
    notes: ['时长短、信息密度高', '建议先在 AI 页整理要点再进入'],
  },
  {
    title: '普通短服务 · 简单 1 小时',
    priceText: '35 元',
    badge: '更充分沟通',
    desc: '适合需要更完整沟通、协助整理证据清单与时间线，较为复杂的法律咨询。',
    notes: ['适合准备调解/投诉/起诉前的材料整理', '不替代律师意见'],
  },
  {
    title: '法律援助服务',
    priceText: '免费',
    badge: '需资格判断',
    desc: '先与 AI 聊天交代主要案情。若 AI 判断符合资格，可进入人工服务流程。',
    notes: ['这里不实现资格判定逻辑', '建议紧急事项尽快联系当地法律援助机构'],
  },
]

export function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            服务选择
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            展示网页不包含真实支付功能；价格仅用于展示服务分层。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/ai" className="text-sm font-semibold text-blue-700">
            先去 AI 初筛 →
          </Link>
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
            低成本 · 轻量流程
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <Card key={s.title} className="flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-900">
                  {s.title}
                </div>
                <div className="mt-1 text-sm font-semibold text-blue-700">
                  {s.priceText}
                </div>
              </div>
              {s.badge ? (
                <Badge className="border-amber-200 bg-amber-50 text-amber-800">
                  {s.badge}
                </Badge>
              ) : null}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.desc}</p>

            {s.notes?.length ? (
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {s.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-300" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-5 flex items-center gap-2">
              <Button
                onClick={() => {
                  // 原型：不做真实下单，仅做交互占位
                  window.alert('本站用于演示，已选择该服务（未实现支付/下单）。')
                }}
              >
                选择服务
              </Button>
              <Link to="/ai">
                <Button variant="ghost">先咨询 AI</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

