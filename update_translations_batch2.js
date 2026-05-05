// Update Notion with Chinese translations (batch 2: MG-070 to MG-090)
const fetch = require('node-fetch');

const NOTION_TOKEN = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

// Translations for MG-070 to MG-090 (21 models)
const translations = [
  {
    pageId: "353157c6-daef-81c8-a2d8-e500c298113b",
    modelId: "MG-070",
    conceptCN: "递延税收允许资金以税前回报复利增长，随时间推移创造巨大优势。一笔免税复利30年的资金远比每年纳税的资金增长得多，即使税前回报相同。",
    whenToUseCN: "做投资决策时。长期持有递延资本利得税并允许复利。频繁交易产生税收，长期来看会严重损害回报。",
    exampleCN: "如果你以10%回报率投资10万美元并每年缴纳30%税款，30年后你有约76.4万美元。如果你递延税收（如在退休账户中），你有约174万美元。差额超过100万美元。"
  },
  {
    pageId: "353157c6-daef-8163-b00b-f7767018f90d",
    modelId: "MG-071",
    conceptCN: "创造价值和捕获价值是不同的。一家公司可能为社会创造巨大价值但捕获很少利润（航空公司），或创造适度价值但捕获巨大利润（奢侈品牌）。关键问题是：谁保留了剩余价值？",
    whenToUseCN: "评估企业或职业选择时。问：'谁捕获了正在创造的价值？'不是谁创造最多价值，而是谁保留最多。这是非常不同的事情。",
    exampleCN: "航空公司创造巨大价值（交通运输）但捕获很少（低利润率、激烈竞争）。拥有专利的制药公司从创新中捕获巨大价值。"
  },
  {
    pageId: "353157c6-daef-814a-a16f-ec32b0af2b20",
    modelId: "MG-072",
    conceptCN: "每个业务和技术都有有限的使用寿命。创新使现有产品、技能和商业模式过时。过时风险是长期投资的根本风险。",
    whenToUseCN: "进行长期投资或职业选择时。问：'这在10年后还会存在吗？什么可能使它过时？'行业变化越快，过时风险越高。",
    exampleCN: "报纸、座机电话、DVD租赁店——都曾经占主导地位，然后变得过时。即使是伟大的企业也可能被技术变革摧毁。"
  },
  {
    pageId: "353157c6-daef-8192-b5dd-d5cd56dea594",
    modelId: "MG-073",
    conceptCN: "一种持久的竞争优势，保护企业免受竞争对手侵害，就像护城河保护城堡。护城河有多种形式：品牌、转换成本、网络效应、成本优势和专利。没有护城河，竞争会侵蚀所有超额回报。",
    whenToUseCN: "评估企业的长期前景时。问：'什么阻止竞争对手抢走这个业务？'如果答案是'没有'，就没有护城河，也没有可持续优势。",
    exampleCN: "可口可乐的护城河是品牌；微软是转换成本；Facebook是网络效应；亚马逊是规模。每种护城河类型保护方式不同，持久性也不同。"
  },
  {
    pageId: "353157c6-daef-813c-bbd9-ce981a62e22e",
    modelId: "MG-074",
    conceptCN: "一些企业拥有结构性优势，使其能够以低于竞争对手的成本运营。这些可能来自规模、位置、独特资产或专有流程。当成本优势不易复制时，它们创造了可持续的护城河。",
    whenToUseCN: "分析企业竞争地位时。问：'这家公司能否以比竞争对手更低的成本生产相同的产出？这种优势是结构性的还是暂时的？'",
    exampleCN: "沃尔玛的规模赋予其采购能力，小型零售商无法匹敌。Geico的直销模式消除了代理人佣金，赋予其结构性成本优势。"
  },
  {
    pageId: "353157c6-daef-8124-9104-de0e8382d897",
    modelId: "MG-075",
    conceptCN: "当客户认为产品独特或优越时，他们愿意支付溢价。强大品牌创造超越理性比较的情感联系。品牌力量是最持久的护城河之一。",
    whenToUseCN: "评估定价权时。强大品牌可以为本质上相同的产品收取更多费用。溢价本身就是护城河。",
    exampleCN: "可口可乐vs.普通可乐：人们为品牌支付2-3倍，即使盲测显示许多人分不出区别。品牌，而不是液体，是护城河。"
  },
  {
    pageId: "353157c6-daef-813f-bd66-dc538bc37dfe",
    modelId: "MG-076",
    conceptCN: "当客户转换到竞争对手的成本高昂、耗时或有风险时，企业就拥有转换成本护城河。这些成本可以是财务上的（取消费用）、技术上的（数据迁移）或心理上的（学习新系统）。",
    whenToUseCN: "评估客户留存时。问：'客户转换会有多痛苦？'越痛苦，护城河越强。高转换成本=高定价权。",
    exampleCN: "企业软件（SAP、Oracle）：转换需要重新培训数千名员工、迁移多年数据，并有业务中断风险。所以客户留下来并支付年度涨价。"
  },
  {
    pageId: "353157c6-daef-81f7-a718-f36daaf032d2",
    modelId: "MG-077",
    conceptCN: "产品或服务随着更多人使用而变得更有价值。每个新用户为所有现有用户增加价值。这创造了强大的飞轮：更多用户→更多价值→更多用户。赢家通吃的动态使网络效应成为最强的护城河。",
    whenToUseCN: "评估平台业务时。问：'这东西是否随着更多人使用变得更有价值？'如果是，早期领先倾向于复合成主导地位。",
    exampleCN: "Facebook：每个新用户使网络对每个人都更有价值。Visa：每个新商家使卡片对消费者更有用，反之亦然。飞轮是自我强化的。"
  },
  {
    pageId: "353157c6-daef-81b8-a93d-c0745c394f98",
    modelId: "MG-078",
    conceptCN: "随着产量增加，固定成本分摊到更多单位上，降低单位成本。最大的生产者拥有最低的单位成本，能够实现更低的价格或更高的利润率。这创造了良性循环：更低成本→更多销售→更低成本。",
    whenToUseCN: "分析制造或资本密集型企业时。规模最大的公司往往拥有不可逾越的成本优势。",
    exampleCN: "亚马逊的履约网络：仓库和物流的固定成本分摊到数十亿件配送上，单位成本没有竞争对手能匹敌。"
  },
  {
    pageId: "353157c6-daef-81b6-a649-d8153e78b394",
    modelId: "MG-079",
    conceptCN: "随着平台一方面获得更多用户，它吸引另一方面的更多用户（反之亦然）。这种双边网络效应创造了强大的需求侧规模经济，加速增长。",
    whenToUseCN: "评估市场或平台业务时。买家越多，卖家越多；卖家越多，买家越多。这创造了难以停止的飞轮。",
    exampleCN: "Uber：更多司机→等待时间更短→更多乘客→每位司机收入更多→更多司机。双边市场自我强化。"
  },
  {
    pageId: "353157c6-daef-819e-b03e-edeebd619e1c",
    modelId: "MG-080",
    conceptCN: "随着累积生产经验增加，成本可预测地下降。每次产量翻倍，单位成本下降一个稳定的百分比。这不仅是规模问题——它是关于学习、流程改进和迭代。",
    whenToUseCN: "分析流程改进重要的行业时。早期进入者更快积累经验，随时间创造复合优势。",
    exampleCN: "半导体制造：每一代芯片都受益于前几代的学习。英特尔早期的领先优势经过几十年复合。"
  },
  {
    pageId: "353157c6-daef-8137-bc2f-e5c47734b42e",
    modelId: "MG-081",
    conceptCN: "当一家公司控制物理分销基础设施或网络，而复制这些成本太高时，它创造了自然垄断或寡头垄断。资本要求充当进入壁垒。",
    whenToUseCN: "评估基础设施或分销业务时。关键问题：'竞争对手需要多少资本来复制这个网络？'如果答案是数十亿，护城河就很深。",
    exampleCN: "铁路、管道和有线电视网络：初始资本成本如此巨大，复制基础设施在经济上不可行。先发者拥有永久优势。"
  },
  {
    pageId: "353157c6-daef-813c-8e45-ecbf17b45d98",
    modelId: "MG-082",
    conceptCN: "在某些市场，领导者捕获几乎所有价值——或不成比例的份额。当网络效应、转换成本或规模优势创造一个临界点，一个参与者的优势变得自我强化和不可逾越时，就会发生这种情况。",
    whenToUseCN: "评估市场结构时。问：'这是一个领导者越赢越强的市场吗？'如果是，第一名的奖品巨大，第二名的惩罚严重。",
    exampleCN: "搜索（Google）、操作系统（Microsoft）、社交网络（Facebook）。在每一个中，领导者的优势复合直到竞争几乎变得不可能。"
  },
  {
    pageId: "353157c6-daef-81ba-9146-e1e2eec2f231",
    modelId: "MG-083",
    conceptCN: "并非所有护城河都同样持久。一些被技术、监管或消费者偏好的变化侵蚀。关键问题不仅是'有护城河吗？'而是'这个护城河会持续多久？'持久性是区分伟大企业与好企业的关键。",
    whenToUseCN: "进行长期投资时。持续5年的护城河价值远低于持续50年的。问：'什么可能摧毁这个护城河？'",
    exampleCN: "报纸曾经有巨大的护城河（分销、品牌、分类广告），被互联网摧毁。专利护城河会过期。品牌护城河可以持续几代人（可口可乐、好时）。"
  },
  {
    pageId: "353157c6-daef-8126-8302-cd5aab685e01",
    modelId: "MG-084",
    conceptCN: "行业结构——垄断、寡头垄断、垄断竞争或完全竞争——决定了行业中所有参与者的盈利能力。有些行业天生比其他行业更有利可图，与管理质量无关。",
    whenToUseCN: "评估投资时。即使最好的管理者也不能在糟糕的行业中获得好回报。而一个普通管理者在伟大行业中看起来也很聪明。",
    exampleCN: "航空公司：糟糕的行业结构（高固定成本、低差异化、产能过剩）→几十年的低回报。信用卡网络：具有网络效应的寡头垄断→巨大回报。"
  },
  {
    pageId: "353157c6-daef-8104-9596-e0d64bc79cf6",
    modelId: "MG-085",
    conceptCN: "在某些行业，竞争者理性竞争（避免价格战、维持利润率）。在其他行业，竞争是残酷的（价格上竞争到底）。理性竞争保留价值；残酷竞争摧毁价值。",
    whenToUseCN: "分析行业动态时。问：'这些公司是在价值上竞争还是价格上竞争？'寡头倾向于理性竞争；分散市场倾向于残酷竞争。",
    exampleCN: "汽车保险：几家大公司在服务和品牌上竞争，不仅仅是价格→不错的利润率。航空公司：无休止的价格战→几十年来糟糕的利润率。"
  },
  {
    pageId: "353157c6-daef-8145-947f-f069cb4178cc",
    modelId: "MG-086",
    conceptCN: "双边市场，平台连接买家和卖家，通过降低交易成本创造价值。平台不生产商品——它促进交换。关键指标是流动性：足够的买家和卖家使平台有用。",
    whenToUseCN: "评估市场业务时。流动性最高的平台获胜。关注双方是否都在增长，平台是创造净新价值还是只是提取价值。",
    exampleCN: "Airbnb连接房东和旅行者。房东越多，旅行者越想使用它。旅行者越多，房东越想挂牌。这个飞轮是平台经济学的核心。"
  },
  {
    pageId: "353157c6-daef-810b-98d2-fa3efd4e768c",
    modelId: "MG-087",
    conceptCN: "产能过剩摧毁行业盈利能力。当太多参与者建立太多产能时，每个人都会受损。产能增加有纪律的行业比每个人都积极扩张的行业更有利可图。",
    whenToUseCN: "分析资本密集型行业时。问：'参与者是否理性地增加产能，还是每个人都希望建设以抢占市场份额？'后者导致多年的产能过剩和低回报。",
    exampleCN: "半导体周期：公司在繁荣期过度建设，创造萧条期。水泥和钢铁有类似的动态。最谨慎地增加产能的行业产生最好的长期回报。"
  },
  {
    pageId: "353157c6-daef-811e-972e-c1f0fa4cb342",
    modelId: "MG-088",
    conceptCN: "一些业务受益于强大的长期世俗趋势，无论短期波动如何都推动它们前进。'冲浪'这些浪潮远比逆流而上容易。关键是识别哪些浪潮是持久的。",
    whenToUseCN: "评估业务或职业机会时。问：'这是在乘世俗浪潮还是与之对抗？'芒格：'聪明人在世界给他们机会时下重注。'",
    exampleCN: "Amazon乘了电子商务浪潮。Apple乘了移动计算浪潮。处于正确的潮流中比努力游泳更重要。"
  },
  {
    pageId: "353157c6-daef-8150-8085-ce11a641d09c",
    modelId: "MG-089",
    conceptCN: "技术可以是朋友也可以是杀手，取决于谁受益。通常，技术使消费者受益（更低价格），同时摧毁生产者利润（商品化）。问题是：技术是加强你的护城河还是削弱它？",
    whenToUseCN: "评估技术驱动的变革时。问：'谁捕获了这项技术创造的价值？'通常是'消费者，不是生产者。'",
    exampleCN: "航空公司：技术使飞行更便宜（对消费者有利）但摧毁了航空公司盈利能力（对投资者不利）。微芯片：技术改进了产品，但随着竞争加剧，利润率下降。"
  },
  {
    pageId: "353157c6-daef-816b-82b1-d9674c22d40e",
    modelId: "MG-090",
    conceptCN: "超过一定规模后，组织变得更低效，而不是更高效。协调成本增加，决策变慢，内部政治主导。创造优势的规模本身也埋下了衰落的种子。",
    whenToUseCN: "评估大型组织时。问：'规模不经济是否开始超过规模经济？'寻找决策缓慢、内部领地和规避风险作为迹象。",
    exampleCN: "大型科技公司无法像初创公司那样快速推出产品。政府机构做任何事都需要穿越层层官僚机构。它们越大，就越难运作。"
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
