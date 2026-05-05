# Decision Models WebApp - 功能升级 2026-04-26

## 新增功能
1. **继续追问** - 聊天式界面，可以在分析后继续提问，AI 带着上下文回答
2. **历史对话** - 主页显示所有历史对话，点击可恢复，可删除
3. **语音功能** - 🎤 语音输入（Web Speech API，Chrome 支持）+ 🔊 朗读分析（TTS）
4. **模型信息** - 显示当前使用的 LLM 模型名（如 google/gemini-2.0-flash-001）

## 技术变更
- api/decide.js: 支持 history 参数传递对话历史，返回 model 字段
- public/index.html: 重构为聊天式 UI，支持多轮对话
- 使用 Web Speech API 实现语音输入和朗读

## 当前问题
- Notion internal token 频繁过期，Vercel 部署版本无法动态刷新
- 需要创建永久 Notion Integration Token (secret_xxx 格式)

## URLs
- Vercel: https://decision-models-app.vercel.app
- Local: http://localhost:3456