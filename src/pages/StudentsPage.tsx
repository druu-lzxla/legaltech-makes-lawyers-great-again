import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const whyJoin = [
  { title: '实践经验', desc: '真实案例的结构化整理与沟通训练，提升职业素养。' },
  { title: '公益价值', desc: '参与普惠法律支持，帮助更多人跨过门槛。' },
  { title: '补贴激励', desc: '按值班/任务制结算，具体规则请到详情页了解。' },
]

const howTo = [
  { title: '线上值班', desc: '固定时段在线，处理短咨询与材料整理任务。' },
  { title: '任务制', desc: '领取任务包：时间线整理、证据清单、流程指引等。' },
  { title: '专项任务', desc: '围绕某类主题（劳动/租赁/家事等）沉淀模板与资源。' },
]

const training = [
  { title: '老带新机制', desc: '新同学先跟随示例与模板，逐步独立处理任务。' },
  { title: '标准化流程', desc: '统一信息采集表与输出格式，减少沟通成本。' },
  { title: '质量复核', desc: '关键节点由更高年级/指导团队抽检复核。' },
]

export function StudentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            学生参与
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            面向法学生的校园实践平台入口。
          </p>
        </div>
        <Badge className="border-blue-200 bg-blue-50 text-blue-700">
          校园实践 · 低成本协同
        </Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-base font-semibold text-slate-900">为什么加入</div>
          <div className="mt-4 space-y-3">
            {whyJoin.map((x) => (
              <div key={x.title}>
                <div className="text-sm font-semibold text-slate-900">
                  {x.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">{x.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-base font-semibold text-slate-900">参与方式</div>
          <div className="mt-4 space-y-3">
            {howTo.map((x) => (
              <div key={x.title}>
                <div className="text-sm font-semibold text-slate-900">
                  {x.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">{x.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-base font-semibold text-slate-900">培训方式</div>
          <div className="mt-4 space-y-3">
            {training.map((x) => (
              <div key={x.title}>
                <div className="text-sm font-semibold text-slate-900">
                  {x.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">{x.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-base font-semibold text-slate-900">准备好加入了吗？</div>
          <div className="mt-1 text-sm text-slate-600">
            点击申请加入（占位交互），后续你可自行接入表单/认证流程。
          </div>
        </div>
        <Button
          onClick={() => window.alert('原型演示：已提交申请。')}
        >
          申请加入
        </Button>
      </Card>
    </div>
  )
}

