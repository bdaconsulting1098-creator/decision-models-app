// Import 129 Munger models from sourcesofinsight.com into Notion
// Usage: node import_sourcesofinsight.js

const fetch = require('node-fetch');

const NOTION_TOKEN = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

// All 129 models from sourcesofinsight.com/charlie-munger-mental-models/
const models = [
  // === Psychology: Tendencies & Biases (34) ===
  { name: "Reward and Punishment Superresponse Tendency", category: "Human Nature & Judgment", tags: ["psychology","incentives","bias"], modelId: "MG-001", source: "munger",
    concept: "People respond extremely powerfully to incentives and disincentives. Both the incentive and the disincentive superresponse tendencies are at work in most human behavior. If you want to understand why someone is acting a certain way, look at their incentives first.",
    whenToUse: "When analyzing why people behave the way they do — especially in business, politics, or organizational settings. Always ask: 'What are their incentives?'",
    example: "Salespeople paid on commission will push products that maximize their commission, not necessarily what's best for the customer. Munger: 'Never, ever think about something else when you should be thinking about incentives.'" },

  { name: "Liking/Loving Tendency", category: "Human Nature & Judgment", tags: ["psychology","bias","affection"], modelId: "MG-002", source: "munger",
    concept: "Humans have a natural tendency to like and love certain people and things, and to ignore or distort facts associated with the liked object. We tend to favor people we like, agree with them, and overlook their faults.",
    whenToUse: "When you notice you're giving special treatment or credence to someone you like. Watch for distortion of facts about people or things you love.",
    example: "Investors falling in love with a stock they've owned for years, ignoring deteriorating fundamentals because of emotional attachment." },

  { name: "Disliking/Hating Tendency", category: "Human Nature & Judgment", tags: ["psychology","bias","aversion"], modelId: "MG-003", source: "munger",
    concept: "The inverse of liking tendency — we tend to dislike and hate certain people or things, and then ignore virtues in the object of dislike and dislike other people associated with it.",
    whenToUse: "When you find yourself dismissing ideas or people because of who they're associated with, rather than on their merits.",
    example: "Rejecting a good business proposal because it comes from a competitor or someone you personally dislike." },

  { name: "Doubt-Avoidance Tendency", category: "Human Nature & Judgment", tags: ["psychology","bias","uncertainty"], modelId: "MG-004", source: "munger",
    concept: "When faced with uncertainty or doubt, the brain naturally pushes to quickly remove doubt by reaching a decision. This tendency is heightened under stress and time pressure.",
    whenToUse: "When making decisions under uncertainty. Force yourself to sit with doubt longer before committing. Ask: 'Am I rushing to closure because I'm uncomfortable with uncertainty?'",
    example: "Jurors making up their minds early in a trial because they're uncomfortable with ambiguity, then filtering all evidence through their initial judgment." },

  { name: "Inconsistency-Avoidance Tendency", category: "Human Nature & Judgment", tags: ["psychology","bias","consistency"], modelId: "MG-005", source: "munger",
    concept: "People resist changing their habits, beliefs, and conclusions — even when presented with contradictory evidence. The brain conserves energy by avoiding the re-examination of prior conclusions.",
    whenToUse: "When you notice you're defending a position simply because you've held it before. Also useful for understanding why organizations resist change.",
    example: "An investor who refuses to sell a losing stock because selling would mean admitting their original thesis was wrong." },

  { name: "Curiosity Tendency", category: "Human Nature & Judgment", tags: ["psychology","learning","exploration"], modelId: "MG-006", source: "munger",
    concept: "Humans have a innate drive to seek information and understand the world, even without obvious reward. Curiosity is one of the most powerful drivers of learning and discovery.",
    whenToUse: "When you need to counteract the tendency to stay in your comfort zone. Deliberately cultivate curiosity about areas outside your expertise.",
    example: "Munger's own multidisciplinary approach was driven by curiosity — he read constantly across fields, which gave him his famous 'latticework of models.'" },

  { name: "Kantian Fairness Tendency", category: "Human Nature & Judgment", tags: ["psychology","fairness","reciprocity"], modelId: "MG-007", source: "munger",
    concept: "People have a deep desire for fairness and reciprocity — they want to be treated as they treat others, and they resent unfair treatment even when it doesn't materially harm them.",
    whenToUse: "When designing systems, policies, or negotiations. People will accept outcomes they consider fair even if unfavorable, and reject outcomes they consider unfair even if favorable.",
    example: "The Ultimatum Game: people reject free money if they perceive the split as unfair, even though accepting any amount is better than nothing." },

  { name: "Envy/Jealousy Tendency", category: "Human Nature & Judgment", tags: ["psychology","envy","emotion"], modelId: "MG-008", source: "munger",
    concept: "Humans are wired to compare themselves to others and feel envy when others have more. Envy drives much irrational behavior and is one of the most destructive psychological tendencies.",
    whenToUse: "When you feel resentment about someone else's success. Munger: 'It's not greed that drives the world, but envy.' Recognize envy as a bias before acting on it.",
    example: "Investors buying speculative assets because their neighbors got rich, not because of sound analysis — envy driving irrational risk-taking." },

  { name: "Reciprocation Tendency", category: "Human Nature & Judgment", tags: ["psychology","reciprocity","social"], modelId: "MG-009", source: "munger",
    concept: "People feel a strong obligation to repay favors, gifts, and concessions. This tendency is deeply wired and makes us vulnerable to manipulation by those who give first then ask.",
    whenToUse: "When someone does you a favor before making a request. Watch for the 'reciprocation trap' — free samples, compliments before sales pitches, concessions in negotiations.",
    example: "A salesperson giving you a 'free' consultation or sample, creating an unconscious obligation to buy. Cialdini identified this as one of the most powerful persuasion weapons." },

  { name: "Influence-from-Mere-Association Tendency", category: "Human Nature & Judgment", tags: ["psychology","association","bias"], modelId: "MG-010", source: "munger",
    concept: "People automatically associate qualities with things that happen to be linked together, even when there's no causal connection. This includes associating success with unrelated factors and avoiding things linked to bad outcomes.",
    whenToUse: "When you catch yourself making connections based on coincidence rather than causation. Also known as the 'halo effect' when applied to people.",
    example: "Assuming a CEO who led during a bull market is a genius, when the rising tide lifted all boats. The association between the CEO and stock gains is not causal." },

  { name: "Simple, Pain-Avoiding Psychological Denial", category: "Human Nature & Judgment", tags: ["psychology","denial","defense"], modelId: "MG-011", source: "munger",
    concept: "When reality is too painful to accept, the mind distorts facts until they become bearable. This denial mechanism is especially strong when the painful reality threatens self-image or core beliefs.",
    whenToUse: "When the facts are clearly against you but you can't accept them. Ask: 'If I were wrong, would I be able to tell?' Watch for denial in health, relationships, and investments.",
    example: "A business owner who can't accept their industry is dying, continuing to invest in a failing venture rather than pivoting." },

  { name: "Excessive Self-Regard Tendency", category: "Human Nature & Judgment", tags: ["psychology","overconfidence","ego"], modelId: "MG-012", source: "munger",
    concept: "People overestimate their own abilities, qualities, and opinions. We tend to like our own ideas, our own possessions, and our own conclusions more than is warranted by objective reality.",
    whenToUse: "When evaluating your own competence or the quality of your ideas. Actively seek disconfirming evidence. Munger: 'A majority of mankind will self-rate in the top quartile.'",
    example: "80% of drivers rating themselves as above average; entrepreneurs overestimating their odds of success; investors believing they can beat the market." },

  { name: "Overoptimism Tendency", category: "Human Nature & Judgment", tags: ["psychology","optimism","bias"], modelId: "MG-013", source: "munger",
    concept: "People tend to be overly optimistic about outcomes, especially for things within their control. This leads to underestimation of risks and overestimation of success probabilities.",
    whenToUse: "When planning projects, estimating timelines, or assessing risk. Apply a 'pessimism multiplier' to your initial estimates. Ask: 'What could go wrong that I'm not seeing?'",
    example: "The planning fallacy: projects consistently take longer and cost more than estimated. Most startups fail, yet founders always believe theirs will succeed." },

  { name: "Deprival-Superreaction Tendency", category: "Human Nature & Judgment", tags: ["psychology","loss","emotion"], modelId: "MG-014", source: "munger",
    concept: "People react far more strongly to losing something than to gaining something of equal value. The pain of loss is roughly 2x the pleasure of an equivalent gain. This includes perceived loss of status, territory, or identity.",
    whenToUse: "When making decisions about gains vs. losses. Recognize that loss aversion makes you hold onto losing positions too long and reject fair deals that feel like losses.",
    example: "Investors holding losing stocks to avoid realizing the loss (and the pain), while quickly selling winners. Also: workers reacting violently to pay cuts even when still well-paid." },

  { name: "Social-Proof Tendency", category: "Human Nature & Judgment", tags: ["psychology","social","conformity"], modelId: "MG-015", source: "munger",
    concept: "People look to what others are doing to determine how to behave, especially under uncertainty or when the group is similar to them. The more people doing something, the more correct it seems.",
    whenToUse: "When you find yourself going along with the crowd. Ask: 'Would I do this if nobody else were doing it?' Especially dangerous in investing, where social proof creates bubbles.",
    example: "Market bubbles driven by everyone buying because everyone else is buying. Also: bystander effect where individuals don't act because others aren't acting." },

  { name: "Contrast-Misreaction Tendency", category: "Human Nature & Judgment", tags: ["psychology","perception","contrast"], modelId: "MG-016", source: "munger",
    concept: "Human perception responds to changes and differences, not absolute levels. We judge things by comparison to what came before, not by objective standards. Small changes can go unnoticed if gradual.",
    whenToUse: "When evaluating offers, prices, or changes. Don't judge by the contrast to the previous state — judge by absolute value. Watch for the 'frog in boiling water' effect.",
    example: "A real estate agent showing you three overpriced houses before showing you a slightly-less-overpriced one that seems like a deal by comparison." },

  { name: "Stress-Influence Tendency", category: "Human Nature & Judgment", tags: ["psychology","stress","decision"], modelId: "MG-017", source: "munger",
    concept: "Stress intensifies other psychological tendencies and makes people more susceptible to influence, manipulation, and poor decision-making. Under extreme stress, people regress to simpler, more primitive responses.",
    whenToUse: "When making decisions under pressure. Recognize that stress narrows your thinking and amplifies biases. Slow down. Don't make big decisions under acute stress.",
    example: "Scams targeting people in financial distress; soldiers under extreme stress making poor tactical decisions; emergency purchases at inflated prices." },

  { name: "Availability-Misweighing Tendency", category: "Human Nature & Judgment", tags: ["psychology","availability","bias"], modelId: "MG-018", source: "munger",
    concept: "People overweigh information that is easily available, vivid, or recent, and underweigh information that is harder to access or less dramatic. What comes to mind easily feels more important.",
    whenToUse: "When evaluating risks or making judgments. Ask: 'Am I overweighing this because it's vivid or recent, rather than because it's statistically significant?'",
    example: "Overestimating the risk of shark attacks (vivid, dramatic) while underestimating the risk of heart disease (common, undramatic). Also: recent news dominating investment decisions." },

  { name: "Use-It-or-Lose-It Tendency", category: "Human Nature & Judgment", tags: ["psychology","skills","atrophy"], modelId: "MG-019", source: "munger",
    concept: "Skills and knowledge atrophy when not practiced. The brain prunes unused neural connections, making it progressively harder to recover abilities that have been neglected.",
    whenToUse: "When deciding whether to maintain a skill or let it lapse. The cost of maintaining is much lower than the cost of relearning. Keep key skills sharp through regular practice.",
    example: "A surgeon who stops operating loses dexterity; a programmer who stops coding loses fluency. Munger read daily to keep his mental models sharp." },

  { name: "Drug-Misinfluence Tendency", category: "Human Nature & Judgment", tags: ["psychology","addiction","chemistry"], modelId: "MG-020", source: "munger",
    concept: "Chemical substances can distort thinking and create self-reinforcing destructive loops. This tendency is a reminder that our cognitive machinery can be compromised by chemical interference.",
    whenToUse: "When evaluating decisions made by people under the influence of substances. Also metaphorically — what 'chemical' (habit, compulsion) is distorting your thinking?",
    example: "Substance abuse destroying otherwise sound judgment; also applies to caffeine-driven overconfidence or alcohol-fueled risk-taking in business." },

  { name: "Senescence-Misinfluence Tendency", category: "Human Nature & Judgment", tags: ["psychology","aging","decline"], modelId: "MG-021", source: "munger",
    concept: "As people age, their cognitive flexibility and learning capacity naturally decline. Old beliefs become harder to change and new ideas become harder to assimilate.",
    whenToUse: "When working with or analyzing older decision-makers. Don't assume age always brings wisdom — it can also bring rigidity. Counteract by deliberately seeking new perspectives.",
    example: "Aging executives clinging to strategies that worked in the past but are now outdated. Munger and Buffett stayed sharp by relentless reading and updating." },

  { name: "Authority-Misinfluence Tendency", category: "Human Nature & Judgment", tags: ["psychology","authority","obedience"], modelId: "MG-022", source: "munger",
    concept: "People tend to follow authority figures even when the authority is wrong or the instructions are harmful. Status and titles create an automatic compliance response.",
    whenToUse: "When an expert or authority tells you something. Ask: 'Is this person right because of evidence, or am I complying because of their status?' Always verify independently.",
    example: "The Milgram experiment — ordinary people delivering apparently lethal shocks because an authority figure told them to. In business: following bad CEO decisions because 'they must know best.'" },

  { name: "Twaddle Tendency", category: "Human Nature & Judgment", tags: ["psychology","nonsense","noise"], modelId: "MG-023", source: "munger",
    concept: "People have a tendency to talk confidently about things they don't understand, filling silence with impressive-sounding but meaningless content. This is especially common among experts speaking outside their domain.",
    whenToUse: "When listening to commentary or advice. Ask: 'Does this person actually know what they're talking about, or are they twaddling?' Be honest about what you yourself don't know.",
    example: "Financial pundits making confident predictions about markets they don't understand; consultants using jargon to mask lack of substance." },

  { name: "Reason-Respecting Tendency", category: "Human Nature & Judgment", tags: ["psychology","reasons","compliance"], modelId: "MG-024", source: "munger",
    concept: "People are more likely to comply with a request when given a reason, even if the reason is weak or irrelevant. The word 'because' triggers a compliance response.",
    whenToUse: "When trying to persuade — always provide a reason, even a simple one. Also: when you find yourself complying because of a stated reason, evaluate whether the reason is actually valid.",
    example: "The classic experiment: 'Can I cut in line because I need to make copies?' got 93% compliance vs 60% without 'because' — even though the reason was trivially obvious." },

  { name: "Lollapalooza Effect", category: "Human Nature & Judgment", tags: ["psychology","convergence","extreme"], modelId: "MG-025", source: "munger",
    concept: "When multiple psychological tendencies converge and reinforce each other, the result is an extreme outcome far greater than the sum of individual effects. This is Munger's most important concept — the interaction of biases creates outsized, often destructive, results.",
    whenToUse: "When analyzing extreme events, bubbles, or catastrophic decisions. Look for the confluence of multiple biases operating simultaneously. This is where the biggest mistakes happen.",
    example: "The 2008 financial crisis: incentive-caused bias + social proof + overoptimism + authority misinfluence + availability bias all converged to create a lollapalooza of bad decisions." },

  { name: "Confirmation Bias", category: "Human Nature & Judgment", tags: ["psychology","bias","evidence"], modelId: "MG-026", source: "munger",
    concept: "People naturally seek, interpret, and remember information that confirms their existing beliefs, while ignoring or downplaying disconfirming evidence. This is one of the most pervasive and dangerous cognitive biases.",
    whenToUse: "Whenever you have a strong opinion. Actively seek evidence against your position. Darwin's practice: immediately write down disconfirming observations before forgetting them.",
    example: "Investors reading only bullish analysis for stocks they own; politicians surrounding themselves with yes-men; doctors diagnosing based on initial impressions." },

  { name: "Hindsight Bias", category: "Human Nature & Judgment", tags: ["psychology","retrospect","illusion"], modelId: "MG-027", source: "munger",
    concept: "After an event occurs, people believe they 'knew it all along' — they retroactively inflate the predictability of past events. This creates an illusion that the world is more predictable than it is.",
    whenToUse: "When evaluating past decisions. Judge decisions by the information available at the time, not by how things turned out. Good process can lead to bad outcomes and vice versa.",
    example: "After a market crash, everyone says 'it was obvious' — but very few people actually sold beforehand. The 'I knew it all along' feeling is a cognitive illusion." },

  { name: "First-Conclusion Bias", category: "Human Nature & Judgment", tags: ["psychology","premature","closure"], modelId: "MG-028", source: "munger",
    concept: "People tend to stick with the first conclusion they reach and stop looking for better answers. This premature closure is a form of mental laziness that prevents reaching optimal solutions.",
    whenToUse: "When you reach a conclusion quickly. Force yourself to generate at least 3 alternatives before committing. Ask: 'What other explanations could there be?'",
    example: "A doctor reaching a diagnosis and not considering alternatives, leading to misdiagnosis. Also: an investor falling in love with the first stock analysis they do." },

  { name: "Anchoring Bias", category: "Human Nature & Judgment", tags: ["psychology","anchoring","reference"], modelId: "MG-029", source: "munger",
    concept: "People's judgments are heavily influenced by the first number or piece of information they encounter, even when it's irrelevant. This anchor distorts all subsequent thinking about value or probability.",
    whenToUse: "When negotiating, estimating, or evaluating. Identify your anchors and ask: 'If I never saw this number, what would I think is reasonable?'",
    example: "A house listed at $500K seems like a deal at $450K, even if it's worth $350K. The listing price anchors your perception of value." },

  { name: "Incentive-Caused Bias", category: "Human Nature & Judgment", tags: ["psychology","incentives","corruption"], modelId: "MG-030", source: "munger",
    concept: "When people's incentives favor a particular conclusion, they sincerely believe that conclusion is correct — even when it's not. The bias is often unconscious; people don't realize their incentives are corrupting their thinking.",
    whenToUse: "When evaluating advice from anyone with a stake in the outcome. Ask: 'What is this person incentivized to believe?' This applies to doctors, lawyers, consultants, and yourself.",
    example: "A real estate appraiser consistently valuing properties at the number the hiring bank wants — not because they're corrupt, but because their incentives subtly shift their judgment." },

  { name: "Pavlovian Association", category: "Human Nature & Judgment", tags: ["psychology","conditioning","association"], modelId: "MG-031", source: "munger",
    concept: "People develop automatic responses to stimuli through repeated association, just like Pavlov's dogs. These conditioned responses can override rational analysis and operate below conscious awareness.",
    whenToUse: "When you have an automatic emotional reaction to something. Ask: 'Is this a conditioned response or a rational assessment?' Especially watch for brand loyalty and aversion to unfamiliar options.",
    example: "Feeling safer in a brand-name medication vs. generic despite identical active ingredients. The brand triggers a Pavlovian 'quality' response." },

  { name: "Hyperbolic Discounting", category: "Human Nature & Judgment", tags: ["psychology","time","discounting"], modelId: "MG-032", source: "munger",
    concept: "People disproportionately prefer smaller-sooner rewards over larger-later ones. The discount rate is not consistent over time — we're much more impatient about short-term trade-offs than long-term ones.",
    whenToUse: "When making decisions involving delayed gratification. Recognize that your 'present self' is biased toward immediate rewards. Use commitment devices to protect your 'future self.'",
    example: "Choosing $100 today over $150 in a month, even though the annualized return is enormous. Also: failing to save for retirement because the benefit is too far away." },

  { name: "Representativeness Bias", category: "Human Nature & Judgment", tags: ["psychology","stereotyping","probability"], modelId: "MG-033", source: "munger",
    concept: "People judge probabilities based on how much something resembles a stereotype or typical case, rather than by actual statistical base rates. This leads to systematic errors in probability judgment.",
    whenToUse: "When making probability judgments. Always consider base rates before being swayed by how 'typical' something seems. The resemblance is not the probability.",
    example: "Assuming a quiet, bookish person is more likely to be a librarian than a salesperson, even though salespeople vastly outnumber librarians — ignoring base rates." },

  { name: "Status Quo Bias", category: "Human Nature & Judgment", tags: ["psychology","inertia","default"], modelId: "MG-034", source: "munger",
    concept: "People prefer things to stay the same. The default option has enormous power — changing from the status quo requires active effort and perceived risk, so people tend not to change even when change would benefit them.",
    whenToUse: "When evaluating whether to stick with the current situation or make a change. Ask: 'If I were starting fresh, would I choose this?' If not, the status quo bias is keeping you stuck.",
    example: "Employees staying in bad jobs because the effort and risk of changing feels worse than the known misery. Also: investors holding legacy positions they'd never buy today." },

  // === Thinking Tools & Meta-Frameworks (18) ===
  { name: "Inversion", category: "General Thinking Tools", tags: ["thinking","inversion","problem-solving"], modelId: "MG-035", source: "munger",
    concept: "Instead of asking how to succeed, ask how to fail — then avoid those things. Munger's favorite thinking tool: 'Invert, always invert.' Many problems are easier to solve backwards than forwards.",
    whenToUse: "When direct problem-solving is stuck. Instead of 'How do I achieve X?' ask 'What would guarantee I fail at X?' Then avoid those things. Works for investing, health, relationships, career.",
    example: "Instead of 'How do I build a great company?' ask 'How would I guarantee a company fails?' Answer: bad culture, wrong incentives, ignoring customers. Then avoid all of those." },

  { name: "Checklist Approach", category: "General Thinking Tools", tags: ["thinking","checklist","systematic"], modelId: "MG-036", source: "munger",
    concept: "Use checklists to ensure no critical step is missed. Pilots and surgeons use them to prevent fatal errors under stress. The same principle applies to investment decisions and complex problem-solving.",
    whenToUse: "Before making any important decision. A simple checklist of common errors and biases can prevent 90% of stupid mistakes. Don't trust your memory — use a system.",
    example: "A pre-investment checklist: 'Have I checked incentives? Am I anchoring? Is this social proof? Have I sought disconfirming evidence? What would make me change my mind?'" },

  { name: "Two-Track Analysis", category: "General Thinking Tools", tags: ["thinking","dual-track","analysis"], modelId: "MG-037", source: "munger",
    concept: "Analyze every situation on two tracks simultaneously: Track 1 — rational analysis (facts, numbers, logic, base rates); Track 2 — psychological analysis (biases, emotions, social influences, misjudgments). Most people only use Track 1.",
    whenToUse: "On every important decision. After your rational analysis, always ask: 'What psychological biases could be at work here — in myself and others?'",
    example: "Evaluating a stock: Track 1 (financials, competitive position, valuation) + Track 2 (am I anchored? Is social proof driving me? What are management's incentives?)" },

  { name: "Elementary Worldly Wisdom", category: "General Thinking Tools", tags: ["thinking","multidisciplinary","wisdom"], modelId: "MG-038", source: "munger",
    concept: "You don't need to be an expert in every field, but you need the basic models from each major discipline — psychology, economics, physics, biology, math. These 'big ideas from big disciplines' carry 90% of the freight.",
    whenToUse: "When approaching any problem. Ask: 'Which disciplines are relevant here? What are the fundamental models from those fields that apply?'",
    example: "Understanding a business requires not just accounting, but psychology (consumer behavior), economics (market structure), biology (competition), and math (probability of outcomes)." },

  { name: "Latticework of Mental Models", category: "General Thinking Tools", tags: ["thinking","framework","latticework"], modelId: "MG-039", source: "munger",
    concept: "Mental models must be organized into a connected latticework, not just memorized as isolated facts. The models reinforce and cross-check each other. The connections between models are as important as the models themselves.",
    whenToUse: "When learning new models. Don't just collect them — figure out how they connect. Each new model should link to existing ones. The latticework becomes more powerful with every connection.",
    example: "Inversion connects to doubt-avoidance (inversion fights premature closure); incentives connect to reciprocation (favors create obligation); base rates connect to representativeness (they counterbalance each other)." },

  { name: "Multidisciplinary Approach", category: "General Thinking Tools", tags: ["thinking","cross-disciplinary","breadth"], modelId: "MG-040", source: "munger",
    concept: "The biggest insights come from combining models across disciplines. Most problems can't be solved within a single domain. The person who can see the problem from psychology, economics, AND biology will outperform the single-discipline expert.",
    whenToUse: "When stuck on a problem within one domain. Ask: 'What would a psychologist/economist/biologist see here that I'm missing?' Cross-pollination generates breakthroughs.",
    example: "Munger's analysis of Coca-Cola combined psychology (Pavlovian conditioning, social proof), economics (scale advantages, brand moat), and biology (taste preference evolution)." },

  { name: "Circle of Competence", category: "General Thinking Tools", tags: ["thinking","competence","boundaries"], modelId: "MG-041", source: "munger",
    concept: "Know the boundary between what you understand and what you don't. Within your circle, you have an edge. Outside it, you're gambling. The key is not how large your circle is, but knowing where the perimeter is.",
    whenToUse: "Before making any decision. Ask: 'Is this within my circle of competence?' If not, either expand your circle first (learn) or pass. It's OK to have a small circle if you stay inside it.",
    example: "Buffett and Munger avoided tech stocks for decades — not because they were dumb, but because they honestly assessed that tech was outside their circle. They stuck to what they knew." },

  { name: "First Principles Thinking", category: "General Thinking Tools", tags: ["thinking","first-principles","fundamentals"], modelId: "MG-042", source: "munger",
    concept: "Strip away assumptions, conventions, and analogies. Get down to the fundamental truths that cannot be deduced further, then reason up from there. This is the opposite of reasoning by analogy.",
    whenToUse: "When conventional wisdom seems wrong or when you're entering a new domain. Don't accept 'that's how it's done' — ask 'why?' until you hit bedrock truth.",
    example: "Elon Musk analyzing rocket costs: instead of accepting that rockets are expensive, he calculated the raw material cost from first principles and found rockets could be dramatically cheaper." },

  { name: "Second-Order Thinking", category: "General Thinking Tools", tags: ["thinking","consequences","depth"], modelId: "MG-043", source: "munger",
    concept: "Think beyond the immediate, first-level effects of an action. Ask 'And then what?' Every action has second-order and third-order consequences that often reverse the first-order effect.",
    whenToUse: "When a solution seems obvious or too good. Always ask: 'What happens next? What are the unintended consequences?' The best thinkers see three moves ahead.",
    example: "Rent control (1st order: cheaper rent for tenants) → (2nd order: landlords stop maintaining buildings) → (3rd order: housing shortage and deterioration). The cure was worse than the disease." },

  { name: "Occam's Razor", category: "General Thinking Tools", tags: ["thinking","simplicity","parsimony"], modelId: "MG-044", source: "munger",
    concept: "Among competing explanations, the simplest one that accounts for the facts is most likely correct. Don't multiply entities beyond necessity. Complex explanations are more likely to be wrong.",
    whenToUse: "When choosing between explanations. Start with the simplest hypothesis that fits the facts. Only add complexity if the simple explanation fails. Most problems have simple causes.",
    example: "A company's declining sales: the simple explanation (their product got worse) is more likely than a complex one (coordinated competitor conspiracy + market shift + regulatory change)." },

  { name: "Hanlon's Razor", category: "General Thinking Tools", tags: ["thinking","attribution","charity"], modelId: "MG-045", source: "munger",
    concept: "Never attribute to malice what can be adequately explained by stupidity, incompetence, or negligence. Most bad outcomes are not the result of evil intent — they're the result of ignorance, error, or systemic failure.",
    whenToUse: "When someone's actions harm you and you assume malicious intent. Consider: could this be incompetence instead? Assuming malice leads to paranoia; assuming error leads to problem-solving.",
    example: "A colleague misses a deadline — it's probably poor organization, not a personal attack. A company's bad service is likely process failure, not deliberate customer hostility." },

  { name: "Falsification / Disconfirming Evidence", category: "General Thinking Tools", tags: ["thinking","falsification","science"], modelId: "MG-046", source: "munger",
    concept: "Actively seek evidence that would prove your hypothesis wrong, not just evidence that confirms it. Darwin's practice: immediately noting observations that contradicted his theories, because the mind naturally forgets disconfirming evidence.",
    whenToUse: "Whenever you have a strong belief or hypothesis. Your job is not to prove yourself right, but to try to prove yourself wrong. If your hypothesis survives your best attempts to destroy it, it's likely correct.",
    example: "Munger's praise of Darwin: 'He paid attention to disconfirming evidence, especially when it disconfirmed something he believed. That is a very rare trait.'" },

  { name: "Scenario Analysis", category: "General Thinking Tools", tags: ["thinking","scenarios","planning"], modelId: "MG-047", source: "munger",
    concept: "Consider multiple possible futures rather than a single forecast. Develop best-case, base-case, and worst-case scenarios. Assign probabilities to each. This combats overconfidence and forces preparation for different outcomes.",
    whenToUse: "When the future is uncertain (which is most of the time). Never plan for one outcome — plan for a range. Ask: 'What if I'm completely wrong?'",
    example: "Before launching a product: Best case (market loves it, revenue 10x), Base case (moderate adoption), Worst case (total failure, lost investment). Have plans for all three." },

  { name: "Mental Accounting", category: "General Thinking Tools", tags: ["thinking","framing","money"], modelId: "MG-048", source: "munger",
    concept: "People treat money differently depending on its source or intended use — 'house money,' 'savings,' 'fun money' — even though money is fungible. This irrational categorization leads to suboptimal financial decisions.",
    whenToUse: "When making financial decisions. Money is money — a dollar from gambling gains is worth the same as a dollar from salary. Don't let the source or label of money influence how you spend or invest it.",
    example: "People spending gambling winnings more freely than salary money; treating tax refunds as 'bonus' money to splurge; refusing to sell losing stocks because they're in a different 'mental account.'" },

  { name: "Black Swan Events", category: "General Thinking Tools", tags: ["thinking","tail-risk","surprise"], modelId: "MG-049", source: "munger",
    concept: "Extreme, unpredictable events have outsized impact on outcomes. These events are rare, have massive consequences, and are only explainable in hindsight. Normal distributions underestimate the probability and impact of extreme events.",
    whenToUse: "When building systems or portfolios. Don't just plan for average outcomes — prepare for extreme ones. Build in redundancy, margin of safety, and antifragility.",
    example: "The 2008 crisis, COVID-19, and the rise of the internet were all Black Swans — unpredictable in advance, enormous in impact, and 'obvious' in retrospect." },

  { name: "Gray Rhino Events", category: "General Thinking Tools", tags: ["thinking","risk","neglect"], modelId: "MG-050", source: "munger",
    concept: "The opposite of a Black Swan — a highly probable, high-impact threat that is obvious but neglected. Like a gray rhino charging at you: you see it coming, but you don't move until it's too late.",
    whenToUse: "When there's an obvious risk you're ignoring because it's too big or uncomfortable to address. Ask: 'What big, obvious threat am I not dealing with?'",
    example: "Climate change, aging infrastructure, unsustainable debt levels — all are obvious, predictable, high-impact threats that people neglect because addressing them is hard and costly." },

  { name: "Vivification", category: "General Thinking Tools", tags: ["thinking","memory","vividness"], modelId: "MG-051", source: "munger",
    concept: "Making ideas vivid and concrete so they stick in memory and influence behavior. Abstract principles are easily forgotten; vivid examples and stories are remembered and acted upon.",
    whenToUse: "When trying to remember a mental model or teach one to others. Convert abstract concepts into vivid, concrete stories. The more vivid, the more powerful the influence on future thinking.",
    example: "Munger's own speeches are full of vivid examples — he doesn't just say 'watch for incentives,' he tells stories of corrupt appraisers and manipulated doctors." },

  { name: "Man-with-a-Hammer Tendency", category: "General Thinking Tools", tags: ["thinking","over-specialization","bias"], modelId: "MG-052", source: "munger",
    concept: "'To a man with a hammer, everything looks like a nail.' People overuse the tools and models they're most familiar with, applying them to problems where they don't fit. This is the core reason for multidisciplinary thinking.",
    whenToUse: "When you catch yourself using the same approach for every problem. Ask: 'Am I using this tool because it's the right one, or because it's the only one I know?'",
    example: "A finance person reducing every problem to a spreadsheet; an engineer seeing every issue as a technical problem; a psychologist attributing everything to childhood. All hammers, no screwdrivers." },

  // === Economics & Business: Core Principles (20) ===
  { name: "Supply and Demand", category: "Microeconomics", tags: ["economics","supply","demand"], modelId: "MG-053", source: "munger",
    concept: "Prices are determined by the intersection of supply and demand. When supply exceeds demand, prices fall. When demand exceeds supply, prices rise. This is the most fundamental model in economics.",
    whenToUse: "When evaluating market dynamics, pricing decisions, or investment opportunities. Always ask: 'What's happening to supply? What's happening to demand?'",
    example: "Housing prices rising in cities where building is restricted (limited supply) and population is growing (increasing demand). The model predicts price increases before they happen." },

  { name: "Elasticity", category: "Microeconomics", tags: ["economics","sensitivity","pricing"], modelId: "MG-054", source: "munger",
    concept: "How much demand or supply changes in response to price changes. Inelastic goods (necessities, addictive products) see small demand changes when prices change. Elastic goods (luxuries, substitutes available) see large changes.",
    whenToUse: "When pricing a product or evaluating a business. Businesses with inelastic demand (like cigarettes, pharmaceuticals) have pricing power; those with elastic demand compete on price.",
    example: "Apple can raise iPhone prices without losing many customers (inelastic demand due to brand loyalty and ecosystem lock-in). A generic food brand cannot (elastic demand — many substitutes)." },

  { name: "Opportunity Cost", category: "Microeconomics", tags: ["economics","cost","trade-off"], modelId: "MG-055", source: "munger",
    concept: "The true cost of any choice is the value of the best alternative you gave up. Money, time, and attention spent on one thing cannot be spent on another. Opportunity cost is the central idea in economics.",
    whenToUse: "Every time you say 'yes' to something, you're saying 'no' to something else. Always ask: 'What am I giving up by doing this?' The unseen cost often exceeds the seen cost.",
    example: "Going to grad school costs not just tuition, but 2 years of lost earnings. Investing in Stock A means you can't invest that money in Stock B. Time spent in meetings is time not spent thinking." },

  { name: "Comparative Advantage", category: "Microeconomics", tags: ["economics","trade","specialization"], modelId: "MG-056", source: "munger",
    concept: "Even if you're worse at everything than someone else, you should still specialize in what you're least bad at and trade. The key is not absolute advantage but relative advantage — what you give up least to produce.",
    whenToUse: "When deciding what to do yourself vs. delegate or outsource. Focus on your comparative advantage and trade for the rest. This applies to people, companies, and countries.",
    example: "A CEO who's also a great programmer should still delegate coding — not because she's bad at it, but because her comparative advantage is in strategic decisions, where the opportunity cost of coding is enormous." },

  { name: "Marginal Utility / Diminishing Returns", category: "Microeconomics", tags: ["economics","diminishing","utility"], modelId: "MG-057", source: "munger",
    concept: "Each additional unit of something provides less satisfaction or value than the previous one. The first slice of pizza is amazing; the fifth is not. The first million dollars changes your life; the tenth barely registers.",
    whenToUse: "When allocating resources. The optimal point is where marginal benefit equals marginal cost — not where total benefit is maximized. Pushing beyond this point destroys value.",
    example: "Studying 2 hours a day is very productive; studying 10 hours yields diminishing returns and burnout. The 5th hour of meetings adds almost nothing. The 3rd layer of review catches almost no new errors." },

  { name: "Time Value of Money", category: "Microeconomics", tags: ["economics","time","discounting"], modelId: "MG-058", source: "munger",
    concept: "A dollar today is worth more than a dollar tomorrow because of the potential to invest and earn returns. This fundamental principle underlies all of finance and investment.",
    whenToUse: "When comparing cash flows at different times. Always discount future cash flows to present value. The further in the future, the less valuable (all else equal).",
    example: "$100 today invested at 10% becomes $110 next year — so $100 today = $110 next year. Any offer of $105 next year for $100 today is a bad deal at a 10% discount rate." },

  { name: "Incentives & Incentive Alignment", category: "Microeconomics", tags: ["economics","incentives","alignment"], modelId: "MG-059", source: "munger",
    concept: "The most powerful force in human behavior. If you get the incentives right, the system works. If you get them wrong, nothing else matters. Incentive alignment means ensuring the interests of agents match the interests of principals.",
    whenToUse: "When designing any system — company, team, contract, government policy. Munger: 'Show me the incentive and I will show you the outcome.' If outcomes are bad, look at incentives first.",
    example: "Pay bankers on volume of loans → they originate bad loans. Pay teachers on test scores → they teach to the test. Align incentives with desired outcomes, not easily-gamed metrics." },

  { name: "Agency Problem / Principal-Agent Problem", category: "Microeconomics", tags: ["economics","agency","conflict"], modelId: "MG-060", source: "munger",
    concept: "When one person (agent) makes decisions on behalf of another (principal), their interests may diverge. The agent may act in their own interest rather than the principal's, especially when monitoring is costly.",
    whenToUse: "When evaluating any delegated decision. Ask: 'Are the agent's incentives aligned with mine? How would I behave if I were in their position?'",
    example: "CEOs maximizing short-term stock price (benefits their options) at the expense of long-term value (hurts shareholders). Real estate agents pushing quick sales over best price." },

  { name: "Information Asymmetry", category: "Microeconomics", tags: ["economics","information","imbalance"], modelId: "MG-061", source: "munger",
    concept: "When one party in a transaction has more or better information than the other. The informed party can exploit the uninformed party. This is why 'caveat emptor' (buyer beware) exists and why trust is so valuable.",
    whenToUse: "When entering any transaction where the other side knows more than you. Get independent verification. The person who knows less is the one who gets taken advantage of.",
    example: "Used car sales (seller knows the car's flaws), healthcare (doctor knows more than patient), insurance (buyer knows their risk better than insurer)." },

  { name: "Adverse Selection", category: "Microeconomics", tags: ["economics","selection","market"], modelId: "MG-062", source: "munger",
    concept: "When the people most eager to transact are the ones you least want to deal with. Bad risks are most likely to buy insurance; sick people are most likely to sign up for healthcare. The market selects against the prudent.",
    whenToUse: "When offering or accepting a deal that's too good to be true. Ask: 'Why is this person so eager to do this deal? What do they know that I don't?'",
    example: "The only people who want to buy your life insurance policy are those who know they're sick. The only people who want to sell you their business are those who know it's declining." },

  { name: "Moral Hazard", category: "Microeconomics", tags: ["economics","risk","insurance"], modelId: "MG-063", source: "munger",
    concept: "When people take more risks because they're protected from the consequences. Insurance, bailouts, and guarantees all create moral hazard by separating the decision-maker from the cost of bad decisions.",
    whenToUse: "When designing safety nets or guarantees. If you remove all downside risk, you also remove the incentive to be careful. The best systems have skin in the game.",
    example: "Banks making reckless loans because they know the government will bail them out. People with comprehensive insurance taking less care of their property." },

  { name: "Pareto Principle", category: "Microeconomics", tags: ["economics","80-20","efficiency"], modelId: "MG-064", source: "munger",
    concept: "80% of outcomes come from 20% of causes. 80% of revenue comes from 20% of customers. 80% of bugs come from 20% of code. This power-law distribution appears everywhere in nature and business.",
    whenToUse: "When prioritizing effort. Find the 20% that drives 80% of results and focus there. Don't spread effort evenly — concentrate on the highest-leverage activities.",
    example: "In investing: 80% of returns come from 20% of positions. In sales: 80% of revenue from 20% of clients. In life: 80% of happiness from 20% of activities." },

  { name: "Gresham's Law", category: "Microeconomics", tags: ["economics","quality","degradation"], modelId: "MG-065", source: "munger",
    concept: "'Bad money drives out good.' More broadly: when two forms of something circulate and one is inferior, the inferior version tends to dominate because people hoard the superior version. Applies to currencies, norms, culture, and talent.",
    whenToUse: "When you see quality declining in a system. If bad behavior is tolerated, it drives out good behavior. If low-quality content is rewarded, high-quality content disappears.",
    example: "In a company where cutting corners is rewarded and thoroughness is punished, the careful workers leave and the corner-cutters remain. Toxic culture drives out healthy culture." },

  { name: "Creative Destruction", category: "Microeconomics", tags: ["economics","innovation","disruption"], modelId: "MG-066", source: "munger",
    concept: "Schumpeter's insight that capitalism progresses by destroying old structures to create new ones. Innovation doesn't just add — it replaces. Every new technology destroys the economic value of what came before.",
    whenToUse: "When evaluating long-term investments or career choices. Ask: 'Is this business/industry/skill vulnerable to creative destruction?' What creates value for one destroys it for another.",
    example: "Digital cameras destroyed film (Kodak). Streaming destroyed Blockbuster. AI is destroying certain types of work while creating others. The process is painful but drives progress." },

  { name: "Value to a Private Owner", category: "Microeconomics", tags: ["economics","valuation","intrinsic"], modelId: "MG-067", source: "munger",
    concept: "The true value of a business is what it would be worth to a knowledgeable private owner who could take all the cash flows — not the stock market price, which is influenced by sentiment and momentum.",
    whenToUse: "When valuing a business or investment. Ask: 'What would I pay for this if I could own it entirely and take all the cash flows?' This strips away market noise.",
    example: "A stock trading at 50x earnings might be 'priced for perfection' while a private owner would only pay 10-15x. Munger and Buffett bought businesses at private-owner valuations, not market prices." },

  { name: "Mr. Market", category: "Microeconomics", tags: ["economics","market","sentiment"], modelId: "MG-068", source: "munger",
    concept: "Graham's metaphor: the market is a manic-depressive partner named Mr. Market. Some days he's euphoric and offers you high prices; other days he's depressed and offers bargains. You can accept or ignore his offers — he doesn't care.",
    whenToUse: "When market prices swing wildly. Remember: the market is there to serve you, not to inform you. Don't let Mr. Market's moods dictate your decisions.",
    example: "During market crashes, Mr. Market is depressed and offering bargains. During bubbles, he's euphoric and offering inflated prices. The wise investor ignores his moods and focuses on value." },

  { name: "Margin of Safety", category: "Microeconomics", tags: ["economics","safety","buffer"], modelId: "MG-069", source: "munger",
    concept: "Always build a buffer between what you think something is worth and what you pay for it. If you think a stock is worth $100, don't pay $99 — pay $60 or $70. The margin of safety protects you from errors in estimation and bad luck.",
    whenToUse: "In any decision where estimates are uncertain (which is most decisions). Don't cut it close — build in room for error. The bigger the uncertainty, the bigger the margin needed.",
    example: "Engineering: bridges are built to hold 5x the expected load. Investing: buy at a significant discount to intrinsic value. Life: leave early for important meetings. All margin of safety." },

  { name: "Tax Deferral & Compounding Advantage", category: "Microeconomics", tags: ["economics","tax","compounding"], modelId: "MG-070", source: "munger",
    concept: "Deferring taxes allows money to compound on pre-tax returns, creating enormous advantages over time. A dollar that compounds tax-free for 30 years grows far more than a dollar taxed annually, even at the same pre-tax return.",
    whenToUse: "When making investment decisions. Long-term holding defers capital gains taxes and allows compounding. Frequent trading incurs taxes that devastate long-term returns.",
    example: "If you invest $100K at 10% and pay 30% tax each year, after 30 years you have ~$764K. If you defer tax (like in a retirement account), you have ~$1.74M. The difference is over $1M." },

  { name: "Value Creation vs. Value Capture", category: "Microeconomics", tags: ["economics","value","competition"], modelId: "MG-071", source: "munger",
    concept: "Creating value and capturing value are different things. A company can create enormous value for society but capture little profit (airlines), or create modest value but capture enormous profit (luxury brands). The key question is: who keeps the surplus?",
    whenToUse: "When evaluating businesses or career choices. Ask: 'Who captures the value being created?' Not who creates the most value, but who keeps the most. These are very different things.",
    example: "Airlines create massive value (transportation) but capture little (low margins, intense competition). Pharma companies with patents capture enormous value from their innovations." },

  { name: "Obsolescence Risk", category: "Microeconomics", tags: ["economics","obsolescence","innovation"], modelId: "MG-072", source: "munger",
    concept: "Every business and technology has a finite useful life. Innovation makes existing products, skills, and business models obsolete. The risk of obsolescence is the fundamental risk in long-term investing.",
    whenToUse: "When making long-term investments or career choices. Ask: 'Will this exist in 10 years? What could make it obsolete?' The faster the industry changes, the higher the obsolescence risk.",
    example: "Newspapers, landline phones, DVD rental stores — all were once dominant and then made obsolete. Even great businesses can be destroyed by technological change." },

  // === Business: Competitive Advantage & Moats (19) ===
  { name: "Economic Moats", category: "Microeconomics", tags: ["business","moat","advantage"], modelId: "MG-073", source: "munger",
    concept: "A durable competitive advantage that protects a business from competitors, like a moat protecting a castle. Moats come in many forms: brand, switching costs, network effects, cost advantages, and patents. Without a moat, competition erodes all excess returns.",
    whenToUse: "When evaluating a business's long-term prospects. Ask: 'What prevents competitors from taking this business?' If the answer is 'nothing,' there's no moat and no sustainable advantage.",
    example: "Coca-Cola's moat is its brand; Microsoft's is switching costs; Facebook's is network effects; Amazon's is scale. Each moat type protects differently and has different durability." },

  { name: "Cost Advantages", category: "Microeconomics", tags: ["business","cost","efficiency"], modelId: "MG-074", source: "munger",
    concept: "Some businesses have structural advantages that allow them to operate at lower costs than competitors. These can come from scale, location, unique assets, or proprietary processes. Cost advantages create sustainable moats when they can't be easily replicated.",
    whenToUse: "When analyzing a business's competitive position. Ask: 'Can this company produce the same output at lower cost than competitors? Is this advantage structural or temporary?'",
    example: "Walmart's scale gives it purchasing power that smaller retailers can't match. Geico's direct-to-consumer model eliminates agent commissions, giving it a structural cost advantage." },

  { name: "Differentiation & Brand Power", category: "Microeconomics", tags: ["business","brand","differentiation"], modelId: "MG-075", source: "munger",
    concept: "When customers perceive a product as unique or superior, they're willing to pay a premium. Strong brands create emotional connections that transcend rational comparison. Brand power is one of the most durable moats.",
    whenToUse: "When evaluating pricing power. A strong brand can charge more for essentially the same product. The premium IS the moat.",
    example: "Coca-Cola vs. generic cola: people pay 2-3x for the brand, even though blind taste tests show many can't tell the difference. The brand, not the liquid, is the moat." },

  { name: "Switching Costs", category: "Microeconomics", tags: ["business","switching","lock-in"], modelId: "MG-076", source: "munger",
    concept: "When it's costly, time-consuming, or risky for customers to switch to a competitor, the business has a switching cost moat. These costs can be financial (cancellation fees), technical (data migration), or psychological (learning new systems).",
    whenToUse: "When evaluating customer retention. Ask: 'How painful would it be for customers to switch?' The more painful, the stronger the moat. High switching costs = high pricing power.",
    example: "Enterprise software (SAP, Oracle): switching requires retraining thousands of employees, migrating years of data, and risking business disruption. So customers stay and pay annual increases." },

  { name: "Network Effects", category: "Microeconomics", tags: ["business","network","scale"], modelId: "MG-077", source: "munger",
    concept: "A product or service becomes more valuable as more people use it. Each new user adds value for all existing users. This creates a powerful flywheel: more users → more value → more users. The winner-take-most dynamic makes network effects the strongest moat.",
    whenToUse: "When evaluating platform businesses. Ask: 'Does this get more valuable as more people use it?' If yes, early leads tend to compound into dominant positions.",
    example: "Facebook: each new user makes the network more valuable for everyone. Visa: each new merchant makes the card more useful for consumers, and vice versa. The flywheel is self-reinforcing." },

  { name: "Scale Economies – Supply Side", category: "Microeconomics", tags: ["business","scale","supply"], modelId: "MG-078", source: "munger",
    concept: "As production volume increases, fixed costs are spread over more units, reducing per-unit cost. The biggest producer has the lowest unit cost, enabling lower prices or higher margins. This creates a virtuous cycle: lower costs → more sales → even lower costs.",
    whenToUse: "When analyzing manufacturing or capital-intensive businesses. The company with the largest scale often has an insurmountable cost advantage.",
    example: "Amazon's fulfillment network: the fixed cost of warehouses and logistics is spread over billions of shipments, giving per-unit costs no competitor can match." },

  { name: "Scale Economies – Demand Side", category: "Microeconomics", tags: ["business","scale","demand"], modelId: "MG-079", source: "munger",
    concept: "As a platform gains more users on one side, it attracts more users on the other side (and vice versa). This two-sided network effect creates powerful demand-side economies of scale that accelerate growth.",
    whenToUse: "When evaluating marketplace or platform businesses. The more buyers, the more sellers; the more sellers, the more buyers. This creates a flywheel that's hard to stop once started.",
    example: "Uber: more drivers → shorter wait times → more riders → more revenue per driver → more drivers. The two-sided marketplace reinforces itself." },

  { name: "Learning/Experience Curve", category: "Microeconomics", tags: ["business","learning","experience"], modelId: "MG-080", source: "munger",
    concept: "Costs fall predictably as cumulative production experience increases. Each time production doubles, per-unit costs drop by a consistent percentage. This isn't just about scale — it's about learning, process improvement, and iteration.",
    whenToUse: "When analyzing industries where process improvement matters. Early movers accumulate experience faster, creating compounding advantages over time.",
    example: "Semiconductor manufacturing: each generation of chips benefits from the learning of previous generations. Intel's early lead compounded over decades." },

  { name: "Lock-In via Distribution/Physical Network", category: "Microeconomics", tags: ["business","distribution","lock-in"], modelId: "MG-081", source: "munger",
    concept: "When a company controls physical distribution infrastructure or networks that are too expensive to replicate, it creates a natural monopoly or oligopoly. The capital requirements serve as a barrier to entry.",
    whenToUse: "When evaluating infrastructure or distribution businesses. The key question: 'How much capital would a competitor need to replicate this network?' If the answer is billions, the moat is deep.",
    example: "Railroads, pipelines, and cable networks: the initial capital cost is so enormous that duplicating the infrastructure is uneconomic. The first mover has a permanent advantage." },

  { name: "Winner-Take-All / Winner-Take-Most Markets", category: "Microeconomics", tags: ["business","competition","concentration"], modelId: "MG-082", source: "munger",
    concept: "In some markets, the leader captures virtually all the value — or a disproportionate share. This happens when network effects, switching costs, or scale advantages create a tipping point where one player's advantage becomes self-reinforcing and insurmountable.",
    whenToUse: "When evaluating market structure. Ask: 'Is this a market where the leader gets stronger by winning?' If yes, the prize for first place is enormous and the penalty for second is severe.",
    example: "Search (Google), OS (Microsoft), social networking (Facebook). In each, the leader's advantage compounded until competition became almost impossible." },

  { name: "Moat Durability", category: "Microeconomics", tags: ["business","durability","moat"], modelId: "MG-083", source: "munger",
    concept: "Not all moats are equally durable. Some are eroded by technology, regulation, or changing consumer preferences. The key question isn't just 'Is there a moat?' but 'How long will this moat last?' Durability is what separates great businesses from good ones.",
    whenToUse: "When making long-term investments. A moat that lasts 5 years is worth much less than one that lasts 50 years. Ask: 'What could destroy this moat?'",
    example: "Newspapers had enormous moats (distribution, brand, classifieds) that were destroyed by the internet. Patent moats expire. Brand moats can last generations (Coca-Cola, Hershey)." },

  { name: "Industry Structure", category: "Microeconomics", tags: ["business","structure","competition"], modelId: "MG-084", source: "munger",
    concept: "The structure of an industry — monopoly, oligopoly, monopolistic competition, or perfect competition — determines the profitability of all players in it. Some industries are structurally more profitable than others, regardless of management quality.",
    whenToUse: "When evaluating an investment. Even the best manager can't make a good return in a terrible industry. And an average manager can look brilliant in a great industry.",
    example: "Airlines: terrible industry structure (high fixed costs, low differentiation, overcapacity) → decades of low returns. Credit card networks: oligopoly with network effects → enormous returns." },

  { name: "Rational vs. Cutthroat Competition", category: "Microeconomics", tags: ["business","competition","pricing"], modelId: "MG-085", source: "munger",
    concept: "In some industries, competitors compete rationally (avoiding price wars, maintaining margins). In others, competition is cutthroat (race to the bottom on price). Rational competition preserves value; cutthroat competition destroys it.",
    whenToUse: "When analyzing industry dynamics. Ask: 'Do these companies compete on value or on price?' Oligopolies tend toward rational competition; fragmented markets tend toward cutthroat competition.",
    example: "Auto insurance: a few big players compete on service and brand, not just price → decent margins. Airlines: endless price wars → terrible margins for decades." },

  { name: "Platform Economics", category: "Microeconomics", tags: ["business","platform","marketplace"], modelId: "MG-086", source: "munger",
    concept: "Two-sided markets where a platform connects buyers and sellers, creating value by reducing transaction costs. The platform doesn't produce goods — it facilitates exchange. The key metric is liquidity: enough buyers and sellers to make the platform useful.",
    whenToUse: "When evaluating marketplace businesses. The platform with the most liquidity wins. Focus on whether both sides are growing and whether the platform creates net new value or just extracts it.",
    example: "Airbnb connects hosts and travelers. The more hosts, the more travelers want to use it. The more travelers, the more hosts want to list. This flywheel is the core of platform economics." },

  { name: "Capacity & Supply Discipline", category: "Microeconomics", tags: ["business","capacity","discipline"], modelId: "MG-087", source: "munger",
    concept: "Overcapacity destroys industry profitability. When too many players build too much capacity, everyone suffers. Industries with disciplined capacity additions are more profitable than those where everyone expands aggressively.",
    whenToUse: "When analyzing capital-intensive industries. Ask: 'Do the players add capacity rationally, or does each one build hoping to capture market share?' The latter leads to years of overcapacity and low returns.",
    example: "Semiconductor cycles: companies overbuild during booms, creating busts. Cement and steel have similar dynamics. The industry that adds capacity most prudently generates the best long-term returns." },

  { name: "Surfing Long Waves", category: "Microeconomics", tags: ["business","trends","secular"], modelId: "MG-088", source: "munger",
    concept: "Some businesses benefit from powerful, long-term secular trends that carry them forward regardless of short-term fluctuations. 'Surfing' these waves is far easier than swimming against them. The key is identifying which waves are durable.",
    whenToUse: "When evaluating business or career opportunities. Ask: 'Is this riding a secular wave or fighting against one?' Munger: 'The wise ones bet heavily when the world offers them an opportunity.'",
    example: "Amazon surfed the e-commerce wave. Apple surfed the mobile computing wave. Being in the right current matters more than swimming hard." },

  { name: "Technology as Friend vs. Killer", category: "Microeconomics", tags: ["business","technology","disruption"], modelId: "MG-089", source: "munger",
    concept: "Technology can be a friend or a killer depending on who benefits. Often, technology benefits consumers (lower prices) while destroying producer profits (commoditization). The question is: does the technology strengthen your moat or weaken it?",
    whenToUse: "When evaluating tech-driven change. Ask: 'Who captures the value created by this technology?' Often the answer is 'consumers, not producers.'",
    example: "Airlines: technology made flying cheaper (good for consumers) but destroyed airline profitability (bad for investors). Microchips: technology improved products but margins fell as competition intensified." },

  { name: "Bureaucracy / Diseconomies of Scale", category: "Microeconomics", tags: ["business","bureaucracy","scale"], modelId: "MG-090", source: "munger",
    concept: "Beyond a certain size, organizations become less efficient, not more. Coordination costs increase, decision-making slows, and internal politics dominate. The very scale that creates advantages also creates the seeds of decline.",
    whenToUse: "When evaluating large organizations. Ask: 'Are the diseconomies of scale starting to outweigh the economies?' Look for slow decisions, internal fiefdoms, and risk aversion as signs.",
    example: "Large tech companies that can't ship products as fast as startups. Government agencies where getting anything done requires navigating layers of bureaucracy. The bigger they are, the harder they fall." },

  { name: "Cancer-Surgery Formula", category: "Microeconomics", tags: ["business","restructuring","surgery"], modelId: "MG-091", source: "munger",
    concept: "Sometimes the only way to save the system is to cut out the bad parts, no matter how painful. Like cancer surgery, you remove the diseased tissue to save the patient. This applies to businesses, portfolios, and even personal habits.",
    whenToUse: "When a part of a system is destroying value and can't be fixed — only removed. The longer you wait, the more it spreads. Don't postpone necessary amputations.",
    example: "GE divesting businesses that were dragging down returns. An investor selling all losing positions to reallocate capital. A company firing a toxic but 'brilliant' employee who's destroying the team." },

  // === Mathematics & Probability (12) ===
  { name: "Basic Arithmetic Fluency", category: "Mathematics & Probability", tags: ["math","arithmetic","fluency"], modelId: "MG-092", source: "munger",
    concept: "You don't need advanced math — you need basic arithmetic fluency combined with the ability to think in numbers. Many terrible decisions come from failing to do simple arithmetic: unit economics, growth rates, and compound returns.",
    whenToUse: "Always. Before making any decision with financial implications, do the basic math. 'If I invest X at Y% for Z years, how much do I have?' Most people can't answer this, and it costs them dearly.",
    example: "A '90% off' sale on a $100 item doesn't make it $10 — it makes it $10 if the original price was real. A 'free' phone with a 2-year contract isn't free — you're paying for it in monthly fees." },

  { name: "Permutations & Combinations", category: "Mathematics & Probability", tags: ["math","combinatorics","counting"], modelId: "MG-093", source: "munger",
    concept: "Understanding how many ways things can combine or be arranged. This is essential for correctly estimating probabilities when multiple events are involved. Most people dramatically underestimate the number of possible outcomes.",
    whenToUse: "When estimating probabilities or assessing risk. If you have 10 variables each with 3 possible states, there are 59,049 possible outcomes. The number of scenarios grows exponentially with variables.",
    example: "Munger: 'The math of permutations and combinations is not that hard, but if you don't know it, you'll walk through life like a one-legged man in an ass-kicking contest.'" },

  { name: "Expected Value", category: "Mathematics & Probability", tags: ["math","probability","EV"], modelId: "MG-094", source: "munger",
    concept: "The probability-weighted average of all possible outcomes. EV = Σ (probability × outcome). This is the single most important concept in decision-making under uncertainty. Make decisions that maximize expected value over many repetitions.",
    whenToUse: "For every uncertain decision. Don't just think about the most likely outcome — think about the probability-weighted average of all outcomes. A 1% chance of a $1M gain has the same EV as a 100% chance of a $10K gain.",
    example: "A startup: 10% chance of $10M exit, 90% chance of $0 → EV = $1M. If you can invest $100K for 20% of it, your EV is $200K on a $100K investment — a good bet even though you'll probably lose." },

  { name: "Probabilistic Thinking / Base Rates", category: "Mathematics & Probability", tags: ["math","probability","base-rates"], modelId: "MG-095", source: "munger",
    concept: "Start with the base rate — how often does this type of thing happen in general? Then adjust based on specific evidence. Most people skip the base rate and go straight to the specific, leading to systematic over- or under-estimation.",
    whenToUse: "When estimating the likelihood of any event. Before considering the specifics, ask: 'How often does this happen in general?' Then adjust from there. The base rate is usually the best single predictor.",
    example: "90% of restaurants fail in the first year. Your restaurant might be special — but the base rate says it probably isn't. Start with 90% failure and adjust based on evidence, not hope." },

  { name: "Bayes' Rule / Bayesian Updating", category: "Mathematics & Probability", tags: ["math","bayesian","updating"], modelId: "MG-096", source: "munger",
    concept: "How to update your beliefs when new evidence arrives. Start with your prior probability, then adjust based on how likely the new evidence is under each hypothesis. The stronger the evidence, the bigger the update.",
    whenToUse: "When you receive new information that might change your mind. Ask: 'How likely is this evidence if I'm right? How likely if I'm wrong?' Update proportionally.",
    example: "A medical test is 99% accurate and you test positive for a disease that affects 1 in 10,000 people. Most people think they're 99% likely to be sick — but the base rate means it's actually only ~1% likely. The base rate dominates." },

  { name: "Regression to the Mean", category: "Mathematics & Probability", tags: ["math","regression","mean"], modelId: "MG-097", source: "munger",
    concept: "Extreme outcomes tend to be followed by more average outcomes. The tallest parents have children who are shorter than them (but still tall). The best-performing fund one year typically performs worse the next. This is not a causal force — it's statistical inevitability.",
    whenToUse: "When evaluating extreme performance. Ask: 'Is this extreme outcome due to skill or luck?' Most extreme outcomes involve luck, and luck regresses. Don't project extreme performance indefinitely.",
    example: "A student who scores 99th percentile on a test will likely score lower next time. A company with record profits one year will likely see slower growth the next. This isn't decline — it's statistics." },

  { name: "Normal Distribution vs. Fat Tails", category: "Mathematics & Probability", tags: ["math","distribution","tails"], modelId: "MG-098", source: "munger",
    concept: "Normal distributions (bell curves) have thin tails — extreme events are very rare. But many real-world phenomena have fat tails — extreme events are much more common than the normal distribution predicts. Using normal distribution models in fat-tailed worlds leads to catastrophic underestimation of risk.",
    whenToUse: "When assessing risk. Ask: 'Is this a thin-tailed or fat-tailed distribution?' Financial markets, pandemics, and wars are fat-tailed — the worst case is much worse than normal models predict.",
    example: "If stock returns were normally distributed, the 1987 crash (20σ event) would happen once in the lifetime of the universe. It happened in our lifetime. The distribution has fat tails." },

  { name: "Power Laws", category: "Mathematics & Probability", tags: ["math","power-law","extreme"], modelId: "MG-099", source: "munger",
    concept: "In power-law distributions, a few outcomes capture most of the value. Venture capital: ~1% of investments generate most returns. Wealth: ~1% of people own ~50% of assets. Cities: the largest city is ~2x the second largest. These distributions are not normal — they're extreme.",
    whenToUse: "When operating in winner-take-most domains. In power-law environments, missing the best opportunity is far more costly than in normal distributions. Portfolio concentration makes sense.",
    example: "In a VC portfolio, 1 investment out of 20 might return the entire fund. Missing that one deal is worse than making 19 mediocre ones. Power laws demand you be in the game for the extreme outcomes." },

  { name: "Cost–Benefit Analysis", category: "Mathematics & Probability", tags: ["math","cost-benefit","decision"], modelId: "MG-100", source: "munger",
    concept: "Formal comparison of the expected costs and benefits of a decision. List all costs and benefits, assign probabilities and magnitudes, and calculate the net expected value. This seems obvious but is rarely done rigorously in practice.",
    whenToUse: "When making important decisions. Write down the costs and benefits explicitly. Just the act of writing them down often reveals that a 'obvious' decision isn't so obvious after all.",
    example: "Should I take a new job? Costs: moving, leaving friends, learning curve. Benefits: higher salary, better title, growth opportunity. Quantify each and compare. Many decisions change direction when you do the math." },

  { name: "Compounding", category: "Mathematics & Probability", tags: ["math","compounding","growth"], modelId: "MG-101", source: "munger",
    concept: "The most powerful force in finance: returns earned on returns. Small consistent gains, compounded over long periods, produce extraordinary results. The key inputs are rate of return and time — and time matters more than rate.",
    whenToUse: "When evaluating long-term decisions. The difference between 7% and 10% compounded over 40 years is not 3% — it's 3x the final value. Small edges compound into enormous advantages.",
    example: "$10K invested at 10% for 50 years becomes $1.17M. At 12%, it becomes $2.89M. A 2% difference in rate = 2.5x the outcome. This is why Munger emphasized never interrupting compounding unnecessarily." },

  { name: "Optionality / Asymmetric Payoffs", category: "Mathematics & Probability", tags: ["math","optionality","asymmetry"], modelId: "MG-102", source: "munger",
    concept: "Seek situations where the downside is bounded (you can only lose what you put in) but the upside is unbounded. These asymmetric payoff profiles are where the best opportunities live. Preserve the option to participate in outsized gains while limiting losses.",
    whenToUse: "When evaluating opportunities. Ask: 'What's the most I can lose? What's the most I can gain?' If the upside is 10x+ the downside, it's worth serious consideration even if the probability is low.",
    example: "Early-stage investing: you can only lose 1x your investment, but you can make 100x. Education: the downside is tuition; the upside is unlimited career potential. Keep your upside open." },

  { name: "Kelly-Type Thinking", category: "Mathematics & Probability", tags: ["math","kelly","bet-sizing"], modelId: "MG-103", source: "munger",
    concept: "How much to bet when you have an edge. The Kelly criterion says you should bet proportionally to your edge — bigger edge, bigger bet. But even with an edge, never bet everything. Overbetting (even with an edge) leads to ruin. The key insight: survival matters more than optimization.",
    whenToUse: "When deciding how much to invest in any opportunity. Even if you have an edge, don't go all-in. Bet enough to matter, but never so much that a bad outcome wipes you out.",
    example: "If you have a 60% chance of winning a coin flip (biased coin), Kelly says bet 20% of your bankroll, not 100%. Over many flips, this maximizes growth. Going all-in on a 60% bet eventually leads to ruin." },

  // === Physics, Engineering & Systems (11) ===
  { name: "Critical Mass", category: "Physics & Systems", tags: ["physics","threshold","tipping"], modelId: "MG-104", source: "munger",
    concept: "Many systems have a threshold — a critical mass — below which nothing happens and above which dramatic change occurs. Nuclear chain reactions, viral marketing, social movements, and business momentum all exhibit critical mass dynamics.",
    whenToUse: "When building something new. Ask: 'What's the critical mass threshold?' Before reaching it, effort seems wasted. After reaching it, growth becomes self-sustaining. Don't quit just before the threshold.",
    example: "A social network that's boring with 100 users but explosive with 10,000. A nuclear reaction that doesn't happen with sub-critical mass. A business that's unprofitable until it reaches scale." },

  { name: "Leverage", category: "Physics & Systems", tags: ["physics","leverage","amplification"], modelId: "MG-105", source: "munger",
    concept: "A small force applied at the right point can produce a large effect. In business, leverage means using resources (capital, technology, people, brand) to amplify outcomes beyond what your direct effort alone could produce.",
    whenToUse: "When looking for ways to multiply your impact. Ask: 'Where is the leverage point in this system?' A small change at the leverage point produces outsized results.",
    example: "Code is leverage: write it once, it runs millions of times. Brand is leverage: advertise once, benefit for years. Capital is leverage: invest once, compound forever." },

  { name: "Redundancy / Backup Systems", category: "Physics & Systems", tags: ["engineering","redundancy","safety"], modelId: "MG-106", source: "munger",
    concept: "Critical systems need backup components so that if one fails, the system continues to function. The cost of redundancy is paid in advance; the cost of failure is paid catastrophically later. In engineering, this is called 'single point of failure' avoidance.",
    whenToUse: "When designing systems where failure is unacceptable. Ask: 'If this component fails, what happens?' If the answer is 'catastrophe,' you need redundancy. This applies to engineering, finance, health, and relationships.",
    example: "Airplanes have redundant hydraulic systems. Data centers have backup power. Investors keep emergency funds. The cost of redundancy is low; the cost of unprepared failure is infinite." },

  { name: "Breakpoints / Phase Transitions", category: "Physics & Systems", tags: ["physics","phase-transition","threshold"], modelId: "MG-107", source: "munger",
    concept: "Systems can exist in different states (solid/liquid/gas, stable/unstable, growing/declining) and transition between them at specific thresholds. These phase transitions are often abrupt — small changes cross a threshold and the system fundamentally changes character.",
    whenToUse: "When you see gradual change that might be approaching a threshold. Ask: 'Is this system near a phase transition?' Small additional changes might produce disproportionate effects.",
    example: "Water at 211°F is hot. At 212°F, it's steam — a fundamentally different substance. The 1-degree change creates a phase transition. Markets, ecosystems, and organizations behave similarly." },

  { name: "Friction & Efficiency Losses", category: "Physics & Systems", tags: ["physics","friction","efficiency"], modelId: "MG-108", source: "munger",
    concept: "No system is 100% efficient — energy is always lost to friction, heat, or waste. In business and life, there are always transaction costs, communication overhead, and organizational drag. The question is not whether friction exists, but how much and where.",
    whenToUse: "When designing processes or evaluating efficiency. Ask: 'Where is the friction in this system?' Reducing friction often yields more improvement than adding energy.",
    example: "Amazon reducing checkout friction (1-Click) dramatically increased sales. Reducing communication friction (Slack, email) speeds up organizations. The best improvement is often removing obstacles, not adding force." },

  { name: "Reliability Engineering / Safety Margins", category: "Physics & Systems", tags: ["engineering","safety","reliability"], modelId: "MG-109", source: "munger",
    concept: "Engineers design systems with safety margins — building them stronger, more redundant, and more robust than the expected load requires. This is the physical analog of Munger's margin of safety in investing. Things will go wrong; design for that reality.",
    whenToUse: "When building anything important. Ask: 'What's the expected load? What if it exceeds expectations?' Design for the 99th percentile stress, not the average. The cost of overbuilding is linear; the cost of failure is exponential.",
    example: "Bridges built to hold 5x expected traffic. Software with error handling for unexpected inputs. Financial plans with emergency funds. All are safety margins against the unexpected." },

  { name: "Feedback Loops – Positive (Reinforcing)", category: "Physics & Systems", tags: ["systems","feedback","reinforcing"], modelId: "MG-110", source: "munger",
    concept: "Positive feedback loops amplify change — the output of a process becomes input that makes the process stronger. This creates exponential growth or decline. Wealth → more investment → more wealth. Panic → more selling → more panic.",
    whenToUse: "When you see a trend accelerating. Ask: 'Is there a positive feedback loop driving this?' If yes, the trend will continue longer and go further than most people expect.",
    example: "Viral videos: more views → more recommendations → more views. Asset bubbles: rising prices → more buyers → higher prices. Debt spirals: debt → interest → more debt." },

  { name: "Feedback Loops – Negative (Stabilizing)", category: "Physics & Systems", tags: ["systems","feedback","stabilizing"], modelId: "MG-111", source: "munger",
    concept: "Negative feedback loops resist change — the output of a process becomes input that counteracts the process. This creates stability and equilibrium. Body temperature regulation, market supply/demand, and thermostat systems all use negative feedback.",
    whenToUse: "When a system seems self-correcting. Ask: 'What's the negative feedback that will bring this back to equilibrium?' This is why 'this time is different' is usually wrong — negative feedback eventually reasserts.",
    example: "High prices → more supply → lower prices. High profits → more competition → lower profits. Fever → sweating → cooling. The system resists extreme states." },

  { name: "Bottlenecks & Constraints", category: "Physics & Systems", tags: ["systems","bottleneck","constraint"], modelId: "MG-112", source: "munger",
    concept: "Every system has a bottleneck — the step that limits the throughput of the entire system. Improving anything other than the bottleneck doesn't increase output. To improve the system, find the bottleneck and fix it first.",
    whenToUse: "When trying to improve a system's output. Don't optimize non-bottlenecks — they don't limit output. Find the constraint and focus all effort there. This is the Theory of Constraints.",
    example: "A factory where step 3 can only process 10 units/hour while all other steps handle 100. Improving step 4 to 200 units/hour does nothing. Only improving step 3 increases total output." },

  { name: "Nonlinearity", category: "Physics & Systems", tags: ["systems","nonlinearity","disproportionate"], modelId: "MG-113", source: "munger",
    concept: "Causes and effects are not always proportional. Small inputs can produce huge outputs (tipping points), and large inputs can produce tiny outputs (saturation). Assuming linearity in a nonlinear world leads to systematic errors.",
    whenToUse: "When assuming 'a little more effort = a little more result.' This is often wrong. Ask: 'Is the relationship between input and output linear? Or are there thresholds, accelerations, or saturations?'",
    example: "One drop of water doesn't break a dam, but the millionth drop does — nonlinearity. Adding one more person to a 9-person team increases output; adding one more to a 99-person team might decrease it (coordination costs)." },

  { name: "System Resilience vs. Fragility", category: "Physics & Systems", tags: ["systems","resilience","fragility"], modelId: "MG-114", source: "munger",
    concept: "Resilient systems absorb shocks and continue functioning. Fragile systems break under stress. The key difference: resilient systems have redundancy, diversity, and slack; fragile systems are optimized for efficiency at the expense of robustness.",
    whenToUse: "When designing or evaluating systems. Ask: 'What happens when something goes wrong?' A resilient system degrades gracefully; a fragile system fails catastrophically. The most dangerous systems are those that appear stable until they suddenly collapse.",
    example: "Just-in-time supply chains are efficient but fragile (COVID exposed this). Diversified investments are resilient. Single-source suppliers are fragile. Slack in schedules creates resilience." },

  // === Biology & Evolution (6) ===
  { name: "Evolution by Natural Selection", category: "Biology & Evolution", tags: ["biology","evolution","selection"], modelId: "MG-115", source: "munger",
    concept: "The fundamental algorithm of biology: variation + selection + replication = adaptation. Whatever works survives and replicates; whatever doesn't, doesn't. This process, repeated over vast timescales, produces extraordinary complexity and fitness.",
    whenToUse: "When analyzing competitive dynamics. Markets, technologies, and organizations evolve by natural selection: the fittest survive. Don't fight evolution — understand what the environment is selecting for.",
    example: "Business evolution: companies that adapt to changing markets survive; those that don't, die. The market is the selection environment. Survival is not about being the best — it's about being the best fit for the current environment." },

  { name: "Adaptation & Fitness Landscapes", category: "Biology & Evolution", tags: ["biology","adaptation","fitness"], modelId: "MG-116", source: "munger",
    concept: "A fitness landscape maps every possible strategy to its fitness level. Peaks represent good strategies; valleys represent poor ones. The challenge: you might be on a local peak (good but not great) and need to cross a valley (temporarily worse) to reach a higher peak.",
    whenToUse: "When you're stuck at a 'good enough' level. To reach a higher peak, you may need to temporarily get worse. Ask: 'Am I on a local peak? Is there a higher peak worth crossing a valley for?'",
    example: "A successful company that needs to cannibalize its own product to reach a higher peak (Apple killing the iPod to build the iPhone). The valley (temporarily lower profits) is necessary to reach the higher peak." },

  { name: "Red Queen Effect", category: "Biology & Evolution", tags: ["biology","competition","arms-race"], modelId: "MG-117", source: "munger",
    concept: "'It takes all the running you can do to keep in the same place.' In competitive environments, you must continuously improve just to maintain your relative position. Standing still means falling behind.",
    whenToUse: "When evaluating competitive dynamics. If your competitors are improving, you must improve at least as fast just to stay even. The Red Queen effect explains why constant innovation is necessary, not optional.",
    example: "Technology companies: Intel's tick-tock cadence wasn't optional — AMD was constantly improving. If Intel stopped, AMD would catch up. In any competitive arena, standing still = falling behind." },

  { name: "Niches & Ecological Competition", category: "Biology & Evolution", tags: ["biology","niche","competition"], modelId: "MG-118", source: "munger",
    concept: "Species (and businesses) thrive in niches — specific environments where they have advantages. When two species occupy the same niche, they compete intensely until one dominates or they differentiate. Finding an unoccupied niche is far easier than fighting for an occupied one.",
    whenToUse: "When entering a market. Ask: 'Is this niche occupied? If so, can I differentiate?' The best strategy is often finding an unoccupied niche rather than competing head-on with established players.",
    example: "Southwest Airlines occupied the short-haul, no-frills niche that major airlines ignored. Once established, the niche was defensible. Finding your niche is the biological equivalent of finding your circle of competence." },

  { name: "Population Dynamics", category: "Biology & Evolution", tags: ["biology","population","cycles"], modelId: "MG-119", source: "munger",
    concept: "Populations grow exponentially until limited by resources, then crash or stabilize. This boom-bust cycle appears in biological populations, markets, industries, and trends. Understanding where you are in the cycle is crucial.",
    whenToUse: "When evaluating rapidly growing markets or trends. Ask: 'Are we in the boom phase or near the bust?' Exponential growth never lasts forever — something always limits it. The question is when and how the limit is reached.",
    example: "Crypto 2017: exponential growth in users and prices, then a crash. COVID cases: exponential growth until measures/restrictions kick in. Industry capacity: boom builds, bust destroys." },

  { name: "Autopsy Learning", category: "Biology & Evolution", tags: ["biology","learning","failure"], modelId: "MG-120", source: "munger",
    concept: "Study failures to understand what works. In medicine, autopsies reveal causes of death that improve treatment for the living. In business and investing, post-mortems of failed ventures reveal patterns to avoid. The dead teach the living.",
    whenToUse: "After any failure — yours or others'. Conduct a blameless post-mortem. Ask: 'What went wrong? What would I do differently?' The lessons from failure are often more valuable than the lessons from success.",
    example: "Munger studying business failures (not just successes) to understand what destroys value. Aviation learning from every crash to improve safety. The principle: study what kills, not just what thrives." },

  // === Organizational & Institutional (9) ===
  { name: "Corporate Governance", category: "Organization & Institutions", tags: ["organization","governance","oversight"], modelId: "MG-121", source: "munger",
    concept: "The system of rules, practices, and processes by which a company is directed and controlled. Good governance aligns management with shareholders; bad governance allows management to enrich themselves at shareholders' expense.",
    whenToUse: "When evaluating a company as an investment. Ask: 'Are the interests of management aligned with shareholders? Is the board independent and competent?' Bad governance eventually destroys value.",
    example: "Companies with dual-class shares where insiders control voting regardless of economic ownership. Board members who are friends of the CEO. These governance flaws predict future problems." },

  { name: "Management Incentives & Compensation Design", category: "Organization & Institutions", tags: ["organization","compensation","incentives"], modelId: "MG-122", source: "munger",
    concept: "How you pay people determines how they behave. Commission structures, stock options, bonuses, and salary mixes all create different incentives. The design of compensation IS the design of organizational behavior.",
    whenToUse: "When designing or evaluating compensation systems. Ask: 'What behavior does this compensation structure incentivize?' If you incentivize short-term metrics, you get short-term thinking.",
    example: "Stock options that vest over 10 years incentivize long-term thinking. Quarterly bonuses incentivize short-term results. Munger: 'Show me the incentive and I will show you the outcome.'" },

  { name: "Culture as a Control System", category: "Organization & Institutions", tags: ["organization","culture","norms"], modelId: "MG-123", source: "munger",
    concept: "Organizational culture — the unwritten norms, values, and expectations — is often more powerful than formal rules. Culture determines what people do when no one is watching. Strong culture is a competitive advantage; weak culture is a competitive disadvantage.",
    whenToUse: "When evaluating organizations. A strong culture (like Costco's or Berkshire's) reduces the need for monitoring and enforcement. A toxic culture generates costs that no amount of policy can fix.",
    example: "Costco's culture of treating employees well leads to low turnover and high productivity — a competitive advantage. Enron's culture of aggressive risk-taking led to fraud — a competitive disadvantage." },

  { name: "Bureaucratic Inertia & Empire Building", category: "Organization & Institutions", tags: ["organization","bureaucracy","inertia"], modelId: "MG-124", source: "munger",
    concept: "Organizations naturally accumulate bureaucracy over time. Managers build empires (hiring more staff, expanding budgets) because their power and compensation are tied to organization size, not efficiency. This inertia makes large organizations slow and expensive.",
    whenToUse: "When evaluating or working within large organizations. Ask: 'Is this person optimizing for the organization's success or for their own empire?' Bureaucratic inertia is the natural state; fighting it requires constant effort.",
    example: "A manager who fights to keep a department even after it's no longer needed, because losing staff means losing status. Government agencies that grow regardless of their actual utility." },

  { name: "Information Suppression / Shooting the Messenger", category: "Organization & Institutions", tags: ["organization","information","suppression"], modelId: "MG-125", source: "munger",
    concept: "In organizations, bad news often doesn't reach the top. Messengers who deliver bad news are punished (explicitly or implicitly), creating a culture where problems are hidden until they become crises. The higher you go, the more filtered your information becomes.",
    whenToUse: "When you're a leader: actively seek bad news and reward messengers. When you're analyzing an organization: assume the information reaching the top is more optimistic than reality.",
    example: "The Challenger disaster: engineers' warnings about O-ring failures were suppressed by management. Enron: accountants who raised concerns were sidelined. The pattern: kill the messenger, then the problem kills you." },

  { name: "Five W's Rule in Communication", category: "Organization & Institutions", tags: ["organization","communication","clarity"], modelId: "MG-126", source: "munger",
    concept: "Effective communication answers Who, What, Where, When, and Why. Omitting any of these creates confusion, misalignment, and errors. The Five W's ensure completeness and reduce the chance of misunderstanding.",
    whenToUse: "When writing or delivering important communications. Check: 'Have I covered Who, What, Where, When, and Why?' If any W is missing, the communication is incomplete.",
    example: "A project brief that says 'Build the new feature' (What) but doesn't specify Who owns it, When it's due, Where it lives, or Why it matters. Incomplete communication = incomplete execution." },

  { name: "Checklists & Standard Operating Procedures", category: "Organization & Institutions", tags: ["organization","checklist","procedure"], modelId: "MG-127", source: "munger",
    concept: "Formalized checklists and SOPs prevent errors and ensure consistency, especially under stress or fatigue. They externalize knowledge so it doesn't depend on any individual's memory. What gets formalized gets done; what stays in someone's head gets forgotten.",
    whenToUse: "For any important, repeated process. If the stakes are high and the process is complex, write it down and follow a checklist. Don't trust memory — trust the system.",
    example: "Aviation checklists before takeoff. Surgical checklists before incision. Investment checklists before committing capital. The common thread: high stakes + human memory = recipe for omission." },

  { name: "Talent, Trust, and Delegation", category: "Organization & Institutions", tags: ["organization","talent","delegation"], modelId: "MG-128", source: "munger",
    concept: "Hire a few high-quality people you trust, then delegate extensively. The cost of a bad hire is enormous (they destroy value and drag down the team), while the benefit of a great hire compounds over time. Trust enables delegation; delegation enables scale.",
    whenToUse: "When hiring or building teams. Munger and Buffett's approach: hire people you don't have to manage. If you can't trust someone, don't hire them. If you have to micromanage, you have the wrong person.",
    example: "Berkshire Hathaway's approach: acquire great businesses run by honest, competent managers, then leave them alone. The trust-based model reduces overhead and preserves entrepreneurial energy." },

  { name: "Avoiding Madness in Crowds", category: "Organization & Institutions", tags: ["organization","groupthink","independence"], modelId: "MG-129", source: "munger",
    concept: "Groups can make worse decisions than individuals due to groupthink, social proof, authority bias, and conformity pressure. The larger the group, the stronger the pressure to conform, and the worse the decisions can become. Independence of thought is the antidote.",
    whenToUse: "When making decisions in groups. Actively solicit dissenting opinions. Assign someone to play devil's advocate. Make people write their positions independently before group discussion. Never let the group override your own analysis.",
    example: "Investment committees where everyone agrees are often wrong. The best decisions come from rigorous debate, not consensus. Munger and Buffett disagreed frequently — and were better for it." }
];

async function deleteAllCurrentModels() {
  console.log('Fetching all current models from Notion...');
  let cursor;
  let allPages = [];
  
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    
    const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST', headers, body: JSON.stringify(body)
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(`Query failed: ${data.message}`);
    
    allPages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  
  console.log(`Found ${allPages.length} existing models to delete`);
  
  // Delete one by one with retry
  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i];
    const name = page.properties?.Name?.title?.[0]?.plain_text || 'unknown';
    let ok = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resp = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ archived: true })
        });
        const data = await resp.json();
        if (!resp.ok) {
          console.log(`  Retry ${attempt+1} for: ${name} - ${data.message}`);
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        console.log(`  Archived (${i+1}/${allPages.length}): ${name}`);
        ok = true;
        break;
      } catch(e) {
        console.log(`  Retry ${attempt+1} for: ${name} - ${e.message}`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    if (!ok) console.error(`  FAILED to archive: ${name}`);
    await new Promise(r => setTimeout(r, 350));
  }
}

async function createModel(model) {
  const properties = {
    Name: { title: [{ text: { content: model.name } }] },
    'English Name': { rich_text: [{ text: { content: model.name } }] },
    Category: { select: { name: model.category } },
    Source: { select: { name: model.source } },
    'Model ID': { rich_text: [{ text: { content: model.modelId } }] },
    Tags: { multi_select: model.tags.map(t => ({ name: t })) }
  };
  
  if (model.concept) properties['Core Concept'] = { rich_text: [{ text: { content: model.concept.substring(0, 2000) } }] };
  if (model.whenToUse) properties['When to Use'] = { rich_text: [{ text: { content: model.whenToUse.substring(0, 2000) } }] };
  if (model.example) properties['Example'] = { rich_text: [{ text: { content: model.example.substring(0, 2000) } }] };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST', headers,
        body: JSON.stringify({ parent: { database_id: DB_ID }, properties })
      });
      const data = await resp.json();
      if (!resp.ok) {
        if (attempt < 2) {
          console.log(`  Retry ${attempt+1} for: ${model.name} - ${data.message}`);
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        console.error(`  FAILED: ${model.name} - ${data.message}`);
        return false;
      }
      console.log(`  Created: ${model.modelId} - ${model.name}`);
      return true;
    } catch(e) {
      if (attempt < 2) {
        console.log(`  Retry ${attempt+1} for: ${model.name} - ${e.message}`);
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      console.error(`  FAILED: ${model.name} - ${e.message}`);
      return false;
    }
  }
  return false;
}

async function importAllModels() {
  console.log(`\nImporting ${models.length} models...`);
  let success = 0, failed = 0;
  
  for (let i = 0; i < models.length; i++) {
    const ok = await createModel(models[i]);
    if (ok) success++; else failed++;
    await new Promise(r => setTimeout(r, 350));
  }
  
  console.log(`\nDone! Success: ${success}, Failed: ${failed}`);
}

async function main() {
  console.log('=== Sources of Insight Import ===');
  console.log(`Total models to import: ${models.length}`);
  
  // Step 1: Delete all existing models
  await deleteAllCurrentModels();
  
  // Step 2: Import all new models
  await importAllModels();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
