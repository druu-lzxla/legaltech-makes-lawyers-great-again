export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-slate-600 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="font-semibold text-slate-900">律桥普惠法律互助平台</div>
            <div className="mt-2 leading-relaxed">
              本站不提供真实法律意见，不构成律师服务或法律责任承诺。
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">能力边界</div>
            <ul className="mt-2 space-y-1">
              <li>不包含真实支付与合同流程</li>
              <li>不收集敏感身份信息</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900">建议</div>
            <div className="mt-2 leading-relaxed">
              如遇紧急权益风险，请尽快直接联系当地法律援助机构或持证律师。
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/70 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} LegalTech Prototype. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

