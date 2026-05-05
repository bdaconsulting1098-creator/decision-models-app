# Decision Models WebApp - 部署完成

## 部署结果
- **Vercel URL**: https://decision-models-app.vercel.app
- **部署时间**: 2026-04-26
- **模型数量**: 120 个 (20 Kahneman + 100 Munger)

## 技术栈
- 前端: Vanilla JS + React (CDN)
- 后端: Vercel Serverless Functions
- 数据源: Notion API (数据库 + 页面)
- LLM: OpenRouter (免费模型)

## 解决的问题
1. Notion 数据库 ID 错误 → 找到正确的数据库 ID
2. Notion API 版本 bug → 从 2025-09-03 降级到 2022-06-28
3. Vercel 路由配置 → 使用 rewrites 替代 routes
4. Token 动态获取 → 本地开发时每次请求刷新 token

## 本地开发
```bash
node dev.js  # http://localhost:3456
```

## Vercel 重新部署
```bash
vercel --prod --yes
```

## 环境变量
- NOTION_TOKEN: Notion API token
- OPENROUTER_API_KEY: OpenRouter 免费 API key