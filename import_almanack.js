const fetch = require('node-fetch');
const fs = require('fs');

const token = fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env', 'utf-8').match(/NOTION_TOKEN=(.+)/)[1].trim();
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

const models = [
  // === PSYCHOLOGY OF HUMAN MISJUDGMENT - 25 Tendencies ===
  {
    name: "Reward Superresponse Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "incentives", "munger"],
    source: "munger",
    coreConcept: "People tend to do what they are rewarded for doing. Incentives are powerful predictors of behavior — perhaps the most powerful of all. What gets rewarded gets done. This applies to individuals, corporations, and institutions. The key is to design reward systems carefully, as perverse incentives create perverse outcomes.",
    whenToUse: "Use this model when designing systems, managing people, or analyzing why others behave the way they do. Ask: what are they being rewarded for? This reveals the true cause behind observed behavior, often hidden behind stated reasons.",
    example: "A salesperson paid only on commission will prioritize sales over customer welfare. A hospital that rewards only procedures performed will overtreat patients. Invert: to change behavior, change the reward structure."
  },
  {
    name: "Liking/Loving Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "social", "munger"],
    source: "munger",
    coreConcept: "People tend to distort their thinking to favor those they like or love. This affects hiring, investing, relationships, and negotiations. We ignore flaws in loved ones and give them benefits of the doubt we would never extend to strangers.",
    whenToUse: "Use when making decisions about people — hiring, partnerships, investments. Ask: am I favoring this person because of their merits, or because I like them? Keep personal feelings separate from objective evaluation.",
    example: "An investor who likes a charismatic CEO may ignore warning signs about the business. A manager who loves an employee may overlook repeated underperformance."
  },
  {
    name: "Disliking/Hating Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "social", "munger"],
    source: "munger",
    coreConcept: "The flip side of liking: people also distort their thinking against those they dislike or hate. This can lead to rejecting good ideas from disliked sources and supporting bad ideas that harm enemies.",
    whenToUse: "Use when evaluating arguments or proposals from people you dislike. Ask: would I reject this idea if it came from someone neutral? Separate the idea from the person.",
    example: "A board rejects a brilliant strategy proposal because it came from a rival division. An investor avoids a good company because the founder once insulted them."
  },
  {
    name: "Doubt-Avoidance Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "decision-making", "munger"],
    source: "munger",
    coreConcept: "The brain is wired to resolve doubt by reaching quick conclusions. This tendency leads people to seize on whatever answer is available rather than tolerating uncertainty. It drives religious belief, ideological certainty, and snap judgments.",
    whenToUse: "Use when you feel the urge to reach a conclusion quickly. Pause and embrace the discomfort of uncertainty. The decision that requires the least doubt is often the one you should question most.",
    example: "During uncertainty, people turn to authority figures, ideologies, or tribal narratives to restore confidence. Markets panic when investors cannot tolerate doubt about the future."
  },
  {
    name: "Inconsistency-Avoidance Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "commitment", "munger"],
    source: "munger",
    coreConcept: "People go to great lengths to be consistent with their prior commitments. Once a public commitment is made, people are reluctant to reverse it even when evidence demands it. This is why first impressions are so powerful and why written records matter.",
    whenToUse: "Use when you want to lock in good behavior (make commitments public) or when analyzing why organizations resist change. Ask: is this person defending a past decision rather than adapting to new information?",
    example: "General Motors continued investing in gas-guzzling cars long after oil prices made them uncompetitive, because they had publicly committed to the strategy. People stay in unhappy marriages because ending them would mean admitting the initial decision was wrong."
  },
  {
    name: "Curiosity Tendency",
    category: "General Thinking Tools",
    tags: ["psychology", "learning", "munger"],
    source: "munger",
    coreConcept: "Humans have a natural curiosity that drives learning across disciplines. This tendency is essential for acquiring the multidisciplinary mental models Munger advocates. It is the engine of intellectual growth but can also lead to distraction.",
    whenToUse: "Use to fuel continuous learning. Cultivate curiosity about fields outside your expertise. The most valuable insights often come from unexpected places — read widely, not just in your field.",
    example: "Munger reads extensively across physics, biology, psychology, economics, and history. His investment insights often come from analogies to other fields, like the application of evolutionary biology to business competition."
  },
  {
    name: "Kantian Fairness Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "ethics", "munger"],
    source: "munger",
    coreConcept: "People have a strong sense of fairness and will punish perceived unfairness even at personal cost. This tendency underlies cooperation, reciprocity, and social norms. Violations of fairness are remembered and resented long after the event.",
    whenToUse: "Use when designing systems, negotiating, or analyzing social conflicts. Fairness is a powerful social glue — violate it and pay the price. People will cooperate with fair systems and undermine unfair ones.",
    example: "Customers will boycott a company perceived as price-gouging during a crisis. Employees who discover unfair pay ratios will reduce productivity or quit, even when the absolute pay is generous."
  },
  {
    name: "Envy/Jealousy Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "emotions", "munger"],
    source: "munger",
    coreConcept: "Envy is a powerful and universal human drive, especially visible in children early in life. It drives competition, comparison, and often irrational decision-making. People are often more motivated by fear of being worse off than the desire to be better off.",
    whenToUse: "Use when analyzing financial manias, competitive behavior, and personal dissatisfaction. Ask: am I making this decision because it is good, or because I cannot bear someone else having what I do not?",
    example: "Dot-com investors in the 1990s were driven by envy of neighbors getting rich, not rational analysis. Employees demand raises not because they are underpaid, but because colleagues earn more."
  },
  {
    name: "Reciprocation Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "social", "munger"],
    source: "munger",
    coreConcept: "Humans have a powerful drive to return favors, gifts, and injuries in kind. This tendency is the foundation of all human societies and can be exploited through the 'door-in-the-face' technique. It operates even when the favor is unwanted.",
    whenToUse: "Use when negotiating, building relationships, or designing deals. Give first to receive. Be wary of unsolicited favors — they create obligation. The most effective persuaders make the first concession, triggering reciprocation.",
    example: "Waiters who bring mints to the table receive larger tips, even if the mints are not taken. Salespeople use 'foot-in-the-door' techniques: a small yes leads to a larger one."
  },
  {
    name: "Influence-from-Mere-Association Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "conditioning", "munger"],
    source: "munger",
    coreConcept: "People judge things by association — connecting stimuli to outcomes they like or dislike. Advertising exploits this by pairing products with attractive people. Politics pairs candidates with flags and patriotic symbols. The mere smell of a hospital can trigger illness associations.",
    whenToUse: "Use to understand how persuasion works and to manage your own associations. Be aware that being seen with certain people or ideas rub off on how you are perceived. Athletes perform better wearing their team's colors.",
    example: "A politician who is photographed with a popular figure gains credibility by association. A company sponsors a beloved sports team to transfer the team's positive feelings to the brand."
  },
  {
    name: "Pain-Avoiding Psychological Denial",
    category: "Human Nature and Judgment",
    tags: ["psychology", "denial", "munger"],
    source: "munger",
    coreConcept: "When reality is too painful, the mind refuses to accept it. This is the root of many bad decisions — people deny the problem rather than face it. This tendency explains addiction, failed relationships, and financial disasters.",
    whenToUse: "Use when a situation has become clearly unsustainable but people refuse to acknowledge it. The stronger the emotion, the more likely denial. Ask: what would I conclude if I had no emotional investment in this?",
    example: "Shareholders of Enron refused to believe the fraud despite obvious red flags. An alcoholic insists they have their drinking under control. A country denies that a war is being lost."
  },
  {
    name: "Excessive Self-Regard Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "ego", "munger"],
    source: "munger",
    coreConcept: "People consistently overestimate their own abilities, performance, and moral standing relative to others. Most drivers believe they are above-average drivers. Most managers believe they are above-average managers. This leads to poor decisions, failed investments, and strained relationships.",
    whenToUse: "Use when evaluating your own performance or decisions. Systematically seek disconfirming evidence. Ask: what would I think if someone else made this decision? Be especially wary after successes, when self-regard is inflated.",
    example: "90% of drivers believe they are above-average — a statistical impossibility. Most merger-and-acquisition deals destroy value, yet most CEOs believe their deal will be the exception. Couples filing for divorce typically blame their partner while taking no responsibility."
  },
  {
    name: "Overoptimism Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "optimism", "munger"],
    source: "munger",
    coreConcept: "People are genetically hardwired to be overly optimistic about their futures. This leads to underestimating the probability of negative events, overestimating the likelihood of success, and underestimating the difficulty of difficult projects.",
    whenToUse: "Use when planning projects, launching ventures, or evaluating risk. Apply the deconstruction technique: estimate how long and how much each step will really take, then multiply by your estimate. Ask: what could go catastrophically wrong?",
    example: "Most large construction projects finish late and over budget. Most startups fail, yet founders typically believe they will be among the few successes. People underestimate divorce rates when marrying and project failure rates when investing."
  },
  {
    name: "Deprival-Superreaction Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "loss", "munger"],
    source: "munger",
    coreConcept: "People react far more strongly to the threat of loss than to the promise of equivalent gain. Losing $100 feels about twice as painful as gaining $100 feels good. This is loss aversion and it explains risk aversion, the endowment effect, and the status quo bias.",
    whenToUse: "Use when evaluating decisions under uncertainty or analyzing market behavior. The fear of loss is more powerful than the hope of gain. Frame outcomes in terms of what you might lose, not just what you might gain.",
    example: "Investors hold losing stocks too long to avoid realizing a loss, while selling winners too soon. A 10% chance of losing $1000 generates more anxiety than a 10% chance of winning $1500."
  },
  {
    name: "Social Proof Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "conformity", "munger"],
    source: "munger",
    coreConcept: "People look to the actions and reactions of others to determine their own behavior, especially in uncertain situations. This drives herd behavior, conformity, and the spread of both wise and foolish fads. We assume if everyone is doing it, it must be right.",
    whenToUse: "Use when evaluating trends, fads, and social movements. Question whether the crowd is wise or panicking. Social proof is most dangerous when you are most uncertain — that is exactly when you need independent thinking most.",
    example: "During a fire in a crowded theater, people trample each other fleeing through the exit they entered, even though other exits are available. The popularity of a stock is used as proof of its quality, regardless of fundamentals. Restaurant menu items marked as popular sell more."
  },
  {
    name: "Contrast-Misreaction Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "perception", "munger"],
    source: "munger",
    coreConcept: "People do not perceive things in absolute terms — they perceive them in comparison to what was experienced immediately before. A moderate price seems high after a high price. A mediocre report seems terrible after a bad one. This is exploited constantly in sales and marketing.",
    whenToUse: "Use when evaluating offers, prices, or performance. Never evaluate something in isolation — always compare to relevant alternatives. Ask: is this price high because of the item, or because of what was shown before?",
    example: "Car dealers show expensive options first so the final price seems reasonable by comparison. A mediocre employee looks brilliant after a terrible predecessor. An expensive item makes the next item seem cheap."
  },
  {
    name: "Stress-Influence Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "stress", "munger"],
    source: "munger",
    coreConcept: "Mild stress can improve performance and make people more responsive to social proof and authority. However, extreme stress causes breakdown, panic, and irrational behavior. The breakpoint varies by individual but exists for everyone.",
    whenToUse: "Use when managing yourself or others under pressure. Know your own stress breakpoint and avoid making important decisions when near it. Build systems that function even when people are stressed.",
    example: "A student who performs well under moderate exam pressure may freeze completely under extreme stress. The Milgram experiment showed that ordinary people delivered lethal shocks when ordered to by an authority figure under stress."
  },
  {
    name: "Availability-Misweighing Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "memory", "munger"],
    source: "munger",
    coreConcept: "People give disproportionate weight to information that is easily recalled — recent events, vivid stories, dramatic events — at the expense of statistically more relevant but harder-to-remember data. This distorts risk assessment and decision-making.",
    whenToUse: "Use when evaluating risk or making forecasts. The most available information in your mind is not necessarily the most important. Actively seek data that is hard to recall. Use checklists and systematic processes to counteract memory bias.",
    example: "Shark attacks get more media coverage than lightning strikes, causing people to fear sharks more than lightning. Investors over-weight recent market events when building long-term forecasts. Vivid stories about individual failures outweigh statistical evidence about probability."
  },
  {
    name: "Use-It-or-Lose-It Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "learning", "munger"],
    source: "munger",
    coreConcept: "Skills, knowledge, and abilities that are not regularly practiced deteriorate over time. Mastery requires continuous exercise. This applies to languages, musical skills, mathematical ability, and professional knowledge.",
    whenToUse: "Use when planning education, training, or personal development. Build in continuous practice and review. Skills not used are skills lost. Design environments that require regular exercise of important skills.",
    example: "A pianist who stops practicing will lose finger dexterity. A surgeon who stops performing procedures loses precision. Knowledge not reviewed is forgotten — the forgetting curve is relentless."
  },
  {
    name: "Drug-Misinfluence Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "impairment", "munger"],
    source: "munger",
    coreConcept: "Chemical influences impair judgment in ways that are predictable but consistently underestimated by the affected person. Alcohol, drugs, and even caffeine in excess can dramatically worsen decision-making while the user remains confident in their abilities.",
    whenToUse: "Use when making high-stakes decisions or managing teams. Recognize that judgment is always impaired during intoxication, and the impaired person is the worst judge of their own impairment. Avoid making important decisions under any chemical influence.",
    example: "Drunk drivers overestimate their driving ability. Corporate executives making deals at alcohol-fueled events agree to terms they would never accept sober. Historical military disasters have been linked to command decisions made while fatigued or under chemical influence."
  },
  {
    name: "Senescence-Misinfluence Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "aging", "munger"],
    source: "munger",
    coreConcept: "Cognitive abilities decline with age in predictable ways: processing speed slows, working memory shrinks, and new learning becomes harder. However, crystallized intelligence — accumulated knowledge and wisdom — can remain strong or even improve with age.",
    whenToUse: "Use when planning career stages and succession. Do not assume that older decision-makers are uniformly impaired — some abilities improve. But be aware that speed, flexibility, and novel learning decline, while wisdom and pattern recognition may remain sharp.",
    example: "A senior executive may have difficulty learning a new software system while remaining the best strategic thinker in the room. Young lawyers may have photographic memory and stamina but lack the judgment that comes from decades of experience."
  },
  {
    name: "Authority-Misinfluence Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "authority", "munger"],
    source: "munger",
    coreConcept: "People have a deeply conditioned tendency to obey authority figures, even to the point of ignoring their own moral instincts. This tendency is exploited by uniforms, titles, offices, and costumes. It explains the Milgram experiment and many institutional disasters.",
    whenToUse: "Use when following orders or giving them. Ask: would I do this if there were no authority figure present? If the answer is no, question the order. Build organizations that encourage subordinates to question authority when it conflicts with ethics or facts.",
    example: "The Milgram experiment: 65% of participants delivered what they believed were lethal electrical shocks because an authority figure in a lab coat told them to continue. Pilots have followed clearly wrong commands from air traffic control rather than their own instruments."
  },
  {
    name: "Twaddle Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "communication", "munger"],
    source: "munger",
    coreConcept: "People will waste enormous amounts of time and attention on trivial, meaningless, or low-quality information. The mind has a tendency to emit noise rather than silence, to talk rather than listen, to fill silence with chatter. This is costly — attention is finite.",
    whenToUse: "Use when evaluating how you spend your time and attention. Practice saying less. Silence is undervalued. The best thinkers and decision-makers often speak less and listen more. Protect your attention from noise.",
    example: "Most meetings contain far more words than necessary. Most presentations include far more slides than needed. People read trivial news feeds for hours while avoiding important but demanding reading."
  },
  {
    name: "Reason-Respecting Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "persuasion", "munger"],
    source: "munger",
    coreConcept: "People are more likely to comply with a request if given a reason, even a poor one. The word 'because' triggers compliance. This is a powerful persuasion tool: giving reasons, even trivial ones, dramatically increases cooperation.",
    whenToUse: "Use when persuading or negotiating. Always give reasons, even simple ones. 'Because I said so' is far less effective than 'because I need this done by Friday.' The act of explaining forces clearer thinking and increases buy-in.",
    example: "Library researchers found that saying 'May I make copies?' resulted in 60% compliance, but adding 'because I'm in a rush' increased compliance to 94%. Salespeople are trained to give reasons even when the real reason is 'I want your money.'"
  },
  {
    name: "Lollapalooza Tendency",
    category: "Human Nature and Judgment",
    tags: ["psychology", "systems", "munger"],
    source: "munger",
    coreConcept: "When multiple psychological tendencies operate simultaneously — often in the same direction — their combined effect is not merely additive but multiplicative. Multiple biases reinforce each other to produce extreme outcomes that no single tendency could explain. This is Munger's signature concept.",
    whenToUse: "Use when analyzing complex outcomes where multiple factors are at play. Look for the combination of tendencies that amplify each other, not just individual causes. In complex systems, the interaction effects dwarf the individual effects.",
    example: "The 2008 financial crisis combined overoptimism (overoptimism tendency), social proof (everyone was investing), incentive-caused bias (mortgage brokers profiting from bad loans), and denial (ignoring warning signs). Each factor alone would not have caused a crisis of that magnitude."
  },

  // === BROADER MUNGER MODELS ===
  {
    name: "The Lollapalooza Effect",
    category: "General Thinking Tools",
    tags: ["systems", "multiple-models", "munger"],
    source: "munger",
    coreConcept: "The Lollapalooza Effect describes the extraordinary outcomes that occur when multiple factors — often from different disciplines — combine and reinforce each other. A handful of good ideas applied consistently and in combination can produce results that seem almost magical compared to what incremental thinking achieves.",
    whenToUse: "Use when seeking breakthrough results rather than incremental improvements. Look for combinations of factors that reinforce each other. A business with a wide moat, talented management, and a simple culture may outperform a business with any single advantage by orders of magnitude.",
    example: "Berkshire Hathaway's success comes from the combination of rational capital allocation, ethical culture, and patient long-term thinking — not any single factor. The effect of combining compound interest with continuous learning dramatically exceeds the sum of either alone."
  },
  {
    name: "Inversion Principle",
    category: "General Thinking Tools",
    tags: ["problem-solving", "munger", "mathematics"],
    source: "munger",
    coreConcept: "Instead of asking how to succeed, ask how to fail — then avoid those things. Munger learned this from the mathematician Jacobi: 'invert, always invert.' Most people focus on what they want to achieve; wise thinkers focus on what they want to avoid, then structure life to avoid those outcomes.",
    whenToUse: "Use when starting any complex project or planning any major decision. List the ways the project could fail, then eliminate or mitigate those failure modes. This is far more productive than listing success strategies.",
    example: "To build a happy life, instead of listing what would make you happy, list what would make you miserable — then avoid those things. To build a successful business, instead of listing success factors, ask: what would kill this business? Then prevent those scenarios."
  },
  {
    name: "Multidisciplinary Mental Latticework",
    category: "General Thinking Tools",
    tags: ["learning", "education", "munger"],
    source: "munger",
    coreConcept: "Build a latticework of mental models from multiple disciplines — mathematics, physics, psychology, biology, engineering, economics. The models from each discipline illuminate blind spots in the others. A single discipline produces a single lens; multiple disciplines produce a comprehensive picture.",
    whenToUse: "Use when facing complex problems that span multiple domains. Draw on insights from the most relevant disciplines. Avoid the man-with-a-hammer tendency: having only one toolkit means treating every problem as a nail.",
    example: "Understanding business competition benefits from evolutionary biology (natural selection of companies), physics (equilibrium and entropy), psychology (incentives and biases), and mathematics (probability and compounding). No single discipline gives the full picture."
  },
  {
    name: "Avoiding Stupidity",
    category: "General Thinking Tools",
    tags: ["decision-making", "munger", "simplicity"],
    source: "munger",
    coreConcept: "It is more important to avoid stupidity than to seek brilliance. By systematically avoiding the worst decisions, you dramatically improve your outcomes without needing extraordinary insight. The way to get good outcomes is to avoid bad ones, not to find brilliant ones.",
    whenToUse: "Use when evaluating decisions. Ask: what would be a stupid thing to do here? Then do not do it. This is more actionable than asking what the brilliant move would be. Most investment returns come from avoiding catastrophic losses.",
    example: "Warren Buffett's first rule of investing is 'never lose money.' His second rule is 'never forget rule one.' By avoiding the worst investments, a patient investor outperforms those chasing spectacular gains. In life, avoiding marriage to the wrong person matters more than finding the perfect one."
  },
  {
    name: "The Man With A Hammer Tendency",
    category: "General Thinking Tools",
    tags: ["education", "specialization", "munger"],
    source: "munger",
    coreConcept: "To a man with a hammer, everything looks like a nail. When you have deep expertise in one field, you tend to apply that expertise everywhere, even where it is inappropriate. This is the central danger of narrow professional training and the key argument for multidisciplinary education.",
    whenToUse: "Use when consulting experts or building teams. Ask whether the expert is applying the right framework or just the one they know. Cross-disciplinary thinking guards against this. The economist who sees everything as incentive problems and the psychologist who sees everything as childhood trauma are both suffering from this tendency.",
    example: "A surgeon may recommend surgery even when physical therapy would suffice. An economist may propose market solutions to problems caused by psychology. A lawyer sees legal solutions to every problem. Each professional's training becomes their limitation."
  },
  {
    name: "Wide Education Principle",
    category: "General Thinking Tools",
    tags: ["education", "learning", "munger"],
    source: "munger",
    coreConcept: "The most important knowledge comes from understanding the great ideas from the major disciplines, not from narrow professional training. Reading the lives and ideas of remarkable people is the best education available. Warren Buffett and Charlie Munger spend most of their time reading.",
    whenToUse: "Use to plan your own education and reading. Read the classics — lives of remarkable people, foundational texts in science, philosophy, and history. The marginal book in an unfamiliar field is more valuable than the hundredth book in your specialty.",
    example: "Munger credits much of his investment success to insights from psychology, physics, and biology, not to knowledge of finance. He reads 600 pages a day across dozens of fields. His 'education' comes more from Darwin, Freud, and Einstein than from business school."
  },
  {
    name: "Incentive-Caused Bias",
    category: "Human Nature and Judgment",
    tags: ["psychology", "incentives", "munger"],
    source: "munger",
    coreConcept: "Professionals tend to think in ways that serve their own interests, not yours. A commissioned salesperson recommends what pays the highest commission. A lawyer recommends litigation. An architect recommends complexity. You must understand incentives to predict behavior.",
    whenToUse: "Use when hiring professionals, structuring organizations, or evaluating advice. Always ask: what does this person have to gain from my decision? Design systems where incentives align with desired outcomes. The best protection against incentive-caused bias is understanding it.",
    example: "Investment banks recommend deals because they earn fees regardless of whether the deal creates value. Real estate agents may advise selling at a time convenient for their commission schedule rather than at the optimal time for the seller."
  },
  {
    name: "The Value of a Simple Checklist",
    category: "General Thinking Tools",
    tags: ["systems", "process", "munger"],
    source: "munger",
    coreConcept: "Simple checklists dramatically reduce errors in complex environments by counteracting the psychological tendencies that cause misjudgment. They force consideration of critical factors that might otherwise be overlooked under pressure. The investment decision checklist is as important as the surgeon's checklist.",
    whenToUse: "Use when making repeated complex decisions. Build a checklist of factors to consider, biases to check for, and failure modes to avoid. Review it before every major decision. Simple systems beat complex intuitions in environments where errors are costly.",
    example: "Atul Gawande's surgical checklist reduced deaths by over 20% in hospitals that adopted it. Munger uses a psychological misjudgment checklist before every major decision. Buffett uses a simple acquisition checklist that filters out most opportunities instantly."
  },
  {
    name: "Simplicity as Power",
    category: "General Thinking Tools",
    tags: ["communication", "simplicity", "munger"],
    source: "munger",
    coreConcept: "Simple ideas communicated clearly are more powerful than complex ideas explained poorly. The ability to reduce a complex problem to its essential elements and explain it simply is a mark of true mastery. Complexity is often a symptom of not understanding the problem deeply enough.",
    whenToUse: "Use when communicating ideas, building organizations, or designing systems. If you cannot explain your idea simply, you do not understand it well enough. Strive for the simplest possible explanation that captures the essential truth.",
    example: "Einstein's E=mc squared is more powerful than the complex physics behind it because it is simple and captures something fundamental. Warren Buffett's investment philosophy is simple: buy wonderful businesses at fair prices and hold them. Complexity is used to obscure as much as to illuminate."
  },
  {
    name: "Mr. Market",
    category: "Microeconomics",
    tags: ["investing", "markets", "munger"],
    source: "munger",
    coreConcept: "Benjamin Graham's Mr. Market is a mental model for understanding market prices. Imagine a partner named Mr. Market who offers to buy or sell his share at prices that fluctuate wildly based on his mood. Most of the time his prices are silly. Occasionally they are irresistible. The rational investor uses him, not follows him.",
    whenToUse: "Use when evaluating stock market prices. The market is not your master — it is your servant, offering prices you can accept or ignore. When Mr. Market is panicked, buy. When he is euphoric, sell. Otherwise, ignore him.",
    example: "In March 2020, Mr. Market panicked over COVID-19, offering high-quality businesses at prices that looked like 1930s Depression levels. In 2021, he became euphoric about technology stocks. Both extremes created opportunities for rational investors who were not panicking along with him."
  }
];

async function createModel(model) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      properties: {
        'Name': { title: [{ text: { content: model.name } }] },
        'English Name': { rich_text: [{ text: { content: model.name } }] },
        'Category': { select: { name: model.category } },
        'Source': { select: { name: model.source } },
        'Tags': { multi_select: model.tags.map(t => ({ name: t })) },
        'Core Concept': { rich_text: [{ text: { content: model.coreConcept } }] },
        'When to Use': { rich_text: [{ text: { content: model.whenToUse } }] },
        'Example': { rich_text: [{ text: { content: model.example } }] },
        'Model ID': { rich_text: [{ text: { content: model.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') } }] }
      }
    })
  });
  return { name: model.name, ok: res.ok, status: res.status };
}

async function main() {
  console.log(`Importing ${models.length} models from Poor Charlie's Almanack...`);
  let success = 0, failed = 0;
  for (const model of models) {
    const result = await createModel(model);
    if (result.ok) {
      success++;
      process.stdout.write('✅');
    } else {
      failed++;
      console.log(`\n❌ ${result.name}: ${result.status}`);
    }
    await new Promise(x => setTimeout(x, 350));
  }
  console.log(`\n\nDone: ${success} created, ${failed} failed`);
}

main().catch(e => console.error('Fatal:', e.message));
