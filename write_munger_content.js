const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

// Pre-written content for all 42 Munger models
const contentMap = {
  "The Map is Not the Territory": {
    coreConcept: "The map is not the territory means our mental models and representations of reality are not reality itself. A map simplifies and abstracts the real world, omitting details to be useful, but it can never capture the full complexity of what it represents. Relying too heavily on models without checking them against reality leads to errors in judgment.",
    whenToUse: "Use this model whenever you are making decisions based on models, data, or second-hand reports. It reminds you to verify your assumptions against direct observation.",
    example: "An investor reads a bullish research report (the map) about a company and buys shares without visiting the actual business or checking recent customer sentiment. The report was outdated, and the company was already declining — the map was wrong, but the investor treated it as the territory."
  },
  "Circle of Competence": {
    coreConcept: "The circle of competence represents the areas in which you have deep, reliable knowledge and understanding. Inside your circle, you can make well-informed decisions. Outside it, you are at a disadvantage against experts. Knowing the boundaries of your circle is more important than how large it is.",
    whenToUse: "Apply this model before making any significant investment, career, or business decision. It helps you say no to opportunities outside your area of expertise.",
    example: "Warren Buffett avoided the tech bubble in the late 1990s because internet companies were outside his circle of competence. While others lost fortunes, Berkshire Hathaway preserved capital by staying within what they understood."
  },
  "First Principles Thinking": {
    coreConcept: "First principles thinking involves breaking a problem down to its most basic, foundational truths (first principles) and building up a solution from there, rather than reasoning by analogy (doing what others do). This approach allows you to discover novel solutions that others miss.",
    whenToUse: "Use this when facing complex problems, innovating, or when conventional approaches are not working. It is especially powerful in engineering, product design, and strategic planning.",
    example: "Elon Musk used first principles to build SpaceX. Instead of accepting that rockets are expensive, he asked: what are the material costs of a rocket? The raw materials were only 2% of the typical price. By building from scratch, SpaceX dramatically reduced launch costs."
  },
  "Thought Experiment": {
    coreConcept: "A thought experiment is a mental simulation of a scenario to explore its consequences without physical experimentation. By imagining outcomes in your mind, you can test ideas, predict results, and uncover hidden assumptions before taking real-world action.",
    whenToUse: "Use thought experiments when real-world testing is costly, dangerous, or impossible. They are valuable in ethics, physics, strategy, and personal decision-making.",
    example: "Einstein imagined riding alongside a beam of light (the 'chasing a light beam' thought experiment). This mental simulation led him to realize that time must slow down at high speeds, a key insight that became the foundation of special relativity."
  },
  "Second-Order Thinking": {
    coreConcept: "Second-order thinking means looking beyond the immediate, obvious consequences of a decision (first-order effects) to consider the longer-term and indirect effects (second- and third-order effects). Most people stop at first-order thinking, which often leads to unintended negative consequences.",
    whenToUse: "Use this model for any decision with ripple effects — policy changes, business strategy, major purchases, or relationship choices. Ask: 'And then what?' repeatedly.",
    example: "A city builds a new highway to reduce traffic congestion (first-order: less traffic). But the easier commute encourages people to live farther away, increasing total car usage, and within a few years the highway is even more congested than before (second-order: induced demand)."
  },
  "Probabilistic Thinking": {
    coreConcept: "Probabilistic thinking means evaluating decisions based on the likelihood of different outcomes rather than certainties. It involves assigning probabilities to scenarios and making choices that have the best expected value over many repetitions, rather than seeking guaranteed outcomes.",
    whenToUse: "Apply this model in investing, risk management, strategic planning, and any situation with uncertainty. It helps you make rational decisions even when outcomes are not guaranteed.",
    example: "A poker player does not know what cards the opponent holds, but based on betting patterns and probabilities, they calculate that calling has a 60% chance of winning. Over many hands, consistently making +EV (expected value) decisions leads to long-term profit."
  },
  "Inversion": {
    coreConcept: "Inversion is a problem-solving technique where you think about the opposite of what you want: instead of asking 'How do I succeed?', ask 'What would cause me to fail?' and avoid those things. By eliminating failure modes, success often follows naturally.",
    whenToUse: "Use inversion when you are stuck on a problem, facing a complex goal, or trying to avoid catastrophic outcomes. It is especially useful in risk management and long-term planning.",
    example: "Instead of asking 'How do I live a long, healthy life?', Charlie Munger asks 'What would cause me to die young and unhealthy?' — smoking, drinking, not exercising, eating poorly. By simply avoiding these failure modes, longevity is achieved without needing a complex positive plan."
  },
  "Occam's Razor": {
    coreConcept: "Occam's Razor states that among competing hypotheses, the one with the fewest assumptions should be selected. Simpler explanations are more likely to be correct than complex ones. Adding unnecessary complexity increases the chance of error.",
    whenToUse: "Apply this model when diagnosing problems, evaluating theories, or choosing between multiple explanations. If two explanations fit the facts equally well, prefer the simpler one.",
    example: "A website suddenly goes down. The complex explanation: a sophisticated cyberattack coordinated across multiple servers. The simple explanation: someone tripped over the power cord. Occam's Razor suggests checking the power cord first before investigating the complex scenario."
  },
  "Hanlon's Razor": {
    coreConcept: "Hanlon's Razor states: 'Never attribute to malice that which is adequately explained by stupidity (or incompetence).' People often assume others are acting out of bad intent, when in reality most errors come from carelessness, ignorance, or system failures rather than malicious intent.",
    whenToUse: "Use this model when you feel wronged, betrayed, or frustrated by someone's actions. Before assuming malice, consider whether incompetence, confusion, or misalignment could explain the behavior.",
    example: "A colleague fails to include you on an important email chain. Instead of assuming they are trying to cut you out, Hanlon's Razor suggests they simply forgot, were overloaded, or didn't realize you needed to be included. A quick, kind check-in resolves the issue without conflict."
  },
  "Relativity": {
    coreConcept: "Relativity in mental models refers to the idea that nothing exists in absolute terms — everything is understood in relation to something else. Value, quality, and meaning are all relative to context, comparison points, and framing. Understanding relativity helps you avoid being misled by isolated numbers.",
    whenToUse: "Apply this model when evaluating prices, performance, satisfaction, or any metric. Always ask: 'Relative to what?' to avoid being manipulated by anchoring or misleading comparisons.",
    example: "A store marks a shirt as '50% off, was $100, now $50.' The price feels like a great deal because of the relativity to the original price. But if the shirt's true market value is $30, the 'deal' is actually a rip-off. Relativity to the anchor price misleads the buyer."
  },
  "Reciprocity": {
    coreConcept: "Reciprocity is the social norm of responding to a positive action with another positive action, and a negative action with another negative action. Humans have a deep innate drive to repay favors, return kindness, and balance the scales. This can be used for good (building relationships) or exploited (manipulation).",
    whenToUse: "Use this model in negotiations, relationship building, sales, and conflict resolution. Give first to trigger the reciprocity instinct in others.",
    example: "A company sends free samples to potential customers. Even though the sample costs the company little, recipients feel an unconscious obligation to reciprocate by buying the product. This is why free trials and gifts are such powerful marketing tools."
  },
  "Thermodynamics": {
    coreConcept: "Thermodynamics involves the principles of energy, heat, and entropy. The second law of thermodynamics states that entropy (disorder) always increases in a closed system unless energy is added. In business and life, systems naturally degrade over time without ongoing input of energy and maintenance.",
    whenToUse: "Apply thermodynamic thinking when managing organizations, relationships, or any system that requires maintenance. Remember that 'things fall apart' is the default — continuous energy input is required to maintain order.",
    example: "A well-run restaurant requires constant energy: fresh ingredients delivered daily, staff showing up, equipment maintained, and cleanliness upheld. If the owner stops investing energy (cutting costs, reducing staff), entropy takes over — food quality drops, service deteriorates, and the restaurant eventually fails."
  },
  "Inertia": {
    coreConcept: "Inertia is the tendency of objects (and systems, organizations, and people) to resist changes in their state of motion. Once something is moving in a certain direction, it tends to keep moving that way. Changing direction requires significant force. In organizations, inertia manifests as resistance to change.",
    whenToUse: "Use this model when trying to change habits, shift company culture, or pivot strategy. Understand that overcoming inertia requires sustained force, not just a one-time push.",
    example: "Kodak invented the digital camera in 1975 but failed to pivot to digital because of organizational inertia. The company was optimized for film, and the internal culture, incentives, and processes all resisted the shift. By the time they acted, it was too late."
  },
  "Friction and Viscosity": {
    coreConcept: "Friction and viscosity represent the resistance that slows down motion in physical and abstract systems. In business, friction is anything that makes it harder for customers to buy, employees to work, or processes to flow. Reducing friction increases speed, conversion, and satisfaction.",
    whenToUse: "Apply this model when designing user experiences, sales processes, or workflows. Identify and remove sources of friction to improve outcomes.",
    example: "Amazon's one-click ordering drastically reduced friction in the buying process. By eliminating the multi-step checkout, they increased impulse purchases and customer satisfaction. Every extra click or form field is friction that reduces conversion."
  },
  "Velocity": {
    coreConcept: "Velocity is the speed of motion in a given direction. In business, velocity refers to how quickly a company can execute, learn, and deliver value. High velocity allows for rapid iteration, faster feedback loops, and competitive advantage. Speed without direction is not velocity.",
    whenToUse: "Use this model when evaluating execution strategies, product development cycles, and competitive positioning. Balancing speed with quality is key — high velocity with low quality is destructive.",
    example: "Toyota's production system emphasized velocity through just-in-time manufacturing. By reducing inventory and cycle times, they could respond to market changes faster than competitors with massive warehouses. High velocity allowed them to outcompete slower rivals."
  },
  "Leverage": {
    coreConcept: "Leverage is using a small amount of force to move a much larger load, based on the physics principle of the lever. In business and life, leverage means finding high-impact actions that produce outsized results — through technology, capital, labor, or expertise — rather than purely through effort.",
    whenToUse: "Apply leverage thinking when allocating resources, choosing strategies, or building systems. Look for ways to multiply your output without linearly increasing input.",
    example: "A software developer writes a script that automates a manual 10-hour weekly task. The one-time effort of writing the script creates ongoing leverage — saving 520 hours per year with no additional effort. The script is a lever that multiplies their productive output."
  },
  "Activation Energy": {
    coreConcept: "Activation energy is the minimum amount of energy required to start a chemical reaction. In life and business, it represents the initial push needed to overcome inertia and start a new habit, project, or change. The hardest part is often starting; once momentum builds, less energy is required to keep going.",
    whenToUse: "Use this model when struggling to start a new habit, project, or initiative. Lower the activation energy by breaking the task into smaller, easier first steps.",
    example: "Wanting to exercise regularly, a person sets a goal of working out for 60 minutes daily but keeps failing. By lowering the activation energy to 'put on workout clothes and do 5 pushups,' they successfully start. Once started, the momentum carries them to a full workout."
  },
  "Catalysts": {
    coreConcept: "A catalyst is a substance that increases the rate of a chemical reaction without being consumed in the process. In business and life, catalysts are events, people, or changes that accelerate progress toward a goal without requiring proportional increases in effort or resources.",
    whenToUse: "Look for catalysts when you need to accelerate results without increasing resources. Catalysts can be partnerships, new technologies, regulatory changes, or key hires that multiply the effect of your existing efforts.",
    example: "A small software startup struggles to gain users until they integrate with a major platform like Slack. The integration acts as a catalyst — suddenly exposed to millions of potential users, growth accelerates dramatically without the startup spending more on marketing."
  },
  "Alloying": {
    coreConcept: "Alloying is the process of combining two or more elements to create a material with superior properties. Steel (iron + carbon) is stronger than pure iron. In thinking and business, combining different mental models, skills, or disciplines creates more robust and innovative solutions than any single approach.",
    whenToUse: "Apply alloying when solving complex problems or building teams. Combine complementary skills, perspectives, or models rather than relying on a single approach.",
    example: "Steve Jobs alloyed calligraphy (design) with computer science to create the Macintosh's beautiful typography. Neither skill alone would have produced this result — the alloy of aesthetics and technology created Apple's distinctive competitive advantage."
  },
  "Natural Selection and Extinction": {
    coreConcept: "Natural selection is the process where organisms better adapted to their environment tend to survive and reproduce. In business and markets, products, companies, and ideas compete for survival. Those best adapted to changing conditions thrive, while the poorly adapted go extinct.",
    whenToUse: "Use this model to understand competitive dynamics, market evolution, and organizational survival. Adapt or die is the rule — continuous evolution is necessary for long-term survival.",
    example: "Blockbuster Video was well-adapted to the VHS/DVD rental environment but failed to evolve when streaming emerged. Netflix, better adapted to the new digital environment, thrived. Blockbuster went extinct not because they were poorly run, but because they failed to adapt to environmental change."
  },
  "The Red Queen Effect": {
    coreConcept: "The Red Queen Effect, from Lewis Carroll's Through the Looking-Glass, describes a situation where you must run as fast as you can just to stay in the same place. In competitive environments, improvements by competitors force you to improve just to maintain your relative position.",
    whenToUse: "Apply this model in competitive industries, arms races, and evolutionary biology. Understand that standing still is equivalent to falling behind when others are improving.",
    example: "Smartphone manufacturers must release improved models annually just to maintain market share. Even if a company makes a great phone, if they don't keep up with competitors' innovations in camera, battery, and features, they lose market position. Running fast just to stay in place."
  },
  "Ecosystems": {
    coreConcept: "An ecosystem is a community of interacting organisms and their environment. In business, ecosystems are networks of companies, products, and services that create mutually reinforcing value. A strong ecosystem creates a network effect where the whole is more valuable than the sum of its parts.",
    whenToUse: "Use ecosystem thinking when building platforms, partnerships, or long-term strategy. Consider how your product fits into a broader network of value creation.",
    example: "Apple's ecosystem — iPhone, Mac, iPad, Apple Watch, App Store, iCloud — creates a network where each product makes the others more valuable. Once you own three Apple devices, the cost of leaving the ecosystem becomes very high, creating strong customer retention."
  },
  "Niches": {
    coreConcept: "A niche is a specialized segment of the market or environment that is uniquely suited to a specific organism or business. By occupying a niche, you avoid direct competition with larger, more powerful players and can dominate a smaller, specialized space.",
    whenToUse: "Apply niche thinking when entering competitive markets, choosing a career path, or positioning a product. Finding an underserved niche is often better than competing head-on in a crowded market.",
    example: "Instead of competing with Starbucks as a general coffee shop, a small business opens as a specialized pour-over and coffee-bean-roasting shop. By occupying the 'premium manual brew' niche, they attract a dedicated customer base and avoid direct competition with the giant."
  },
  "Self-Preservation": {
    coreConcept: "Self-preservation is the instinct of organisms to protect themselves from harm and ensure their own survival. In business, organizations and individuals act to preserve their power, status, and existence — often at the expense of the greater good or rational decision-making.",
    whenToUse: "Use this model to understand organizational politics, resistance to change, and irrational behavior. When people or departments act against the company's best interest, self-preservation is often the hidden driver.",
    example: "A department head resists a company-wide digital transformation that would make the company more efficient but would reduce their department's headcount and their personal influence. Self-preservation drives them to sabotage the change, even though it hurts the company."
  },
  "Replication": {
    coreConcept: "Replication is the process of making copies of a successful model, system, or organism. In business, replication allows successful concepts to be scaled rapidly — a single successful store, process, or product can be replicated to achieve massive scale with predictable results.",
    whenToUse: "Use replication thinking when scaling businesses, franchises, or processes. Ensure the model is proven before replicating, and maintain quality control across all copies.",
    example: "McDonald's success is built on replication. Once they perfected a system for making consistent burgers quickly, they replicated that system to thousands of locations worldwide. Each franchise follows the exact same processes, ensuring predictable quality and massive scale."
  },
  "Feedback Loops": {
    coreConcept: "A feedback loop occurs when the output of a system is fed back as input, creating a cycle of cause and effect. Positive feedback loops amplify changes (rich get richer), while negative feedback loops stabilize systems (thermostat maintains temperature). Understanding feedback loops helps predict system behavior over time.",
    whenToUse: "Apply feedback loop analysis when studying growth, market dynamics, habit formation, or system stability. Identify whether a loop is positive (compounding) or negative (balancing).",
    example: "A social media platform's user growth creates a positive feedback loop: more users attract more content creators, which attracts more users, which attracts more advertisers, which improves the platform, attracting even more users. The loop compounds until it reaches market saturation."
  },
  "Bottlenecks": {
    coreConcept: "A bottleneck is a point of congestion in a system that limits overall throughput. No matter how much capacity you add elsewhere, the system's output is limited by the bottleneck. Identifying and removing bottlenecks is the fastest way to improve system performance.",
    whenToUse: "Use this model in process optimization, supply chain management, software performance, and team productivity. Always ask: 'What is the constraint limiting our output?'",
    example: "A manufacturing line produces 100 units/hour at each of 5 stations, but the packaging station can only handle 60 units/hour. The overall output is 60 units/hour — the packaging station is the bottleneck. Adding capacity to the other 4 stations won't help until the packaging bottleneck is addressed."
  },
  "Margin of Safety": {
    coreConcept: "Margin of safety is the principle of building a buffer between the expected outcome and the worst-case scenario. In investing, it means buying at a price significantly below intrinsic value. In engineering, it means designing structures to withstand loads far beyond the expected maximum. The buffer protects against errors and unforeseen events.",
    whenToUse: "Apply margin of safety in investing, project planning, financial management, and risk assessment. Never plan with zero buffer — the unexpected always happens.",
    example: "An investor calculates a company's intrinsic value at $100/share and only buys when the market price falls to $60 or below. The $40 difference is the margin of safety. If the valuation was slightly off or the business hits a rough patch, the investor is still protected from loss."
  },
  "Churn": {
    coreConcept: "Churn is the rate at which customers, employees, or users leave a system. High churn is expensive because you must constantly replace what you lose, often at a higher cost than retention. Understanding and reducing churn is critical for sustainable growth in any subscription or recurring business.",
    whenToUse: "Use this model when analyzing subscription businesses, employee retention, or customer loyalty. Reducing churn by even a few percentage points can dramatically increase lifetime value and profitability.",
    example: "A SaaS company grows by 100 new customers each month but loses 90 customers each month to churn. Despite strong new customer acquisition, net growth is only 10/month. By focusing on reducing churn from 15% to 5%, they could double their net growth without increasing sales spend."
  },
  "Algorithms": {
    coreConcept: "An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. In decision-making, algorithms (whether human-designed or AI) can often outperform intuition and heuristics, especially in well-defined domains with historical data. Algorithms are consistent, scalable, and free from emotional bias.",
    whenToUse: "Use algorithmic thinking for repetitive decisions, data-rich problems, and processes that benefit from consistency. When a problem can be defined as a series of steps, consider whether an algorithm could do it better than human judgment.",
    example: "Hospitals use algorithmic triage protocols to decide which patients to treat first. Rather than relying on doctors' intuition (which can be biased or inconsistent), the algorithm uses objective criteria like vital signs and symptom severity to consistently prioritize the most critical cases."
  },
  "Critical Mass": {
    coreConcept: "Critical mass is the minimum amount of something needed to trigger a self-sustaining process or chain reaction. In business, it often refers to the minimum user base, revenue, or market share needed for a product or company to become self-sustaining and grow without additional external input.",
    whenToUse: "Apply this model when planning growth strategies, platform launches, or network-effect businesses. Identify what critical mass looks like for your specific situation and focus resources on reaching it.",
    example: "A new social network needs a critical mass of users before it becomes valuable. With only 100 users, the network has little value. Once it reaches critical mass (say, 10 million users), the network effect kicks in — the platform becomes indispensable, and growth becomes self-sustaining without expensive marketing."
  },
  "Emergence": {
    coreConcept: "Emergence is the phenomenon where complex systems and patterns arise from simple interactions between individual components, without a central authority or top-down control. The whole exhibits properties that the individual parts do not possess. Ant colonies, consciousness, and market economies are emergent phenomena.",
    whenToUse: "Use emergence thinking when designing decentralized systems, understanding market dynamics, or managing teams. Sometimes the best approach is to set simple rules and let complexity emerge, rather than trying to control everything top-down.",
    example: "Traffic flow emerges from individual drivers following simple rules (stay in lane, don't crash, obey signals). No central controller directs each car, yet complex patterns like rush hour congestion and traffic waves emerge from these simple individual behaviors."
  },
  "Irreducibility": {
    coreConcept: "Irreducibility means that certain systems or phenomena cannot be fully understood by breaking them down into their component parts. The whole exhibits properties that disappear when you decompose it. Some things are fundamentally greater than the sum of their parts and must be understood holistically.",
    whenToUse: "Apply this model when dealing with complex adaptive systems, human behavior, organizational culture, or consciousness. Reductionist analysis will miss critical insights — you must study the system as a whole.",
    example: "You can study every neuron in the human brain individually, but you will never find 'consciousness' in a single neuron. Consciousness is an irreducible property of the brain as a whole. Similarly, analyzing individual employees won't tell you about a company's culture — culture is an emergent, irreducible property of the organization."
  },
  "The Law of Diminishing Returns": {
    coreConcept: "The law of diminishing returns states that as you add more of one factor of production (while holding others constant), the incremental gain from each additional unit eventually decreases. After a certain point, adding more resources yields progressively smaller benefits, and may even become negative.",
    whenToUse: "Use this model when allocating resources, scaling operations, or optimizing any process. Recognize when you've passed the optimal point and adding more creates waste rather than value.",
    example: "A coffee shop has one barista and serves 30 customers/hour. Adding a second barista doubles capacity to 60/hour — high returns. Adding a tenth barista in the same small shop creates crowding, confusion, and slower service — diminishing and then negative returns. The optimal number might be 3-4 baristas."
  },
  "Pareto Principle (": {
    coreConcept: "The Pareto Principle (80/20 rule) states that roughly 80% of effects come from 20% of causes. In business, 80% of revenue often comes from 20% of customers; 80% of bugs come from 20% of the code. Identifying and focusing on the vital few rather than the trivial many is the key to leverage.",
    whenToUse: "Apply the Pareto Principle when prioritizing work, allocating resources, or analyzing problems. Find the 20% of inputs that produce 80% of outputs, and focus your energy there.",
    example: "A software company analyzes customer support tickets and finds that 80% of complaints come from 3 features (out of 50 total). By fixing just those 3 features, they eliminate 80% of support costs and dramatically improve customer satisfaction — a highly leveraged use of engineering time."
  },
  "Tragedy of the Commons": {
    coreConcept: "The Tragedy of the Commons describes a situation where individuals, acting independently according to their self-interest, deplete or spoil a shared resource even though it is in no one's long-term interest for this to happen. Without regulation or privatization, commons tend to be overused and destroyed.",
    whenToUse: "Use this model when managing shared resources, understanding environmental issues, or designing incentive structures. When a resource is shared and unregulated, assume it will be overused unless you design protections.",
    example: "A fishing ground is open to all fishermen. Each fisherman maximizes their catch to earn more money. But as all fishermen do this, the fish population collapses, and everyone loses their livelihood. The shared resource (fish) was depleted because no one had an incentive to conserve it individually."
  },
  "Gresham's Law": {
    coreConcept: "Gresham's Law states that 'bad money drives out good' — when two currencies are in circulation at a fixed exchange rate, people hoard the undervalued (good) money and spend the overvalued (bad) money. In broader terms, when good and bad options coexist, the bad tends to drive out the good because people manipulate the system to their advantage.",
    whenToUse: "Apply this model when designing incentive systems, understanding market dynamics, or analyzing organizational behavior. If bad behavior is rewarded or good behavior is penalized, the good will be driven out over time.",
    example: "In a company where promotions are based on visibility rather than performance, high-performing 'good' employees who quietly do great work are passed over for 'bad' employees who are skilled at self-promotion. Over time, the high performers leave, and the company is left with people who are good at looking good but not at doing good work."
  },
  "Permutations and Combinations": {
    coreConcept: "Permutations and combinations are mathematical ways of counting possible arrangements and selections. Permutations count ordered arrangements (where sequence matters), while combinations count unordered selections. Understanding these principles helps you accurately assess the number of possible outcomes in complex situations.",
    whenToUse: "Use this model in probability assessment, risk analysis, game theory, and any situation where you need to understand the full range of possible outcomes. It prevents underestimating complexity.",
    example: "A password with 4 digits has 10,000 possible combinations (0000-9999). But a password with 8 characters (letters, numbers, symbols) has over 218 trillion combinations. Understanding permutations and combinations helps you realize why short passwords are insecure and why adding just a few characters dramatically increases security."
  },
  "Compounding": {
    coreConcept: "Compounding is the process where an asset's earnings, from either capital gains or interest, are reinvested to generate additional earnings over time. In finance, compounding turns modest returns into substantial wealth. In life, small daily improvements compound into remarkable long-term results. Time is the most critical factor.",
    whenToUse: "Apply compounding thinking to investing, learning, habit formation, and relationship building. Start early, be consistent, and let time do the heavy lifting. Avoid interrupting the compounding process.",
    example: "Investing $10,000 at 10% annual return: after 10 years it grows to $25,937; after 30 years it reaches $174,494. The last 10 years add more value than the first 20 combined. This is why starting to invest at 25 vs. 35 can mean hundreds of thousands of dollars difference at retirement."
  },
  "Averages (Mean, Median, Mode)": {
    coreConcept: "Averages summarize data with a single number, but different types reveal different insights. The mean (arithmetic average) can be skewed by outliers. The median (middle value) is robust against outliers. The mode (most frequent value) shows what is most common. Choosing the wrong average can be misleading.",
    whenToUse: "Use this model when analyzing data, making comparisons, or evaluating performance metrics. Always ask which type of average is most appropriate for the specific situation, and be wary of mean averages in skewed distributions.",
    example: "A neighborhood has 10 houses: 9 are worth $300,000 and 1 is worth $5,000,000. The mean house price is $770,000 (misleadingly high), but the median is $300,000 (accurately representing what most houses cost). Reporting the mean makes the neighborhood seem unaffordable when most homes are reasonably priced."
  },
  "Mathematically Inevitable": {
    coreConcept: "Some outcomes are mathematically inevitable given certain conditions — they are not just likely, but certain based on the math. Understanding mathematical inevitability helps you identify situations where the numbers force a specific outcome, regardless of opinions, hopes, or intentions.",
    whenToUse: "Apply this model in investing, risk management, demographics, and any system governed by numbers. When the math points to an inevitable outcome, plan for it rather than hoping it won't happen.",
    example: "Japan's demographic crisis is mathematically inevitable: with a birth rate of 1.3 (below the 2.1 replacement rate) and rising life expectancy, the math guarantees a shrinking and aging population. No amount of policy wishing can change this mathematical reality — the country must plan for fewer workers and more retirees."
  },
  "Probability Distributions": {
    coreConcept: "A probability distribution describes how probabilities are spread across possible outcomes. Different distributions (normal/bell curve, power law, uniform) describe different types of systems. Normal distributions have most outcomes near the average; power-law distributions have a few extreme outliers dominating. Using the wrong distribution model leads to poor predictions.",
    whenToUse: "Use this model when forecasting, risk modeling, or understanding which systems follow which distribution. Many real-world phenomena (wealth, city sizes, book sales) follow power laws, not normal distributions.",
    example: "Book sales follow a power-law distribution, not a normal distribution. Most books sell fewer than 100 copies, but a few bestsellers sell millions. If a publisher plans inventory assuming a normal distribution (expecting most books to sell 'average' amounts), they will massively overstock mid-list books and understock potential bestsellers."
  }
};

async function updatePage(pageId, content) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        'Core Concept': { rich_text: [{ text: { content: content.coreConcept } }] },
        'When to Use': { rich_text: [{ text: { content: content.whenToUse } }] },
        'Example': { rich_text: [{ text: { content: content.example } }] },
      }
    })
  });
  return res.ok;
}

async function main() {
  console.log('=== Writing content for 42 Munger models ===\n');

  // Get all pages from DB
  const dbRes = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page_size: 100 })
  });
  const dbData = await dbRes.json();

  let success = 0, failed = 0, skipped = 0;
  for (const page of (dbData.results || [])) {
    const source = page.properties?.Source?.select?.name;
    const name = (page.properties?.Name?.title || [{}])[0]?.plain_text || '';
    const core = (page.properties?.['Core Concept']?.rich_text || [{}])[0]?.plain_text || '';

    if (source !== 'munger') continue;
    if (core.trim()) { skipped++; continue; }

    const content = contentMap[name];
    if (!content) {
      console.log(`  ⚠️ No content for: ${name}`);
      failed++;
      continue;
    }

    const ok = await updatePage(page.id, content);
    if (ok) {
      console.log(`  ✅ ${name}`);
      success++;
    } else {
      console.log(`  ❌ Failed: ${name}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 300)); // Rate limit
  }

  console.log(`\n=== Done: ✅ ${success} | ❌ ${failed} | ⏭️ ${skipped} ===`);
}

main().catch(e => console.error('Error:', e.message));
