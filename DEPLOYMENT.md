# 部署与运维

本文说明真实生产环境的部署路径。这个项目包含动态 API、数据库连接、AI 访问、PayPal 订单创建与 webhook，需要部署到支持 Node.js/Next.js 服务器运行的环境，而不能仅作为静态站点部署到 Cloudflare Pages 或纯前端托管。

推荐路径：Render Web Service + Neon PostgreSQL。也可以使用 Vercel / Railway / Fly.io 等支持 Next.js 的托管平台，但必须配置环境变量、数据库和 webhook。静态托管平台不能直接承载本项目的真实交易与后台逻辑。

免费套餐的地域、配额、休眠策略及商业用途条款可能调整；部署前请核对服务商当前条款。Render 免费服务空闲时会休眠，首次唤醒可能需要等待，适合低流量项目，不适合要求 24/7 生产在线的交易业务。

## 项目要求

- Node.js 20.9 或更新版本，建议 Node.js 22 LTS。
- npm。
- PostgreSQL 兼容数据库。本指南使用 Neon。
- 一个 GitHub 仓库，以及 Render、Neon 账户。

## 本地启动

```bash
npm install
cp .env.example .env
```

在 `.env` 中填写 PostgreSQL 连接地址与强随机管理员令牌。可在本机终端生成令牌：

```bash
openssl rand -base64 32
```

不要把 `.env` 提交到 Git，也不要把令牌写入 `NEXT_PUBLIC_*` 变量。`ADMIN_API_TOKEN` 用于管理面板和 `/api/admin` 的 Bearer 验证。

建立数据库结构并写入演示数据：

```bash
npm run db:push
npm run db:seed
```

启动开发服务并执行检查：

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

打开 `http://localhost:3000`。管理面板会要求输入 `.env` 中的 `ADMIN_API_TOKEN`。本地开发结账会生成演示订单，不会扣款、扣库存、累计分佣或发送邮件。

## 创建免费 PostgreSQL

1. 在 Neon 创建 PostgreSQL 项目和数据库。
2. 从 Neon 控制台复制连接字符串，优先使用 pooled connection string；保存好用户名、密码和数据库名。
3. 确认连接串包含 SSL 参数（Neon 通常提供 `sslmode=require`）。不要把它放在客户端变量或提交到仓库。
4. 本地初始化数据库时，把连接串填入 `.env` 的 `DATABASE_URL`，然后运行 `npm run db:push` 和 `npm run db:seed`。

`db:seed` 会插入产品、直播聊天和联盟演示数据。正式对外运营前应检查并替换示例内容，避免将样例活动、用户名或业绩误当成真实数据。

## 部署到 Render

仓库已包含 `render.yaml`，可使用 Blueprint 创建服务：

1. 将仓库推送到 GitHub。确保提交 `package.json`、应用源文件、`render.yaml` 和本指南；不要提交 `.env`。
2. 在 Render 选择 **New + → Blueprint**，连接 GitHub 仓库并选择分支。
3. Blueprint 会创建免费的 Node Web Service。配置时填写 `DATABASE_URL`：粘贴 Neon 连接串；`ADMIN_API_TOKEN` 由 Blueprint 生成，也可以在 Render 环境设置中自行设置为至少 32 字节的随机秘密。
4. 保持 `DEMO_CHECKOUT_ENABLED` 未设置或设为 `false`。构建命令为 `npm install && npm run build`，启动命令为 `npm start`，健康检查为 `/api/health`。
5. 等待首次构建和部署完成，打开 Render 提供的 `*.onrender.com` 地址。访问 `/api/health` 应返回 `{"ok":true}`。
6. 打开网站管理面板，输入 `ADMIN_API_TOKEN`。如果令牌轮换，在 Render 环境设置中更新后重新部署。

绑定自定义域名后，记得把 `src/app/layout.tsx` 中的 `metadataBase`、Open Graph URL 与站点标题改为实际域名和品牌。

Render 环境变量的修改需要触发重新部署才能确保所有实例使用新值。数据库连接串和管理员令牌只能保存在 Render 的 Secret/Environment 设置中。

## 发布前检查

- 确认线上数据库已执行最新 schema 更新，并检查 `/api/health`。
- 检查管理面板未授权时，`GET /api/admin` 与 `POST /api/admin` 均返回 `401`；未配置令牌时返回 `503`。
- 确保没有在公开页面、浏览器存储、提交记录或日志中暴露数据库连接串和管理员令牌。
- 先用非生产数据库验证 `db:push` 和 seed；为生产数据设置备份并限制数据库网络访问。
- 监控 Render 日志、Neon 连接数、存储与免费额度。免费实例休眠后第一次请求较慢属于套餐特性。

## 真正生产环境要求

真实生产环境至少需要这些配置：

- `DATABASE_URL`：PostgreSQL 连接串
- `ADMIN_API_TOKEN`：管理员 Bearer 令牌，至少 32 字节随机字符串
- `SITE_URL`：正式域名，如 `https://example.com`
- `CHECKOUT_MODE=paypal`：启用真实 PayPal 结账
- `PAYPAL_CLIENT_ID` 与 `PAYPAL_SECRET`：PayPal 应用凭据
- `PAYPAL_MODE=live`：生产环境使用 live 模式
- `PAYPAL_WEBHOOK_SECRET`：验证 PayPal webhook 签名
- `AI_API_KEY` / `AI_API_BASE_URL` / `AI_MODEL`：真实 AI provider 配置
- `AFFILIATE_COMMISSION_RATE`：分销佣金比例，如 `30`

在未配置这些变量时，系统应保持安全失败，不要接受真实交易。

## PayPal 与订单流程

真实生产模式应遵循：

1. 前端提交订单创建请求
2. 服务端验证用户信息和商品
3. 服务端调用 PayPal 创建订单
4. 返回前端支付链接或订单 ID
5. 用户支付成功后，PayPal 通过 webhook 发送事件
6. 服务端校验 signature 与订单幂等性
7. 成功后更新订单状态、发放许可证、发放分佣、发送通知

当前仓库已增加 PayPal 创建订单接口、webhook 接口、订单状态更新与履约逻辑骨架；但只有在你配置 PayPal 凭据、域名和 webhook 后，才能真正进入在线交易模式。不要把 `CHECKOUT_MODE=demo` 留在生产环境。

## 安全落地说明

真实 webhook 处理必须：

- 先校验 `paypal-transmission-*` 头和签名
- 校验 `event_type` 与订单号
- 幂等处理重复请求
- 只在成功支付事件触发发放逻辑
- 保持 `orderNumber` 与 `customerEmail` 受控，不允许任意覆盖

当前代码已使用订单号与签名基础校验结构；部署时需绑定真实 PayPal webhook 才能实现 `pending` 到 `completed` 的自动发放。

## Cloudflare 与其他平台

Cloudflare Pages 的静态导出无法运行本项目的数据库 API、后台认证和真实 PayPal webhook。Cloudflare Workers 可通过 OpenNext 运行 Next.js，并使用 Hyperdrive 连接 PostgreSQL，但需要额外适配配置和绑定；本仓库当前没有生产级 worker 配置。

Render + Neon 是推荐的免费/低成本生产入口。Vercel 也能运行 Next.js 与 API，但需检查是否满足商业用途要求，并且必须为数据库、支付回调和 webhook 配置专用环境变量。任何免费方案都可能调整额度、休眠规则或使用限制。