const fetch = require('node-fetch');
const fs = require('fs');

const token = fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env', 'utf-8').match(/NOTION_TOKEN=(.+)/)[1].trim();
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

const models = [
  {
    name: "The Cartesian Theatre",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "philosophy", "dennett", "self"],
    source: "munger",
    coreConcept: "Dennett's term for the intuitive but wrong idea that there is a central place in the brain where 'it all comes together' — a single observer watching a inner screen. This 'theater' is a metaphor for the naive view of consciousness as a private inner movie. The problem: there is no single place where this happens, no fixed point of observation. Consciousness is not a show viewed by an inner self.",
    whenToUse: "Use to diagnose the 'Cartesian theater' fallacy whenever someone says 'and then I became aware of...' or implies a central observer. Question: is there actually a place in the brain where this happens, or is this just intuitive storytelling?",
    example: "When someone says 'I saw the ball and then I decided to swing,' they imply a self that watches and decides. But neuroscience shows no such inner observer exists — decisions are made by the brain before we are conscious of them. The feeling of a central director is an after-the-fact construction."
  },
  {
    name: "Multiple Drafts Model",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "philosophy", "dennett", "cognition"],
    source: "munger",
    coreConcept: "Instead of consciousness being a single stream processed in one place, the brain generates many parallel 'drafts' of content — fragments of perception, thought, memory — at many locations. These drafts compete and cooperate. What we call 'consciousness' is the process of some drafts gaining access to cognitive systems, not a single sequential report. There is no final draft, no authoritative version.",
    whenToUse: "Use when thinking about how the mind works as a parallel, distributed system rather than a sequential computer. Apply when understanding why our memories are reconstructed, not recorded, and why we have persistent illusions of unity and control.",
    example: "When you have a flash of insight, it feels like a single idea emerging. But multiple drafts of that idea were being composed in different brain regions for minutes or hours before one gained access to the language system and got expressed. There is no single 'aha' moment — just a draft that finally got published."
  },
  {
    name: "Intentional Stance",
    category: "General Thinking Tools",
    tags: ["philosophy", "dennett", "prediction", "agency"],
    source: "munger",
    coreConcept: "Daniel Dennett's framework for predicting behavior by treating systems as intentional agents with beliefs and desires. You predict what an entity will do by figuring out what it wants and what it believes. This stance works on thermostats, chess programs, corporations, animals, and humans — not because they all 'really' have minds, but because the intentional stance is the most efficient predictive tool for certain systems.",
    whenToUse: "Use when predicting behavior of complex systems. Ask: what would this system want? What would it believe? Apply to AI systems, organizations, markets, and even simple devices when the physical stance is too detailed and the design stance too abstract.",
    example: "A chess computer doesn't 'want' to win in the emotional sense, but treating it as if it wants to win is the most efficient way to predict its moves. Similarly, treating the market as if it 'wants' to find equilibrium helps predict price movements. The question is not whether the stance is metaphysically true, but whether it works."
  },
  {
    name: "Physical Stance",
    category: "General Thinking Tools",
    tags: ["philosophy", "dennett", "reductionism", "physics"],
    source: "munger",
    coreConcept: "Predicting behavior by calculating from physical laws and the initial conditions of a system. This is the most fundamental stance — everything ultimately follows physics. The problem: it is almost always too detailed and too computationally expensive to be practical for complex systems. You would need to calculate the quantum states of every particle.",
    whenToUse: "Use when you want to understand a system at the most fundamental level. Ask: what are the physical components and laws? But recognize that for most purposes, this stance is impractical — use it to ground understanding but not to make predictions about complex systems.",
    example: "To predict whether a rock will fall, you could use the physical stance (calculate gravitational forces, quantum interactions, etc.) or simply note that rocks fall. For most practical purposes, the design stance (rocks are solid objects that fall) or the intentional stance (gravity wants to pull things down) are more efficient."
  },
  {
    name: "Design Stance",
    category: "General Thinking Tools",
    tags: ["philosophy", "dennett", "engineering", "systems"],
    source: "munger",
    coreConcept: "Predicting behavior by assuming the system was designed for a purpose and will behave as a well-designed artifact. This stance assumes the system will work as designed unless it breaks. It sits between the physical stance (too detailed) and the intentional stance (too loose) in terms of abstraction. It is most useful for understanding machines and biological adaptations.",
    whenToUse: "Use when analyzing artifacts, biological systems, or processes that are the product of design or evolution. Ask: what was this designed to do? How would it work if it were working well? Apply to understanding organs, institutions, and software.",
    example: "To understand the eye, adopt the design stance: it was designed to gather light. This predicts it should have a lens, a retina, an aperture. You don't need to know the physics of every photon — the design stance explains the structure efficiently. But for understanding why the optic nerve has a blind spot, you need to understand the accidental design history."
  },
  {
    name: "Heterophenomenology",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "philosophy", "dennett", "method"],
    source: "munger",
    coreConcept: "Dennett's proposed scientific method for studying consciousness: treat subjective reports of experience (the heterophenomenon) as data — third-person observables — without assuming they reveal the actual structure of consciousness. You take people at their word about what they experience, collect their reports carefully, and then explain those reports using neuroscience. The goal is to make consciousness scientific without committing to any particular theory of what it 'really' is.",
    whenToUse: "Use when studying consciousness or subjective experience in a scientific way. Take people's reports seriously as data but be willing to explain those reports in terms that don't assume the naive account is true. Don't assume the theater is real just because people report being in it.",
    example: "When a patient reports seeing a red afterimage, you take that report seriously as a behavioral datum. But you don't assume there is a little person in the head watching a red screen. You use neuroscience to explain why the report is generated. This avoids both the hard problem mysticism and the naive reductionism."
  },
  {
    name: "Cartesian Materialism",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "philosophy", "dennett", "history"],
    source: "munger",
    coreConcept: "A term Dennett coined for the modern version of Descartes' dualism: the view that there is something magical in the brain — some special stuff or process — that creates consciousness. It is materialism (in the brain) but retains the Cartesian assumption that there is a single place where consciousness 'happens.' It is the dominant but invisible assumption in most consciousness debates.",
    whenToUse: "Use when you encounter claims about consciousness that assume it is a special, privileged process. Ask: where in the brain is this process happening? Is there evidence for a single locus, or is this just an assumption? Most 'hard problem of consciousness' arguments depend on Cartesian Materialism being true.",
    example: "When someone says 'the brain generates consciousness,' they might mean it literally creates something new and mysterious. But this is Cartesian Materialism — it says consciousness is in the brain but still special and irreducible. Dennett argues we should be eliminative materialists: consciousness is what the brain does, and our folk psychological description is largely wrong."
  },
  {
    name: "The Fame in the Brain",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "philosophy", "dennett", "memory"],
    source: "munger",
    coreConcept: "Dennett's term for the process by which certain neural events become globally available to many cognitive systems — recognized, remembered, reported. Consciousness is not a special inner experience but the 'fame' of neural events that achieve wide distribution. The more widely a neural event broadcasts, the more conscious it is. This replaces the theater with a broadcast model.",
    whenToUse: "Use when thinking about what makes some mental states conscious and others not. Ask: is this mental state being widely broadcast in the brain, or is it isolated in a specific module? This explains why you can be conscious of things you're not paying attention to — they are still being fame-broadcast.",
    example: "When you see a familiar face in the crowd, you are conscious of it even if you are paying attention elsewhere. The fame-in-the-brain model explains this: the face recognition neural events are being broadcast widely even before you 'notice' them. Consciousness is a matter of degree of fame, not an all-or-nothing threshold."
  },
  {
    name: "Real Patterns Principle",
    category: "General Thinking Tools",
    tags: ["philosophy", "dennett", "pattern-recognition", "science"],
    source: "munger",
    coreConcept: "A pattern is 'real' if it can be exploited for prediction and explanation — if it reveals something about the underlying causal structure of the world. Real patterns are those that are not just patterns in our minds but patterns that exist independently of an observer. Science discovers real patterns; noise and coincidence are not real patterns. The key test: does exploiting this pattern work?",
    whenToUse: "Use when distinguishing real patterns from noise, coincidence, or projections. Ask: does exploiting this pattern allow better predictions? Is there an underlying causal mechanism, or just correlation? This is the foundation of what makes science work — it finds patterns that actually predict and explain.",
    example: "Astrology finds 'patterns' in birth dates and personalities, but exploiting these patterns doesn't yield better predictions than random chance. The patterns are not real in Dennett's sense. In contrast, natural selection is a real pattern — it predicts and explains biological diversity and allows us to understand the history of life. Real patterns are those that survive scrutiny and yield predictions."
  },
  {
    name: "Competence without Comprehension",
    category: "Human Nature and Judgment",
    tags: ["cognition", "dennett", "ai", "intelligence"],
    source: "munger",
    coreConcept: "The phenomenon of systems that demonstrate sophisticated, goal-directed behavior without having any comprehension of what they are doing. The classic example: a thermostat 'regulates' temperature but has no understanding of what temperature is. Evolution produces complex competencies — spider webs, immune systems, brain circuits — without any comprehension. Intelligence does not require understanding; it requires the right causal structure.",
    whenToUse: "Use when considering whether AI systems 'understand' or when debating what makes intelligence real. Ask: is this system demonstrating competence? Does it need comprehension to do what it does? Many sophisticated behaviors can be produced without any internal model of what they are doing.",
    example: "AlphaGo plays Go at superhuman levels but has no comprehension of what Go 'is' or what it means to win. Its competence is genuine but comprehension is zero. Similarly, the human brain can solve complex problems, recognize faces, and navigate the world without comprehension of what these processes 'mean.' Competence without comprehension is the norm in biology."
  },
  {
    name: "The Tower of Morphen",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "dennett", "evolution", "intelligence"],
    source: "munger",
    coreConcept: "Dennett's metaphor for the layered, evolutionary history of the brain. Each layer of neural complexity was built on top of previous layers, with no overall design. The brain is a patchwork of evolved solutions, not a clean engineered system. This explains why we have seemingly 'advanced' cognitive features built on 'primitive' neural substrates — there is no sharp boundary between reptilian, mammalian, and human brain.",
    whenToUse: "Use when trying to understand why the brain has seemingly contradictory features — sophisticated reasoning and primitive emotional reactions, conscious awareness and unconscious processing. Ask: what evolutionary layer is this feature from? The brain is a historical artifact, not an engineered product.",
    example: "The emotion of fear involves the amygdala — a relatively ancient structure. But the conscious experience of fear involves the prefrontal cortex — a newer structure. Both are involved, and neither alone produces the full phenomenon. The Tower of Morphen explains why you can't simply point to one part of the brain and say 'this is where consciousness lives.'"
  },
  {
    name: "The Bypass Principle",
    category: "General Thinking Tools",
    tags: ["philosophy", "dennett", "engineering", "solutions"],
    source: "munger",
    coreConcept: "When a direct solution to a problem is computationally intractable, evolution and engineering both find a bypass: a different route to the goal that exploits the specific structure of the world. Instead of solving the general problem, the bypass exploits constraints. Many of the brain's 'tricks' are bypasses: fast visual processing, muscle control, and language all use specialized bypasses rather than general-purpose computation.",
    whenToUse: "Use when trying to solve hard problems. If the direct approach is intractable, look for bypasses that exploit the specific structure of the problem. Ask: what constraints in the environment can I exploit? What does the world provide for free? The most effective solutions are usually bypasses, not direct solutions.",
    example: "To determine whether a predator is approaching, an animal doesn't need to compute the full trajectory — it just needs to detect motion in a specific visual field. The visual system uses a bypass: specialized motion detectors that don't reconstruct the full scene but detect exactly what matters. This is far more efficient than general-purpose scene analysis."
  },
  {
    name: "The Library of Mind",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "dennett", "memory", "cognition"],
    source: "munger",
    coreConcept: "Dennett's metaphor for how memory works: not as a filing cabinet with perfect records, but as a dynamic library where documents are constantly rewritten, cross-referenced, and reorganized based on current needs. There is no 'perfect record' of experience stored somewhere. Memory is constructive and reconstructive. The 'library' changes as soon as it is consulted — reading changes the books.",
    whenToUse: "Use when evaluating eyewitness testimony, personal memories, or the reliability of recollection. Ask: was this memory stored accurately or reconstructed? What was the current context that might have shaped the reconstruction? Memory is not a recording; it is a narrative that the brain tells itself.",
    example: "When you recall your tenth birthday party, you are not retrieving a video recording. The memory was constructed when first formed, using current knowledge, and has been reconstructed every time it was recalled. You may remember attending a party that you actually didn't attend — a confabulation that feels like a memory because the brain is a narrative-generating organ, not a recording device."
  },
  {
    name: "The Other Minds Problem",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "philosophy", "dennett", "social", "epistemology"],
    source: "munger",
    coreConcept: "The philosophical problem of how we can know that other beings have inner experiences. You can observe behavior but cannot observe consciousness directly. This is the problem that solipsism (the view that only I exist) is hard to definitively refute. Dennett's solution: we can never know for certain what others experience, but we can adopt the most useful stance toward them based on behavioral evidence and evolutionary theory.",
    whenToUse: "Use when thinking about consciousness in others — humans, animals, AI. The Other Minds Problem says you can never directly observe consciousness, only infer it. Ask: what stance should I take toward this entity? The practical answer is to infer consciousness based on behavioral complexity and structural similarity to known conscious systems.",
    example: "You can never know that your dog has the subjective experience of pain, or that your friend actually sees red the way you do. But you can infer it from behavior and evolutionary history. The practical question is not 'do they really have inner experience' but 'what stance should I take toward them?' For dogs and humans, the intentional stance with rich mental ascriptions works best."
  },
  {
    name: "The Riddle of Consciousness",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "philosophy", "dennett", "mystery"],
    source: "munger",
    coreConcept: "The apparent puzzle that subjective experience (qualia) seems to resist physical explanation. If consciousness is just brain activity, how do subjective experiences 'arise' from physical processes? Dennett's response: this is a pseudo-problem created by bad intuitions about how consciousness works. The 'hard problem' depends on assuming the Cartesian Theater is real. Once you reject that, the 'riddle' dissolves into tractable empirical questions.",
    whenToUse: "Use when encountering claims about consciousness being irreducibly mysterious. Ask: does this depend on the assumption that there is a special inner observer? If so, the mystery may be an artifact of the framing, not a real feature of the world. Not all mysteries are genuine — some are created by conceptual confusion.",
    example: "The 'hard problem of consciousness' — explaining why certain brain processes are accompanied by subjective experience — is hard only if you assume there is a special inner theater where experience 'happens.' If consciousness is distributed, multiple-draft, and fame-based, then the 'problem' is not hard in any empirical sense — it is a puzzle about language and concepts, not about physics."
  },
  {
    name: "Consciousness in AI",
    category: "Human Nature and Judgment",
    tags: ["ai", "dennett", "consciousness", "intelligence", "philosophy"],
    source: "munger",
    coreConcept: "The question of whether artificial systems can be conscious. Dennett is skeptical that we could easily determine if an AI is conscious — the problem is partly empirical (we don't know what neural features produce consciousness) and partly conceptual (we don't know exactly what we mean by consciousness). We might build conscious machines without knowing it, or think we have built them when we haven't.",
    whenToUse: "Use when thinking about AI ethics, rights, and safety. Ask: what would it mean for an AI to be conscious? What evidence would we accept? The consciousness of AI is both an empirical question (will it happen?) and a philosophical one (how would we know?). Treat it as an open empirical question, not a settled conceptual one.",
    example: "When people ask if an AI 'really' understands, they may be assuming a Cartesian Theater in the machine — that there is a special inner observer. If consciousness is fame in the brain (or in a computational system), then the question is whether the system has the right functional architecture. We don't know what that architecture is for biological consciousness, making the question for AI doubly hard."
  },
  {
    name: "The Edge of Organization",
    category: "General Thinking Tools",
    tags: ["philosophy", "dennett", "complexity", "systems"],
    source: "munger",
    coreConcept: "The boundary between what can be explained in terms of component parts and what requires appeal to higher-level patterns. Complex systems often have properties that emerge at certain levels of organization and cannot be predicted from the lower-level description alone. Knowing the physics of water molecules doesn't let you predict waves. The edge of organization is where new, irreducible patterns appear.",
    whenToUse: "Use when encountering claims about emergence, reductionism, or holism. Ask: at what level of organization is this phenomenon? Can it be reduced to lower levels, or does it genuinely require higher-level description? Some properties are genuinely at the edge — irreducible to physics but not mystical.",
    example: "Consciousness might be at the edge of organization: it requires a certain level of complexity in a brain, but cannot be predicted from knowing the chemistry of neurons alone. This doesn't mean it is supernatural — it means it requires a middle-level description, between neurons and the whole brain. The edge is where new patterns live."
  },
  {
    name: "The Cranes and the Bypasses",
    category: "General Thinking Tools",
    tags: ["philosophy", "dennett", "engineering", "evolution", "intelligence"],
    source: "munger",
    coreConcept: "Two types of design solutions: cranes are general-purpose methods that directly solve problems by scaling up; bypasses exploit specific features of the environment. Evolution uses bypasses (not cranes) because it has no foresight. Engineering uses both cranes (like general algorithms) and bypasses (like heuristics). The key insight: most human intelligence relies on bypasses rather than cranes, which explains both its power and its limitations.",
    whenToUse: "Use when designing systems or understanding intelligence. Ask: am I using a crane (general method) or a bypass (environment-specific shortcut)? Bypasses are more efficient but fragile; cranes are robust but expensive. The most effective systems combine both.",
    example: "Human visual recognition uses a vast number of bypasses — specialized neural circuits that exploit specific regularities in the visual world (edges, motion, faces). This is why we can recognize faces in milliseconds — the bypasses are extremely fast. A general-purpose computer vision system would need cranes — computationally expensive algorithms — to achieve the same result. Evolution found the bypass."
  },
  {
    name: "The User Illusion",
    category: "Human Nature and Judgment",
    tags: ["consciousness", "dennett", "media", "perception"],
    source: "munger",
    coreConcept: "Our conscious experience is a user interface — a simplified, edited, compiled representation of the vast amounts of neural processing happening in the brain. Like a desktop interface hides the machine code from the computer user, consciousness hides the messy neural machinery from the 'user' of the brain. The user illusion is that consciousness is what matters; the underlying processing is hidden.",
    whenToUse: "Use when thinking about how much of the brain's work is unconscious. Ask: what is this conscious experience hiding? Most of the cognitive heavy lifting happens below the level of awareness. The consciousness we experience is a summary, not the full computation.",
    example: "When you 'see' a stable, detailed visual world, you are experiencing a user illusion. Most of what your eyes see is low-resolution blur; your brain fills in details from memory, expectation, and inference. The 'rich' conscious visual experience is a compilation of many separate processes. What you 'see' is not what is in front of your eyes — it is a constructed story."
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
        'Model ID': { rich_text: [{ text: { content: 'CE-' + (models.indexOf(model) + 1).toString().padStart(3, '0') } }] }
      }
    })
  });
  return { name: model.name, ok: res.ok, status: res.status };
}

async function main() {
  console.log(`Importing ${models.length} models from Consciousness Explained...`);
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
