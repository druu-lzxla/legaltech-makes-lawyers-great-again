import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            关于我们
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            项目背景与目标。
          </p>
        </div>
        <Badge className="border-amber-200 bg-amber-50 text-amber-800">
          普惠法律支持
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-base font-semibold text-slate-900">项目背景</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            这是一个面向社会的法律科技平台原型，聚焦“低成本获取基础法律帮助”“AI 与
            法学生协同参与”“降低流程与信息门槛”。
          </p>
        </Card>

        <Card>
          <div className="text-base font-semibold text-slate-900">目标</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            降低法律服务门槛，帮助用户更快完成信息整理、风险提示与路径选择；必要时引导
            转入学生辅助或专业法援机构/律师渠道。
          </p>
        </Card>
      </div>

      <Card className="border-dashed">
        <div className="text-base font-semibold text-slate-900">AI + 高校学生</div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          （此处留空，后续由你补充文字与机制说明。）
        </p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
          建议补充：角色分工、质量控制、隐私与合规边界、转介机制、服务范围与免责声明等。
        </div>
      </Card>
    </div>
  )
}

