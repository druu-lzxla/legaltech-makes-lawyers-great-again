# 律桥普惠法律互助平台（前端原型）

基于 **React（函数组件）+ TailwindCSS + React Router** 的多页面原型站点，仅用于演示信息架构与交互形态。

## 功能页

- 首页（Landing）
- AI 法律咨询（聊天界面，**假数据模拟**）
- 服务选择（展示服务分层，**不含真实支付**）
- 学生参与（招募页，按钮仅占位）
- 关于我们（含可自行补充的留白区）

## 重要声明

- 本项目 **不提供真实法律意见**，不构成律师服务或法律责任承诺
- **不实现真实支付功能**
- AI 回复为 **mock/假数据**，用于原型展示

## 启动方式

进入项目目录后执行：

```bash
npm install
```

### 仅前端（推荐）

```bash
npm run dev
```

AI 咨询页默认走“智能体 API 配置层”，默认请求 `/api/chat`；默认不再使用本地模板回复。

### 前端 + 本地 mock 后端（可选）

```bash
npm run dev:full
```

这会同时启动：

- 前端：Vite dev server
- 后端：`server/mock-server.mjs`（默认端口 `5174`）

Vite 已配置将 `/api/*` 代理到 `http://localhost:5174`。

## 智能体 API 接入配置

项目已预置统一客户端：`src/lib/agentClient.ts`。  
你只需要在根目录创建 `.env.local`（可由 `.env.example` 复制）并填入参数。

```bash
cp .env.example .env.local
```

可配置项：

- `VITE_AGENT_API_BASE_URL`：智能体服务基础地址（例如 `https://your-api.com`）
- `VITE_AGENT_CHAT_PATH`：聊天接口路径（千问兼容模式推荐 `/chat/completions`）
- `VITE_AGENT_API_KEY`：可选 Bearer Token（前端可见，不建议放高敏感密钥）
- `VITE_AGENT_API_KEY_HEADER`：鉴权头名（默认 `Authorization`，也支持 `x-api-key`）
- `VITE_AGENT_TIMEOUT_MS`：请求超时毫秒数（填 `0` 表示不设置超时）
- `VITE_AGENT_ENABLE_FALLBACK_MOCK`：`true/false`，控制接口失败时是否回退本地 mock
- `VITE_AGENT_MODEL`：智能体应用 ID（例如 `6514ae87b0d343059a30840269606735`）
- `VITE_AGENT_STREAM`：是否启用流式（`true/false`）
- `VITE_AGENT_MAX_TOKENS`：限制输出长度，避免响应过慢
- `VITE_AGENT_TEMPERATURE`：采样温度（本项目默认 `1.5`）

接入建议：

1. 本地联调（同域/代理）：可保持 `VITE_AGENT_API_BASE_URL` 为空，直接用 `/api/chat`
2. 远程联调（跨域）：设置 `VITE_AGENT_API_BASE_URL`，并确保后端已配置 CORS
3. 如果后端用 API Key 鉴权，按实际要求设置 `VITE_AGENT_API_KEY_HEADER`
4. 若接口响应不是 `reply` 字段，也可返回 `answer/content/output/text`，前端会自动识别

### 阿里千问（Qwen）前端配置（同域网关）

```env
VITE_AGENT_API_BASE_URL=
VITE_AGENT_CHAT_PATH=/api/chat
VITE_AGENT_API_KEY=
VITE_AGENT_API_KEY_HEADER=Authorization
VITE_AGENT_TIMEOUT_MS=0
VITE_AGENT_MODEL=6514ae87b0d343059a30840269606735
VITE_AGENT_STREAM=false
VITE_AGENT_MAX_TOKENS=10000
VITE_AGENT_TEMPERATURE=1.5
```

## 阿里云服务器部署（ECS + Nginx + Node）

### 1) 服务器准备

在服务器项目目录执行：

```bash
npm install
npm run build
```

### 2) 设置服务端环境变量

建议在 Linux 服务器用 `export`：

```bash
export PORT=8000
export SITE_DOMAIN="https://你的域名"
export DASHSCOPE_API_KEY="你的DashScopeKey"
export QWEN_MODEL="6514ae87b0d343059a30840269606735"
export QWEN_TIMEOUT_MS=0
export QWEN_MAX_TOKENS=10000
export QWEN_TEMPERATURE=1.5
```

### 3) 启动生产服务

```bash
npm run start:prod
```

服务会同时提供：
- 静态前端（`dist`）
- 接口网关（`/api/chat`）

### 4) Nginx 反向代理（示例）

将域名请求转发到 Node（`127.0.0.1:8000`）：

```nginx
server {
    listen 80;
    server_name 你的域名;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

如已配置 HTTPS，请在 443 的 server 块做同样代理。

### 5) 健康检查

部署后访问：

```bash
curl http://127.0.0.1:8000/api/health
```

如果返回 `ok: true`，说明网关服务正常。

## Windows 本地联调（可选）

在启动前设置服务端环境变量（PowerShell）：

```powershell
$env:DASHSCOPE_API_KEY="你的DashScopeKey"
npm run dev:full
```

