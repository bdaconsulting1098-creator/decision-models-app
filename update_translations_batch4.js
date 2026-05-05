// Update Notion with Chinese translations (batch 4: MG-112 to MG-129)
const fetch = require('node-fetch');

const NOTION_TOKEN = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

// Translations for MG-112 to MG-129 (18 models)
const translations = [
  {
    pageId: "353157c6-daef-81c0-aa01-e865eefc9c4d",
    modelId: "MG-112",
    conceptCN: "每个系统都有一个瓶颈——限制整个系统吞吐量的步骤。改进瓶颈以外的任何东西都不会增加产出。要改进系统，找到瓶颈并首先修复它。",
    whenToUseCN: "试图改进系统产出时。不要优化非瓶颈——它们不限制产出。找到约束并集中所有努力在那里。这就是约束理论。",
    exampleCN: "一个工厂，步骤3每小时只能处理10个单位，而所有其他步骤处理100个。将步骤4改进到每小时200个单位没有任何作用。只有改进步骤3才能增加总产出。"
  },
  {
    pageId: "353157c6-daef-81b3-8019-c939e1233389",
    modelId: "MG-113",
    conceptCN: "原因和结果并不总是成比例的。小的投入可以产生巨大的产出（临界点），大的投入可以产生微小的产出（饱和）。在一个非线性世界中假设线性会导致系统性错误。",
    whenToUseCN: "当假设'多一点努力=多一点结果'时。这往往是错的。问：'投入和产出之间的关系是线性的？还是有阈值、加速或饱和？'",
    exampleCN: "一滴水不会冲垮大坝，但第100万滴会——非线性。给9人团队增加一人增加产出；给99人团队增加一人可能减少产出（协调成本）。"
  },
  {
    pageId: "353157c6-daef-818e-9975-e46b5c377c29",
    modelId: "MG-114",
    conceptCN: "有韧性的系统吸收冲击并继续运行。脆弱的系统在压力下崩溃。关键区别：有韧性的系统有冗余、多样性和余量；脆弱的系统为效率而优化，牺牲了健壮性。",
    whenToUseCN: "设计或评估系统时。问：'当出问题时会发生什么？'有韧性的系统优雅地降级；脆弱的系统灾难性地失败。最危险的系统是那些看起来稳定直到突然崩溃的系统。",
    exampleCN: "准时制供应链高效但脆弱（COVID暴露了这一点）。分散投资有韧性。单一供应商脆弱。日程中的余量创造韧性。"
  },
  {
    pageId: "353157c6-daef-8136-84ba-fe4d2629d885",
    modelId: "MG-115",
    conceptCN: "生物学的基本算法：变异+选择+复制=适应。有效的东西生存和复制；无效的，不。这个过程在漫长的时间尺度上重复，产生非凡的复杂性和适应性。",
    whenToUseCN: "分析竞争动态时。市场、技术和组织通过自然选择进化：最适者生存。不要对抗进化——理解环境在选择什么。",
    exampleCN: "商业进化：适应变化市场的公司生存；不适应的，消亡。市场是选择环境。生存不是关于成为最好的——而是关于最适合当前环境。"
  },
  {
    pageId: "353157c6-daef-8181-aa13-cbc7e7bd5243",
    modelId: "MG-116",
    conceptCN: "适应度景观将每种可能的策略映射到其适应度水平。峰值代表好策略；山谷代表差策略。挑战：你可能在一个局部峰值（好但不是最好），需要穿过山谷（暂时更差）才能到达更高的峰值。",
    whenToUseCN: "当你被困在'足够好'水平时。要到达更高的峰值，你可能需要暂时变得更差。问：'我在局部峰值上吗？是否有更高的峰值值得穿越山谷？'",
    exampleCN: "一家成功的公司需要自我蚕食产品以到达更高的峰值（Apple杀死iPod以建造iPhone）。山谷（暂时更低的利润）是到达更高峰值所必需的。"
  },
  {
    pageId: "353157c6-daef-81af-b4e7-cadc4a504678",
    modelId: "MG-117",
    conceptCN: "'你必须尽力奔跑才能保持在原地。'在竞争环境中，你必须持续改进才能维持你的相对位置。原地不动意味着落后。",
    whenToUseCN: "评估竞争动态时。如果你的竞争对手在改进，你必须至少以同样快的速度改进才能保持平衡。红皇后效应解释了为什么持续创新是必要的，而不是可选的。",
    exampleCN: "科技公司：英特尔的tick-tock节奏不是可选的——AMD在不断改进。如果英特尔停止，AMD就会赶上。在任何竞争领域，原地不动=落后。"
  },
  {
    pageId: "353157c6-daef-8128-85a9-c1b9da2ac7eb",
    modelId: "MG-118",
    conceptCN: "物种（和企业）在利基市场中茁壮成长——它们拥有优势的特定环境。当两个物种占据同一利基时，它们激烈竞争直到一个主导或它们差异化。找到一个未被占据的利基远比争夺一个已被占据的利基容易。",
    whenToUseCN: "进入市场时。问：'这个利基被占据了吗？如果是，我能差异化吗？'最好的策略往往是找到一个未被占据的利基，而不是与老牌企业正面竞争。",
    exampleCN: "西南航空占据了主要航空公司忽视的短途、低成本利基。一旦建立，利基是可防御的。找到你的利基是找到你能力圈的生物学等价物。"
  },
  {
    pageId: "353157c6-daef-81c3-aa9b-c8aac892ffc6",
    modelId: "MG-119",
    conceptCN: "种群指数增长直到受到资源限制，然后崩溃或稳定。这种繁荣-萧条循环出现在生物种群、市场、行业和趋势中。了解你在循环中的位置至关重要。",
    whenToUseCN: "评估快速增长的市场或趋势时。问：'我们处于繁荣阶段还是接近萧条？'指数增长永远不会永远持续——总有什么东西限制它。问题是什么时候以及如何达到极限。",
    exampleCN: "2017年加密货币：用户和价格指数增长，然后崩盘。COVID病例：指数增长直到措施/限制生效。行业产能：繁荣建设，萧条摧毁。"
  },
  {
    pageId: "353157c6-daef-8119-86ff-c1c078fd13d2",
    modelId: "MG-120",
    conceptCN: "研究失败以理解什么有效。在医学中，尸检揭示死亡原因，改善对生者的治疗。在商业和投资中，失败企业的尸检揭示要避免的模式。死者教导生者。",
    whenToUseCN: "在任何失败之后——你的或他人的。进行无责备的尸检。问：'出了什么问题？我会怎么做不同？'失败的教训往往比成功的教训更有价值。",
    exampleCN: "芒格研究商业失败（不仅仅是成功）以理解什么摧毁价值。航空从每次坠机中学习以改善安全。原则：研究什么会致死，不仅仅是茁壮成长的因素。"
  },
  {
    pageId: "353157c6-daef-8189-9e93-e81709257253",
    modelId: "MG-121",
    conceptCN: "公司被指导和控制的规则、实践和流程系统。良好的治理使管理层与股东利益一致；糟糕的治理允许管理层以股东利益为代价自我致富。",
    whenToUseCN: "作为投资评估公司时。问：'管理层的利益与股东一致吗？董事会独立且有能力吗？'糟糕的治理最终会摧毁价值。",
    exampleCN: "拥有双重股权结构的公司，内部人士控制投票权而不考虑经济所有权。董事会成员是CEO的朋友。这些治理缺陷预示着未来的问题。"
  },
  {
    pageId: "353157c6-daef-81a7-9642-c73fa9d7f8ba",
    modelId: "MG-122",
    conceptCN: "你如何支付人们决定他们如何行为。佣金结构、股票期权、奖金和薪水组合都创造不同的激励。薪酬设计就是组织行为设计。",
    whenToUseCN: "设计或评估薪酬系统时。问：'这个薪酬结构激励什么行为？'如果你激励短期指标，你会得到短期思维。",
    exampleCN: "10年归属的股票期权激励长期思维。季度奖金激励短期结果。芒格：'告诉我激励机制，我就告诉你结果。'"
  },
  {
    pageId: "353157c6-daef-81d5-9cf5-fa937bc2a21d",
    modelId: "MG-123",
    conceptCN: "组织文化——不成文的规范、价值观和期望——往往比正式规则更强大。文化决定了人们在没人看的时候做什么。强大的文化是竞争优势；弱的文化是竞争劣势。",
    whenToUseCN: "评估组织时。强大的文化（如Costco或伯克希尔的）减少了对监督和执行的需求。有毒的文化产生的成本没有任何政策能修复。",
    exampleCN: "Costco善待员工的文化导致低流动率和高生产率——竞争优势。安然激进的冒险文化导致欺诈——竞争劣势。"
  },
  {
    pageId: "353157c6-daef-81e7-9272-d5fd94a6d856",
    modelId: "MG-124",
    conceptCN: "组织随时间自然积累官僚主义。管理者建立帝国（雇佣更多员工、扩大预算），因为他们的权力和薪酬与组织规模挂钩，而不是效率。这种惯性使大型组织变得缓慢和昂贵。",
    whenToUseCN: "评估或在大型组织内工作时。问：'这个人是在为组织的成功优化还是为他们自己的帝国？'官僚惯性是自然状态；对抗它需要持续的努力。",
    exampleCN: "一个经理即使部门不再需要后仍努力保留它，因为失去员工意味着失去地位。无论实际效用如何增长的政府机构。"
  },
  {
    pageId: "353157c6-daef-81f7-ad94-ca7f8bb848f6",
    modelId: "MG-125",
    conceptCN: "在组织中，坏消息往往到不了顶层。传递坏消息的使者会受到惩罚（明确或暗示），创造一种问题被隐藏直到变成危机的文化。你越往上走，你的信息被过滤得越多。",
    whenToUseCN: "当你是领导者时：积极寻求坏消息并奖励使者。当你分析一个组织时：假设到达顶层的信息比现实更乐观。",
    exampleCN: "挑战者号灾难：工程师关于O形圈故障的警告被管理层压制。安然：提出担忧的会计师被边缘化。模式：杀死使者，然后问题杀死你。"
  },
  {
    pageId: "353157c6-daef-812c-8fd6-c70dee3b742b",
    modelId: "MG-126",
    conceptCN: "有效的沟通回答谁、什么、哪里、何时和为什么。省略其中任何一个都会造成困惑、错位和错误。五个W确保完整性并减少误解的机会。",
    whenToUseCN: "撰写或传达重要沟通时。检查：'我涵盖了谁、什么、哪里、何时和为什么吗？'如果缺少任何W，沟通就不完整。",
    exampleCN: "一个项目简报说'建造新功能'（什么），但没有说明谁负责、何时到期、它在哪里存在或为什么重要。不完整的沟通=不完整的执行。"
  },
  {
    pageId: "353157c6-daef-8157-b2d2-cf70ccab055c",
    modelId: "MG-127",
    conceptCN: "正式化的检查清单和标准操作程序防止错误并确保一致性，特别是在压力或疲劳下。它们将知识外化，使其不依赖于任何个人的记忆。被正式化的会被执行；留在某人脑子里的会被遗忘。",
    whenToUseCN: "对于任何重要、重复的流程。如果风险很高且流程复杂，写下来并遵循检查清单。不要相信记忆——相信系统。",
    exampleCN: "起飞前的航空检查清单。手术前的外科检查清单。承诺资本前的投资检查清单。共同点：高风险+人类记忆=遗漏的配方。"
  },
  {
    pageId: "353157c6-daef-81e1-98ef-e432e60d46fa",
    modelId: "MG-128",
    conceptCN: "雇佣少数你信任的高素质人才，然后大量授权。错误雇佣的成本巨大（他们摧毁价值并拖累团队），而优秀雇佣的好处随时间复利。信任实现授权；授权实现规模。",
    whenToUseCN: "雇佣或建立团队时。芒格和巴菲特的方法：雇佣你不必管理的人。如果你不能信任某人，不要雇佣他们。如果你必须微观管理，你用错了人。",
    exampleCN: "伯克希尔·哈撒韦的方法：收购由诚实、有能力的管理者运营的优秀企业，然后让他们独立运作。基于信任的模式减少开销并保留企业家精神。"
  },
  {
    pageId: "353157c6-daef-819e-9fd0-e00782fc9619",
    modelId: "MG-129",
    conceptCN: "群体可能做出比个人更糟糕的决策，因为群体思维、社会认同、权威偏见和从众压力。群体越大，从众压力越强，决策可能越糟糕。独立思考是解药。",
    whenToUseCN: "在群体中做决策时。积极征求不同意见。指定某人扮演魔鬼代言人。让人们在小组讨论前独立写下他们的立场。永远不要让群体覆盖你自己的分析。",
    exampleCN: "每个人都同意的投资委员会往往是错的。最好的决策来自严格的辩论，而不是共识。芒格和巴菲特经常意见不一——并因此变得更好。"
  }
];

async function updatePage(pageId, conceptCN, whenToUseCN, exampleCN) {
  const properties = {};
  
  if (conceptCN && conceptCN.trim()) {
    properties['Core Concept (CN)'] = {
      rich_text: [{ text: { content: conceptCN.substring(0, 2000) } }]
    };
  }
  
  if (whenToUseCN && whenToUseCN.trim()) {
    properties['When to Use (CN)'] = {
      rich_text: [{ text: { content: whenToUseCN.substring(0, 2000) } }]
    };
  }
  
  if (exampleCN && exampleCN.trim()) {
    properties['Example (CN)'] = {
      rich_text: [{ text: { content: exampleCN.substring(0, 2000) } }]
    };
  }

  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ properties })
  });

  return response.ok;
}

async function main() {
  console.log(`Updating ${translations.length} models with Chinese translations...\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const t of translations) {
    console.log(`Updating ${t.modelId}...`);
    const ok = await updatePage(t.pageId, t.conceptCN, t.whenToUseCN, t.exampleCN);
    if (ok) {
      success++;
      console.log(`  ✅ Success`);
    } else {
      failed++;
      console.log(`  ❌ Failed`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log(`\nComplete: ${success} success, ${failed} failed`);
}

main().catch(console.error);
