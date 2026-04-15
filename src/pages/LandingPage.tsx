import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const painPoints = [
  { title: '费用高', value: '78%' },
  { title: '不懂法律', value: '69%' },
  { title: '流程复杂', value: '67%' },
  { title: '找不到靠谱渠道', value: '60%' },
]

const features = [
  {
    title: 'AI法律咨询与匹配',
    desc: 'AI 初筛法律问题并给出基础建议，协助整理信息并建议是否匹配学生。',
    tag: '核心能力',
  },
  {
    title: '学生服务',
    desc: 'AI 匹配最贴合客户实际情况的法学生：协助解决问题或引导用户转入法援机构/律师并完成准备工作。',
    tag: '协同支持',
  },
  {
    title: '法律资源指引',
    desc: '面向常见场景整理可信渠道、流程与材料清单，降低“找不到入口”的不确定性。',
    tag: '资源整理',
  },
]

export function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                法律科技 · 普惠 · 协同
              </Badge>
              <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                轻量 高效
              </Badge>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              律桥普惠法律互助平台
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
              桥接普惠，法护朝夕——您专属的法律风险前哨
            </p>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600">
              平台定位：AI 赋能的法律问题初筛与风险预测 + 学生低成本辅助服务平台。
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/ai">
                <Button className="w-full sm:w-auto">立即咨询AI</Button>
              </Link>
              <Link to="/services">
                <Button variant="secondary" className="w-full sm:w-auto">
                  直接转接人工服务
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div className="text-sm font-semibold text-slate-100">
                核心工作流（示意）
              </div>
              <ol className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-white/10 text-xs">
                    1
                  </span>
                  AI 初步判断法律问题与风险点
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-white/10 text-xs">
                    2
                  </span>
                  输出信息清单与基础建议
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-white/10 text-xs">
                    3
                  </span>
                  匹配学生辅助 / 引导专业法援与律师渠道
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">核心功能介绍</h2>
            <p className="mt-1 text-sm text-slate-600">轻量，灵活，高效。</p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-blue-700">
            查看服务 →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-semibold text-slate-900">
                  {f.title}
                </div>
                <Badge className="border-slate-200 bg-slate-50 text-slate-700">
                  {f.tag}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {f.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">用户痛点展示</h2>
          <p className="mt-1 text-sm text-slate-600">受访者表示（调研占比）。</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((p) => (
            <Card key={p.title} className="relative overflow-hidden">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-blue-600/10 blur-2xl" />
              <div className="relative">
                <div className="text-sm font-medium text-slate-600">受访者表示</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  {p.title}
                </div>
                <div className="mt-4 text-3xl font-semibold tracking-tight text-blue-700">
                  {p.value}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

