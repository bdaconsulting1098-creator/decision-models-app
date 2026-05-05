// Update Notion with Chinese translations (batch 1: MG-049 to MG-069)
const fetch = require('node-fetch');

const NOTION_TOKEN = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

// Translations for MG-049 to MG-069 (21 models)
const translations = [
  {
    pageId: "353157c6-daef-8175-84e0-f33f2f708cf7",
    modelId: "MG-049",
    conceptCN: "极端、不可预测的事件对结果有巨大的影响。这些事件罕见、后果严重，且只能事后解释。正态分布低估了极端事件的概率和影响。",
    whenToUseCN: "构建系统或投资组合时。不要只考虑平均结果——要为极端情况做准备。建立冗余、安全边际和反脆弱性。",
    exampleCN: "2008年金融危机、COVID-19疫情、互联网的兴起——都是黑天鹅事件：事前不可预测，影响巨大，事后看来'显而易见'。"
  },
  {
    pageId: "353157c6-daef-81a2-8ea9-f47b1c801af1",
    modelId: "MG-050",
    conceptCN: "黑天鹅的对立面——高概率、高影响的威胁，显而易见却被忽视。就像一头灰色犀牛向你冲来：你看到它来了，但直到太晚才行动。",
    whenToUseCN: "当有一个你正在忽视的明显风险，因为它太大或太难以解决。问：'我正在回避什么重大、明显的威胁？'",
    exampleCN: "气候变化、基础设施老化、不可持续的债务水平——都是明显、可预测、高影响的威胁，人们忽视它们，因为解决起来困难且代价高昂。"
  },
  {
    pageId: "353157c6-daef-8198-a43b-d2f50dbfe64b",
    modelId: "MG-051",
    conceptCN: "让想法生动具体，使其留在记忆中并影响行为。抽象原则容易被遗忘；生动的例子和故事会被记住并付诸行动。",
    whenToUseCN: "当试图记住心智模型或向他人传授时。将抽象概念转化为生动、具体的故事。越生动，对未来思考的影响就越强大。",
    exampleCN: "芒格自己的演讲充满生动的例子——他不仅说'注意激励机制'，他讲述腐败评估师和被操纵医生的故事。"
  },
  {
    pageId: "353157c6-daef-8138-a268-fe942353df3d",
    modelId: "MG-052",
    conceptCN: "'对于手里拿着锤子的人来说，所有东西看起来都像钉子。'人们过度使用他们最熟悉的工具和模型，将它们应用到不适合的问题上。这是跨学科思维的核心原因。",
    whenToUseCN: "当你发现自己对每个问题都使用相同的方法时。问：'我使用这个工具是因为它正确，还是因为它是我唯一知道的一个？'",
    exampleCN: "一个金融人员把每个问题都简化成电子表格；一个工程师把每个问题都视为技术问题；一个心理学家把一切都归因于童年。都是锤子，没有螺丝刀。"
  },
  {
    pageId: "353157c6-daef-8169-a2e5-dddc1d0149e8",
    modelId: "MG-053",
    conceptCN: "价格由供给和需求的交点决定。当供给超过需求时，价格下跌。当需求超过供给时，价格上涨。这是经济学中最基本的模型。",
    whenToUseCN: "评估市场动态、定价决策或投资机会时。总是问：'供给发生了什么？需求发生了什么？'",
    exampleCN: "建筑受限（供给有限）且人口增长（需求增加）的城市房价上涨。该模型在价格实际上涨之前就预测到了上涨。"
  },
  {
    pageId: "353157c6-daef-813d-a34d-c273f40e0ed1",
    modelId: "MG-054",
    conceptCN: "需求或供给对价格变化的反应程度。缺乏弹性的商品（必需品、成瘾性产品）在价格变化时需求变化很小。弹性商品（奢侈品、有替代品）变化很大。",
    whenToUseCN: "为产品定价或评估企业时。需求缺乏弹性的企业（如香烟、制药）有定价权；需求弹性的企业靠价格竞争。",
    exampleCN: "苹果可以提高iPhone价格而不失去很多客户（由于品牌忠诚度和生态系统锁定，需求缺乏弹性）。一个普通食品品牌做不到（需求有弹性——有很多替代品）。"
  },
  {
    pageId: "353157c6-daef-817d-8933-d00b53776517",
    modelId: "MG-055",
    conceptCN: "任何选择的真实成本是你放弃的最佳替代方案的价值。花在一件事上的金钱、时间和注意力不能花在另一件事上。机会成本是经济学的核心概念。",
    whenToUseCN: "每次你说'是'的时候，你在对其他事情说'不'。总是问：'通过做这件事我放弃了什么？'看不见的成本往往超过看得见的成本。",
    exampleCN: "读研究生不仅花费学费，还有两年损失的工资。投资股票A意味着你不能把那笔钱投资股票B。花在会议上的时间是没花在思考上的时间。"
  },
  {
    pageId: "353157c6-daef-817b-b17b-c7060f1a7bbb",
    modelId: "MG-056",
    conceptCN: "即使你在所有方面都比别人差，你也应该专注于你最不擅长的事情并进行交易。关键不是绝对优势，而是相对优势——你生产时放弃最少的东西。",
    whenToUseCN: "决定自己做什么vs.委托或外包时。专注于你的比较优势，其余的交易获得。这适用于个人、公司和国家的决策。",
    exampleCN: "一个也是优秀程序员的CEO仍然应该委托编程——不是因为她不擅长，而是因为她的比较优势在战略决策，在那里编程的机会成本是巨大的。"
  },
  {
    pageId: "353157c6-daef-8181-ac3a-e566b7edf480",
    modelId: "MG-057",
    conceptCN: "某物的每个额外单位提供的满足感或价值比前一个少。第一片披萨很棒；第五片就一般了。第一个一百万美元改变你的生活；第十个几乎没有感觉。",
    whenToUseCN: "分配资源时。最优点的边际收益等于边际成本——不是总收益最大化的地方。超过这个点继续会破坏价值。",
    exampleCN: "每天学习2小时非常高效；学习10小时收益递减并导致倦怠。第5小时的会议几乎没有增加任何东西。第3层审查几乎没有发现新错误。"
  },
  {
    pageId: "353157c6-daef-813d-8d6b-c05541c52a8a",
    modelId: "MG-058",
    conceptCN: "今天的一美元比明天的一美元更有价值，因为有可能投资并获得回报。这个基本原则是所有金融和投资的基础。",
    whenToUseCN: "比较不同时间的现金流时。总是将未来现金流折现到现值。越远的未来，价值越低（其他条件相同）。",
    exampleCN: "今天投资的100美元以10%回报率变成明年的110美元——所以今天的100美元=明年的110美元。任何明年给你105美元换取今天100美元的提议在10%折现率下都是糟糕的交易。"
  },
  {
    pageId: "353157c6-daef-81f4-b915-eb8b9e8c7efd",
    modelId: "MG-059",
    conceptCN: "人类行为中最强大的力量。如果你把激励搞对了，系统就会运作。如果你搞错了，其他都不重要。激励一致性意味着确保代理人的利益与委托人的利益相匹配。",
    whenToUseCN: "设计任何系统时——公司、团队、合同、政府政策。芒格：'告诉我激励机制，我就告诉你结果。'如果结果不好，先看激励。",
    exampleCN: "按贷款量支付银行家→他们发放不良贷款。按考试分数支付教师→他们为考试而教。将激励与期望结果对齐，而不是容易钻空子的指标。"
  },
  {
    pageId: "353157c6-daef-8197-a6d9-f401c4d5a525",
    modelId: "MG-060",
    conceptCN: "当一个人（代理人）代表另一个人（委托人）做决定时，他们的利益可能分歧。代理人可能为了自己的利益而非委托人的利益行事，尤其是在监督成本高昂时。",
    whenToUseCN: "评估任何委托决策时。问：'代理人的激励与我的对齐吗？如果我处于他们的位置，我会怎么表现？'",
    exampleCN: "CEO最大化短期股价（有利于他们的期权）以牺牲长期价值为代价（伤害股东）。房地产经纪人推动快速销售而非最佳价格。"
  },
  {
    pageId: "353157c6-daef-8166-92f6-f61aa98d7a27",
    modelId: "MG-061",
    conceptCN: "当交易中的一方拥有比另一方更多或更好的信息时。信息充分的一方可以利用信息不足的一方。这就是为什么存在'买者自慎'以及信任如此有价值。",
    whenToUseCN: "进入对方比你了解更多信息的任何交易时。获取独立验证。了解较少的人是会被占便宜的一方。",
    exampleCN: "二手车销售（卖家知道车的缺陷）、医疗保健（医生比患者知道更多）、保险（买家比保险公司更了解自己的风险）。"
  },
  {
    pageId: "353157c6-daef-8182-8648-ce778b126a9f",
    modelId: "MG-062",
    conceptCN: "最渴望交易的人是你最不想打交道的人。风险最高的人最可能买保险；生病的人最可能报名医疗保健。市场选择了对谨慎者不利的一方。",
    whenToUseCN: "当提供或接受一个好得难以置信的交易时。问：'为什么这个人如此渴望做这笔交易？他们知道什么我不知道的？'",
    exampleCN: "唯一想买你的人寿保险单的人是那些知道自己生病的人。唯一想卖给你他们的企业的人是那些知道企业正在衰退的人。"
  },
  {
    pageId: "353157c6-daef-8186-945e-fa6736873ea3",
    modelId: "MG-063",
    conceptCN: "当人们因为受到保护免受后果影响而承担更多风险时。保险、救助和担保都创造了道德风险，因为它们将决策者与糟糕决策的成本分离开来。",
    whenToUseCN: "设计安全网或担保时。如果你消除了所有下行风险，你也消除了小心的激励。最好的系统有利益攸关。",
    exampleCN: "银行因为知道政府会救助它们而发放鲁莽的贷款。拥有全面保险的人对财产不那么小心。"
  },
  {
    pageId: "353157c6-daef-8156-af86-d2f8427195cd",
    modelId: "MG-064",
    conceptCN: "80%的结果来自20%的原因。80%的收入来自20%的客户。80%的错误来自20%的代码。这种幂律分布出现在自然和商业的各个地方。",
    whenToUseCN: "确定优先级时。找到推动80%结果的20%并专注于那里。不要平均分配努力——专注于最高杠杆的活动。",
    exampleCN: "投资中：80%的回报来自20%的仓位。销售中：80%的收入来自20%的客户。生活中：80%的幸福来自20%的活动。"
  },
  {
    pageId: "353157c6-daef-8101-bd32-ccc7a05fcc60",
    modelId: "MG-065",
    conceptCN: "'劣币驱逐良币。'更广泛地说：当两种形式的东西流通而一种较差时，较差的版本往往占主导地位，因为人们囤积较好的版本。适用于货币、规范、文化和人才。",
    whenToUseCN: "当你看到系统中的质量下降时。如果容忍不良行为，它会驱逐良好行为。如果低质量内容得到奖励，高质量内容就会消失。",
    exampleCN: "在一个偷工减料受到奖励而彻底性受到惩罚的公司里，认真工作的员工离开，偷工减料的人留下。有毒文化驱逐健康文化。"
  },
  {
    pageId: "353157c6-daef-812e-9b76-da5e8d8cc2a7",
    modelId: "MG-066",
    conceptCN: "熊彼特的洞见：资本主义通过破坏旧结构来创造新结构而进步。创新不仅是增加——它是替代。每个新技术都会破坏之前事物的经济价值。",
    whenToUseCN: "评估长期投资或职业选择时。问：'这个业务/行业/技能是否容易受到创造性破坏？'为一个创造价值的东西会为另一个破坏价值。",
    exampleCN: "数码相机摧毁了胶卷（柯达）。流媒体摧毁了百视达。AI正在摧毁某些类型的工作，同时创造其他工作。这个过程痛苦但推动进步。"
  },
  {
    pageId: "353157c6-daef-817b-8d5d-ca0b4d654034",
    modelId: "MG-067",
    conceptCN: "企业的真正价值是对于一个可以获取所有现金流的知情私人所有者来说的价值——不是受情绪和动量影响的股票市场价格。",
    whenToUseCN: "评估企业或投资时。问：'如果我可以完全拥有它并获取所有现金流，我会付多少钱？'这剥离了市场噪音。",
    exampleCN: "一只以50倍收益交易的股票可能'定价完美'，而私人所有者只会支付10-15倍。芒格和巴菲特以私人所有者估值购买企业，而不是市场价格。"
  },
  {
    pageId: "353157c6-daef-81f7-bdf1-f948c466eb1f",
    modelId: "MG-068",
    conceptCN: "格雷厄姆的比喻：市场是一个名叫市场先生的躁郁症合伙人。有些天他欣快并提供高价；其他天他抑郁并提供便宜货。你可以接受或忽视他的提议——他不在乎。",
    whenToUseCN: "当市场价格剧烈波动时。记住：市场是为你服务的，不是来通知你的。不要让市场先生的情绪决定你的决策。",
    exampleCN: "在市场崩盘期间，市场先生抑郁并提供便宜货。在泡沫期间，他欣快并提供膨胀的价格。明智的投资者忽视他的情绪，专注于价值。"
  },
  {
    pageId: "353157c6-daef-81fb-9b5f-f996e18716ed",
    modelId: "MG-069",
    conceptCN: "总是在你认为某物价值和你支付的价格之间建立一个缓冲。如果你认为一只股票值100美元，不要付99美元——付60或70美元。安全边际保护你免受估计错误和坏运气的影响。",
    whenToUseCN: "在任何估计不确定的决策中（这包括大多数决策）。不要切得太近——为错误留出空间。不确定性越大，需要的安全边际越大。",
    exampleCN: "工程：桥梁建造为承受预期负载的5倍。投资：以显著低于内在价值的折扣购买。生活：为重要会议提前出发。都是安全边际。"
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
