// ─── Model Cache (15-min TTL) ───────────────────────────────────────────────
let cachedModels = null;
let cacheTime = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function getModels() {
  if (cachedModels && Date.now() - cacheTime < CACHE_TTL) {
    console.log('[Cache] Using cached models (age:', Math.round((Date.now() - cacheTime) / 1000), 's)');
    return cachedModels;
  }
  cachedModels = await fetchModels();
  cacheTime = Date.now();
  console.log('[Cache] Refreshed model cache, count:', cachedModels.length);
  return cachedModels;
}

// Fetch all models from new unified Notion database
async function fetchModels() {
  const fetch = require('node-fetch');
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error('Notion token not configured');

  // New unified database (contains both Kahneman + Munger models)
  const dbId = '350157c6-daef-80dd-a321-e6ff0c601530';

  const results = [];
  let cursor;

  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    let dbRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!dbRes.ok) {
      const err = await dbRes.text();
      throw new Error(`Notion query failed (${dbRes.status}): ${err}`);
    }

    const dbData = await dbRes.json();

    for (const page of (dbData.results || [])) {
      const p = page.properties || {};
      results.push({
        id: page.id,
        name: (p.Name?.title || [{}])[0]?.plain_text || '',
        englishName: (p['English Name']?.rich_text || [{}])[0]?.plain_text || '',
        coreConcept: (p['Core Concept']?.rich_text || [{}])[0]?.plain_text || '',
        coreConceptCN: (p['Core Concept (CN)']?.rich_text || [{}])[0]?.plain_text || '',
        whenToUse: (p['When to Use']?.rich_text || [{}])[0]?.plain_text || '',
        whenToUseCN: (p['When to Use (CN)']?.rich_text || [{}])[0]?.plain_text || '',
        example: (p['Example']?.rich_text || [{}])[0]?.plain_text || '',
        exampleCN: (p['Example (CN)']?.rich_text || [{}])[0]?.plain_text || '',
        category: (p.Category?.select?.name) || '',
        source: (p.Source?.select?.name) || '',
        relatedMunger: (p['Related Munger Model']?.rich_text || [{}])[0]?.plain_text || '',
        modelId: (p['Model ID']?.rich_text || [{}])[0]?.plain_text || '',
        tags: (p.Tags?.multi_select || []).map(t => t.name)
      });
    }

    cursor = dbData.has_more ? dbData.next_cursor : undefined;
  } while (cursor);

  console.log(`[fetchModels] Total models from Notion: ${results.length}`);
  return results;
}

// ─── Web Search (free, no API key) ────────────────────────────────────────────
async function webSearch(query) {
  const fetch = require('node-fetch');
  const enc = encodeURIComponent(query);

  // Try Bing first (most reliable), then DuckDuckGo
  const engines = [
    { name: 'Bing', url: 'https://www.bing.com/search?q=' + enc },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/html/?q=' + enc }
  ];

  for (const eng of engines) {
    try {
      console.log('[WebSearch] Trying', eng.name, '...');
      const resp = await fetch(eng.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' }
      });
      const html = await resp.text();
      console.log('[WebSearch]', eng.name, '->', html.length, 'chars');

      let results = [];
      if (eng.name === 'Bing') {
        // Parse Bing: split by </h3> and extract link text
        const parts = html.split('</h3>');
        for (const part of parts.slice(0, 12)) {
          const aIdx = part.lastIndexOf('<a ');
          if (aIdx !== -1) {
            const chunk = part.substring(aIdx);
            const endIdx = chunk.indexOf('</a>');
            if (endIdx > 0) {
              const linkText = chunk.substring(0, endIdx).replace(/<[^>]+>/g, '').trim();
              if (linkText && linkText.length > 5 && !linkText.includes('http') && !linkText.startsWith('<')) {
                results.push({ title: linkText.substring(0, 120), snippet: linkText.substring(0, 200) });
              }
            }
          }
        }
        if (results.length > 0) {
          console.log('[WebSearch] Bing found', results.length, 'results');
          return results.slice(0, 5);
        }
      } else {
        // DuckDuckGo: use string search instead of regex
        const ddgTitles = [];
        let pos = 0;
        while (pos < html.length) {
          const tIdx = html.indexOf('result__a', pos);
          if (tIdx === -1) break;
          const gtIdx = html.indexOf('>', tIdx + 10);
          const ltIdx = html.indexOf('<', gtIdx);
          if (gtIdx !== -1 && ltIdx !== -1) {
            const t = html.substring(gtIdx + 1, ltIdx).trim();
            if (t && t.length > 5) ddgTitles.push(t);
          }
          pos = ltIdx + 1;
          if (ddgTitles.length >= 5) break;
        }
        if (ddgTitles.length > 0) {
          console.log('[WebSearch] DDG found', ddgTitles.length, 'results');
          return ddgTitles.map(t => ({ title: t.substring(0, 120), snippet: t.substring(0, 200) }));
        }
      }
    } catch(e) {
      console.error('[WebSearch]', eng.name, 'error:', e.message);
    }
  }
  console.log('[WebSearch] All engines failed');
  return [];
}

// Detect if scenario likely needs current/recent info
function needsWebSearch(scenario) {
  const q = scenario.toLowerCase();
  const triggers = [
    'stock', 'price', 'latest', 'recent', 'today', 'news', 'current',
    '2024', '2025', '2026', 'election', 'market', 'how much', 'how many',
    'what is the', 'who is', 'where is', 'result', 'winner', '比分', '股价',
    '最新', '新闻', '选举', '比赛结果'
  ];
  return triggers.some(t => q.includes(t));
}

// LLM-based model selection - let AI pick the most relevant models
async function selectRelevantModels(scenario, models, config, language) {
  if (!models || models.length === 0) return [];

  const fetch = require('node-fetch');
  const isChinese = language === 'zh-CN';

  // Build a compact model list for LLM to choose from — include When to Use for better selection
  const modelList = models.map((m, i) => {
    const concept = isChinese && m.coreConceptCN ? m.coreConceptCN : m.coreConcept;
    const whenToUse = isChinese && m.whenToUseCN ? m.whenToUseCN : m.whenToUse;
    return `[${i}] ${m.name} (${m.source === 'kahneman' ? 'K' : 'M'} - ${m.category})\n 适用: ${(whenToUse || '').substring(0, 120)}\n 概念: ${concept.substring(0, 80)}`;
  }).join('\n');

  const systemPrompt = isChinese
    ? `你是一个心智模型选择器。根据用户的决策场景，选择最相关的 10-12 个心智模型来分析这个场景。

返回格式：只返回 JSON 数组，包含你选择的模型索引号。例如：[2, 15, 34, 67, 89]

要求：
1. 选择能从不同角度分析问题的模型
2. 考虑决策场景中的心理因素、经济因素、系统因素等
3. 特别要包含与认知陷阱(Cognitive Trap)相关的模型
4. 避免选择过于相似的模型
5. 不需要解释，只返回索引数组`
    : `You are a mental model selector. Given a user's decision scenario, select the 10-12 most relevant mental models to analyze it.

Return format: Only return a JSON array of selected model indices. Example: [2, 15, 34, 67, 89]

Requirements:
1. Select models that analyze the problem from different angles
2. Consider psychological factors, economic factors, system factors, etc.
3. MUST include models related to Cognitive Traps/biases
4. Avoid selecting overly similar models
5. No explanation needed, just return the index array`;

  try {
    const cleanApiKey = (config.apiKey || '').trim();
    const authHeader = `Bearer ${cleanApiKey}`;
    
    const resp = await fetch(`${config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        ...(config.provider === 'openrouter' ? {
          'HTTP-Referer': 'https://mental-models-app.vercel.app',
          'X-Title': 'Mental Models Decision Advisor'
        } : {})
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Decision scenario: ${scenario}\n\nAvailable models:\n${modelList}` }
        ],
        max_tokens: 100,
        temperature: 0.3
      })
    });

    if (!resp.ok) {
      console.error('[Model Selection] LLM API error:', resp.status);
      return fallbackModelSelection(models);
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON array from response
    const match = content.match(/\[[\d\s,]+\]/);
    if (!match) {
      console.error('[Model Selection] No valid array in response:', content);
      return fallbackModelSelection(models);
    }

    const indices = JSON.parse(match[0]);
    const selected = indices
      .filter(i => i >= 0 && i < models.length)
      .slice(0, 15)
      .map(i => models[i]);

    console.log('[Model Selection] Selected indices:', indices, '->', selected.length, 'models');
    console.log('[Model Selection] Selected models:', selected.map(m => m.modelId + ' ' + m.name).join(', '));
    return selected.length > 0 ? selected : fallbackModelSelection(models);
  } catch (err) {
    console.error('[Model Selection] Error:', err.message);
    console.error('[Model Selection] Error stack:', err.stack);
    console.error('[Model Selection] Error name:', err.name);
    return fallbackModelSelection(models);
  }
}

// Fallback: smart random selection with category diversity
function fallbackModelSelection(models) {
  if (!models || models.length === 0) return [];

  // Group by category
  const byCategory = {};
  models.forEach(m => {
    const cat = m.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(m);
  });

  const categories = Object.keys(byCategory);
  const selected = [];

  // Pick 1-2 from each major category
  const shuffled = categories.sort(() => Math.random() - 0.5);
  for (const cat of shuffled.slice(0, 4)) {
    const catModels = byCategory[cat].sort(() => Math.random() - 0.5);
    selected.push(...catModels.slice(0, 2));
    if (selected.length >= 7) break;
  }

  console.log('[Fallback Selection] Selected', selected.length, 'models from', categories.length, 'categories');
  return selected.slice(0, 7);
}

// ─── Provider Config ────────────────────────────────────────────────────────
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';
const DEEPSEEK_MODEL = 'deepseek-v4-flash';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

async function callOpenRouter(messages, model) {
  const fetch = require('node-fetch');
  const cleanKey = (OPENROUTER_API_KEY || '').trim();
  const m = model || OPENROUTER_MODEL;
  console.log('[OpenRouter] Calling model:', m, '| Key length:', cleanKey.length);

  if (!cleanKey) {
    console.error('[OpenRouter] No API key configured');
    return { ok: false, status: 401, errText: 'OpenRouter API key not configured' };
  }

  const url = `${OPENROUTER_BASE_URL}/chat/completions`;
  const timeoutMs = 30000;

  try {
    let settled = false;
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bdademo.site',
        'X-Title': 'Decision Models App'
      },
      body: JSON.stringify({
        model: m,
        messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => {
        if (!settled) {
          console.error('[OpenRouter] Timeout after', timeoutMs, 'ms');
          resolve(null);
        }
      }, timeoutMs)
    );

    const resp = await Promise.race([fetchPromise, timeoutPromise]);
    settled = true;

    if (!resp) {
      return { ok: false, status: 504, errText: `OpenRouter API timeout (${timeoutMs}ms)` };
    }
    if (!resp.ok) {
      const errText = await resp.text();
      console.error(`[OpenRouter] Error (${resp.status}): ${errText.substring(0, 300)}`);
      return { ok: false, status: resp.status, errText };
    }
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return { ok: false, status: resp.status, errText: 'Empty response' };
    return { ok: true, content, model: m };
  } catch (e) {
    console.error(`[OpenRouter] Error: ${e.message}`);
    return { ok: false, status: 504, errText: e.message };
  }
}

async function callDeepSeek(messages, model) {
  const fetch = require('node-fetch');
  const cleanKey = (DEEPSEEK_API_KEY || '').trim();
  console.log('[DeepSeek] Calling model:', model || DEEPSEEK_MODEL);
  
  const url = `${DEEPSEEK_BASE_URL}/chat/completions`;
  const timeoutMs = 15000;

  try {
    let settled = false;
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || DEEPSEEK_MODEL,
        messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => {
        if (!settled) {
          console.error('[DeepSeek] Timeout after', timeoutMs, 'ms');
          resolve(null);
        }
      }, timeoutMs)
    );

    const resp = await Promise.race([fetchPromise, timeoutPromise]);
    settled = true;

    if (!resp) {
      return { ok: false, status: 504, errText: `DeepSeek API timeout (${timeoutMs}ms)` };
    }

    if (!resp.ok) {
      const errText = await resp.text();
      console.error(`[DeepSeek] Error (${resp.status}): ${errText.substring(0, 300)}`);
      return { ok: false, status: resp.status, errText };
    }
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return { ok: false, status: resp.status, errText: 'Empty response' };
    return { ok: true, content, model: model || DEEPSEEK_MODEL };
  } catch (e) {
    console.error(`[DeepSeek] Error: ${e.message}`);
    return { ok: false, status: 504, errText: e.message };
  }
}

async function callLLM(messages, config, providerName) {
  console.log('[LLM] Requested provider:', providerName);
  if (providerName === 'deepseek') {
    console.log('[LLM] Using DeepSeek (user selected)');
    const dsResult = await callDeepSeek(messages, DEEPSEEK_MODEL);
    if (dsResult.ok) {
      return { analysis: dsResult.content, modelUsed: dsResult.model, provider: 'deepseek' };
    }
    console.warn('[LLM] DeepSeek failed, falling back to OpenRouter');
    const orResult = await callOpenRouter(messages, OPENROUTER_MODEL);
    if (orResult.ok) {
      return { analysis: orResult.content, modelUsed: orResult.model, provider: 'openrouter' };
    }
    throw new Error(`DeepSeek failed: (${dsResult.status}) ${dsResult.errText}. OpenRouter also failed: (${orResult.status}) ${orResult.errText}`);
  }
  // Default: OpenRouter first, then DeepSeek fallback
  console.log('[LLM] Using OpenRouter (default)');
  const orResult = await callOpenRouter(messages, OPENROUTER_MODEL);
  if (orResult.ok) {
    return { analysis: orResult.content, modelUsed: orResult.model, provider: 'openrouter' };
  }
  console.warn('[LLM] OpenRouter failed, trying DeepSeek fallback:', orResult.errText?.substring(0, 100));
  const dsResult = await callDeepSeek(messages, DEEPSEEK_MODEL);
  if (dsResult.ok) {
    return { analysis: dsResult.content, modelUsed: dsResult.model, provider: 'deepseek' };
  }
  throw new Error(`Both failed. OpenRouter: (${orResult.status}) ${orResult.errText}. DeepSeek: (${dsResult.status}) ${dsResult.errText}`);
}

function buildProviderConfig(providerName) {
  if (providerName === 'openrouter') {
    return { name: 'openrouter', apiKey: OPENROUTER_API_KEY, baseURL: OPENROUTER_BASE_URL, model: OPENROUTER_MODEL };
  }
  return { name: 'deepseek', apiKey: DEEPSEEK_API_KEY, baseURL: DEEPSEEK_BASE_URL, model: DEEPSEEK_MODEL };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const scenario = req.body.scenario || req.body.problem || '';
    const frontendModels = req.body.models || req.body.frontendModels || [];
    const { history, language, forceModel } = req.body;
    if (!scenario) return res.status(400).json({ error: 'Scenario is required' });

    const isChinese = language === 'zh-CN';

    let models = (frontendModels && frontendModels.length > 0) ? frontendModels : await getModels();

    if (!models.length) {
      return res.status(503).json({ error: 'No mental models available. Notion data could not be loaded.' });
    }

    // Use LLM to select most relevant models (async) - use OpenRouter
    let config = buildProviderConfig('openrouter');
    let relevantModels = await selectRelevantModels(scenario, models, config, language);

    // If model selection failed with OpenRouter, try DeepSeek as backup
    if (!relevantModels || relevantModels.length <= 1) {
      console.log('[Handler] Model selection with OpenRouter gave', relevantModels?.length, 'models, trying DeepSeek');
      config = buildProviderConfig('deepseek');
      relevantModels = await selectRelevantModels(scenario, models, config, language);
    }

    // Use OpenRouter for analysis
    config = buildProviderConfig('openrouter');

    // ── Web search for scenarios needing current info ──────────────────────────
    let webResults = [];
    let searchTriggered = needsWebSearch(scenario);
    console.log('[Search] Triggered:', searchTriggered, '| Scenario:', scenario.substring(0, 80));
    if (searchTriggered) {
      webResults = await webSearch(scenario);
      console.log('[Search] Results count:', webResults.length);
    }

    const modelSummaries = relevantModels.map(m => {
      const concept = isChinese && m.coreConceptCN ? m.coreConceptCN : m.coreConcept;
      const whenToUse = isChinese && m.whenToUseCN ? m.whenToUseCN : m.whenToUse;
      const example = isChinese && m.exampleCN ? m.exampleCN : m.example;
      return `**${m.name}** (${m.source === 'kahneman' ? 'Kahneman' : 'Munger'} - ${m.category}):\n${concept}${whenToUse ? '\n适用场景: ' + whenToUse : ''}${example ? '\n实例: ' + example.substring(0, 200) : ''}`;
    }).join('\n\n');

    const webInfoSection = webResults.length > 0
      ? `\n\n## Current Information (Web Search)\n${webResults.map(r => `### ${r.title}\n${r.snippet}`).join('\n\n')}`
      : '';

    const systemPrompt = `You are a decision advisor who uses mental models to analyze decisions. You have access to the following relevant mental models for this conversation.

${isChinese ? '请用中文回答。CRITICAL FORMATTING RULES - 严格遵循:\n\n(1) 章节标题必须使用英文优先格式: "## English Title（中文标题）" 例如 "## Scenario Diagnosis（场景诊断）", "## Multi-Dimensional Analysis（多维度分析）", "## Risk & Tradeoffs（风险与权衡）", "## Cognitive Traps（认知陷阱）", "## Recommendations（建议）", "## Reflection Checklist（反思清单）", "## Conclusion（结论）".\n\n(2) When mentioning ANY mental model, cognitive bias, or psychological concept, you MUST use the EXACT name from the model list provided above, wrapped in **bold**. Examples:\n- "**Evolution by Natural Selection** suggests..."\n- "**Adaptation & Fitness Landscapes** means..."\n- "**Confirmation Bias** causes..."\n- "**Loss Aversion** leads..."\n- "**Pareto Principle** indicates..."\n- "**Social Proof** drives..."\nUse the EXACT name as shown in the model list above. Do NOT paraphrase or rename models.\n\n(3) General Chinese text is fine, but any mental model name must appear in its exact English form from the provided list, with Chinese translation in parentheses if needed.' : 'Respond in English. When mentioning ANY mental model or cognitive bias, you MUST use the EXACT name from the model list provided above, wrapped in **bold**. Use the EXACT name as shown — do NOT paraphrase or rename models.'}

## Relevant Mental Models for this conversation
${modelSummaries}${webInfoSection}

When the user asks a follow-up question, continue the analysis using these mental models. Be concise and actionable.`;

    // Build messages array with history
    const messages = [{ role: 'system', content: systemPrompt }];

    if (history && history.length > 0) {
      for (const msg of history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    const isFirstMessage = !history || history.length === 0;
    if (isFirstMessage) {
      const sections = isChinese ? [
        '## Scenario Diagnosis（场景诊断）',
        '核心挑战是什么？关键变量有哪些？',
        '## Multi-Dimensional Analysis（多维度分析）',
        '运用心智模型从多个角度拆解这个问题（心理/经济/系统）',
        '## Risk & Tradeoffs（风险与权衡）',
        '主要风险是什么？利弊如何权衡？',
        '## Cognitive Traps（认知陷阱）',
        '可能会陷入哪些偏见？',
        '## Recommendations（建议）',
        '分步行动计划（Step 1, 2, 3...）',
        '## Reflection Checklist（反思清单）',
        '决策前问自己的 3 个问题',
        '## Conclusion（结论）',
        '一句话总结：建议【做/不做/观望】，并说明核心原因'
      ] : [
        '## My Decision Scenario',
        scenario,
        '## Please analyze',
        '1. **Scenario Diagnosis**: What is the core challenge? What are the key variables?',
        '2. **Multi-Dimensional Analysis**: Analyze from multiple angles (psychological/economic/systemic) using mental models',
        '3. **Risk & Tradeoffs**: What are the main risks? How to weigh pros and cons?',
        '4. **Cognitive Traps**: What biases might I fall into?',
        '5. **Recommendations**: Step-by-step action plan',
        '6. **Reflection Checklist**: 3 questions to ask myself before deciding',
        '7. **Conclusion**: One-sentence verdict: [Do/Don\'t/Wait], with core reasoning'
      ];
      messages.push({
        role: 'user',
        content: isChinese
          ? `## 我的决策场景\n${scenario}\n\n## 请分析\n${sections.join('\n')}`
          : `## My Decision Scenario\n${scenario}\n\n## Please analyze\n${sections.join('\n')}`
      });
    } else {
      messages.push({ role: 'user', content: scenario });
    }

    const { analysis, modelUsed, provider } = await callLLM(messages, config, req.body.provider || 'openrouter');

    res.status(200).json({
      analysis,
      models: relevantModels,
      provider: provider || 'multi',
      model: modelUsed,
      _debug: { searchTriggered, webResultsCount: webResults.length }
    });
  } catch (err) {
    console.error('Decision analysis failed:', err);
    res.status(500).json({ error: err.message });
  }
};
