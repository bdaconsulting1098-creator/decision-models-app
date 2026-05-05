# Decision Models WebApp - 对话持久化修复 2026-04-26

## 修复内容
- 对话状态(conversations, activeConvId)从DecisionHelper提升到App组件
- 切换Library/Advisor tab时不再丢失对话
- 使用localStorage持久化对话历史(dm_conversations, dm_activeConvId)
- 刷新页面对话保留

## 文件变更
- public/index.html: 状态提升 + localStorage持久化
- api/decide.js: 支持对话历史(history参数) + 返回模型名(model字段)

## URLs
- Vercel: https://decision-models-app.vercel.app
- Local: http://localhost:3456