import { useEffect, useMemo, useState } from "react";
import articles from "./data/articles";
import aiTools from "./data/aiTools";
import ArticlePage from "./components/ArticlePage";
import ToolCard from "./components/ToolCard";
import "./App.css";
import "./premium-article.css";
import "./premium-header.css";
import "./performance.css";

/* =========================================================
   SEO HELPERS
   ========================================================= */

const SITE_NAME = "AI TechSphere";
const SITE_DESCRIPTION =
  "AI news, AI tools, model updates, practical guides, comparisons, prompts and technology explainers for the fast-moving world of artificial intelligence.";

const createArticleSlug = (article) =>
  article?.slug ||
  article?.title
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") ||
  "article";

const upsertMeta = (name, content, attribute = "name") => {
  if (!content) return;

  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);
};

const upsertStructuredData = (data) => {
  let tag = document.head.querySelector("script[data-ai-techsphere-schema]");

  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.dataset.aiTechsphereSchema = "true";
    document.head.appendChild(tag);
  }

  tag.textContent = JSON.stringify(data);
};


const toolCategories = [
  "All",
  "AI Chat",
  "AI Images",
  "AI Video",
  "AI Writing",
  "AI Audio",
  "Productivity",
];


/* =========================================================
   AI NEWS + EDITORIAL CONTENT
   Snapshot verified for September 22, 2026.
   News summaries are original editorial summaries with
   links to the underlying source.
   ========================================================= */

const AI_NEWS_UPDATED = "September 22, 2026";

const aiNews = [
  {
    id: "alibaba-model-chip",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    category: "AI Infrastructure",
    date: "Sep 22, 2026",
    source: "Reuters",
    sourceUrl:
      "https://www.reuters.com/business/retail-consumer/alibaba-plans-ai-model-with-5-trillion-10-trillion-parameters-unveils-new-chip-2026-09-22/",
    title: "Alibaba outlines a much larger AI model and new AI chip",
    summary:
      "Reuters reports that Alibaba outlined plans for a next-generation model in the 5-to-10-trillion-parameter range and introduced its Zhenwu V900 AI chip, with mass production expected in 2027.",
    why:
      "The story shows how competition is expanding beyond model software into chips, computing capacity and the infrastructure required to operate large AI systems.",
    tags: ["Alibaba", "AI chips", "models", "infrastructure"],
  },
  {
    id: "deepseek-un-security",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    category: "AI & Society",
    date: "Sep 22, 2026",
    source: "Reuters",
    sourceUrl:
      "https://www.reuters.com/world/asia-pacific/deepseek-brief-un-security-council-ai-this-week-sources-say-2026-09-22/",
    title: "DeepSeek is set to brief the UN Security Council on AI risks",
    summary:
      "Reuters reports that DeepSeek is expected to contribute to a UN Security Council discussion on artificial intelligence and security this week, alongside representatives from other AI organizations.",
    why:
      "AI discussions are increasingly moving beyond product launches into international security, governance and questions about how increasingly capable systems should be managed.",
    tags: ["DeepSeek", "AI safety", "UN", "security"],
  },
  {
    id: "uk-ai-security-hearing",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85",
    category: "AI Safety",
    date: "Sep 22, 2026",
    source: "UK Parliament",
    sourceUrl:
      "https://committees.parliament.uk/committee/365/business-innovation-science-and-trade-committee/news/217956/meta-google-openai-and-anthropic-invited-to-appear-before-business-committee-amid-growing-ai-safety-concerns/",
    title: "UK Parliament invites major AI companies to an AI security evidence session",
    summary:
      "The UK's Business, Innovation and Trade Committee announced invitations to Meta, Google, OpenAI and Anthropic for an evidence session on AI security scheduled for October 13, 2026.",
    why:
      "It is another example of AI safety moving into formal scrutiny, where companies may be asked to explain how they approach security, risk and increasingly capable systems.",
    tags: ["AI safety", "security", "UK", "policy"],
  },
  {
    id: "openai-news-sept",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    category: "OpenAI",
    date: "Sep 16, 2026",
    source: "OpenAI",
    sourceUrl: "https://openai.com/news/",
    title: "OpenAI's September roadmap is broadening beyond the chatbot interface",
    summary:
      "OpenAI's newsroom lists September work spanning advertising, business value, model-misalignment reporting, large-scale storage, financial services, voice experiences and an Agents API.",
    why:
      "The range of releases shows how frontier AI companies are expanding into infrastructure, enterprise workflows, developer platforms and new product surfaces rather than treating chat as the entire product.",
    tags: ["OpenAI", "agents", "enterprise", "APIs"],
  },
  {
    id: "openai-agents-api",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    category: "AI Agents",
    date: "Sep 10, 2026",
    source: "OpenAI",
    sourceUrl: "https://openai.com/news/",
    title: "OpenAI adds an Agents API to its developer platform",
    summary:
      "OpenAI's September product announcements include an Agents API alongside new developer capabilities for data access and voice experiences.",
    why:
      "Agent development is becoming a distinct application pattern: developers can combine models with tools, context and application logic to perform multi-step work.",
    tags: ["agents", "API", "developers", "automation"],
  },
  {
    id: "meta-muse",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=85",
    category: "AI Agents",
    date: "Sep 8, 2026",
    source: "Meta",
    sourceUrl:
      "https://about.fb.com/news/2026/09/introducing-muse-the-worlds-first-personal-ai-agent-built-for-everyone/",
    title: "Meta introduces Muse as a personal AI agent",
    summary:
      "Meta announced Muse on September 8 as a personal AI agent designed to carry out tasks across connected applications, with the company describing a dedicated virtual-machine approach for its agent environment.",
    why:
      "Muse is an example of the shift from assistants that answer questions toward systems designed to take actions on a user's behalf.",
    tags: ["Meta", "Muse", "personal AI", "agents"],
  },
  {
    id: "meta-one",
    image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=85",
    category: "AI Products",
    date: "Sep 15, 2026",
    source: "Meta",
    sourceUrl:
      "https://about.fb.com/news/2026/09/introducing-meta-one-subscription-service-more-features-ai/",
    title: "Meta launches Meta One with additional AI and creator features",
    summary:
      "Meta says its new Meta One subscription offers higher AI usage, additional expression features and professional tools for creators and businesses while keeping the core Meta AI experience free.",
    why:
      "AI monetization is increasingly moving toward bundled subscriptions that combine model usage with productivity, creator and communication features.",
    tags: ["Meta", "subscriptions", "creators", "AI"],
  },
  {
    id: "anthropic-metrics",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    category: "AI Safety",
    date: "Sep 17, 2026",
    source: "Anthropic",
    sourceUrl:
      "https://www.anthropic.com/news",
    title: "Anthropic proposes metrics for tracking frontier AI development",
    summary:
      "Anthropic published a proposal for metrics intended to improve public visibility into the pace and direction of frontier AI development inside leading laboratories.",
    why:
      "As model capabilities advance quickly, measuring progress consistently can help researchers, companies and the public discuss changes using more concrete evidence.",
    tags: ["Anthropic", "evaluations", "frontier AI", "safety"],
  },
  {
    id: "anthropic-misuse",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85",
    category: "AI Security",
    date: "Sep 10, 2026",
    source: "Anthropic",
    sourceUrl:
      "https://www.anthropic.com/news",
    title: "Anthropic reports on attempts to misuse Claude",
    summary:
      "Anthropic's September threat-intelligence update describes operations in which threat actors attempted to use Claude for malicious activity and outlines examples of how those attempts evolved.",
    why:
      "The report highlights a dual-use reality: the same capabilities that help legitimate users automate technical work can also be targeted for abuse, making monitoring and safeguards important.",
    tags: ["Claude", "security", "misuse", "threat intelligence"],
  },
  {
    id: "australia-ai-training",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=85",
    category: "AI & Society",
    date: "Sep 22, 2026",
    source: "Reuters",
    sourceUrl:
      "https://www.reuters.com/legal/litigation/anthropic-openai-call-australia-relax-ban-training-ai-models-2026-09-22/",
    title: "OpenAI and Anthropic argue for a conditional AI-training framework in Australia",
    summary:
      "Reuters reports that OpenAI and Anthropic have asked Australian lawmakers to reconsider restrictions affecting the use of copyrighted Australian creative content for AI training, while proposing a framework intended to balance creator protections and AI development.",
    why:
      "Training-data rules are becoming a central part of the AI industry, with governments weighing creator rights, innovation and access to large-scale datasets.",
    tags: ["AI training", "copyright", "Australia", "policy"],
  },
  {
    id: "crusoe-infrastructure",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    category: "AI Infrastructure",
    date: "Sep 17, 2026",
    source: "Reuters",
    sourceUrl:
      "https://www.reuters.com/business/ai-infrastructure-provider-crusoe-valued-309-billion-latest-funding-round-2026-09-17/",
    title: "AI infrastructure funding highlights demand for specialized compute",
    summary:
      "Reuters reported that AI infrastructure provider Crusoe raised $3.9 billion at a $30.9 billion post-money valuation, reflecting continued demand for computing capacity for AI workloads.",
    why:
      "AI growth increasingly depends on specialized data-center capacity and access to large amounts of compute, not only improvements in model architecture.",
    tags: ["Crusoe", "data centers", "compute", "AI infrastructure"],
  },
];

const aiExplainers = [
  {
    icon: "ðŸ¤–",
    title: "AI Agents",
    text:
      "Agents combine a model with tools, memory, instructions and permission boundaries so they can complete multi-step tasks. The useful question is not whether an agent sounds intelligent, but whether it can reliably complete a defined workflow.",
  },
  {
    icon: "ðŸ§ ",
    title: "Reasoning Models",
    text:
      "Reasoning-focused systems spend more effort on complex problems such as planning, coding, mathematics and multi-stage analysis. More reasoning can improve difficult tasks, but it can also increase latency and cost.",
  },
  {
    icon: "ðŸ‘ï¸",
    title: "Multimodal AI",
    text:
      "Multimodal systems work across combinations of text, images, audio, video and other inputs. This enables workflows such as asking questions about screenshots, analyzing documents or creating media from mixed references.",
  },
  {
    icon: "ðŸ”Ž",
    title: "AI Search & Research",
    text:
      "AI search systems can summarize information and help discover sources quickly. For important claims, the safest workflow remains source discovery followed by opening and checking the original material.",
  },
  {
    icon: "ðŸ—‚ï¸",
    title: "RAG & Knowledge Bases",
    text:
      "Retrieval-augmented generation connects an AI model to a selected collection of information. It is useful when the answer needs to be grounded in company documents, product manuals, research papers or other controlled sources.",
  },
  {
    icon: "ðŸ’»",
    title: "AI Coding",
    text:
      "Coding assistants can explain errors, generate boilerplate, refactor code and help explore unfamiliar libraries. Generated code should still be reviewed, tested and checked against the exact versions used by a project.",
  },
  {
    icon: "ðŸŽ¨",
    title: "AI Image Creation",
    text:
      "Modern image workflows combine prompting, references, editing and design rather than relying on one generation. The final quality often depends on composition, iteration and post-generation typography.",
  },
  {
    icon: "ðŸŽ¬",
    title: "AI Video",
    text:
      "Text-to-video and image-to-video tools are useful for concept shots, social clips and creative experiments. Short controlled generations are often easier to edit into a finished sequence than one huge prompt.",
  },
  {
    icon: "ðŸŽ™ï¸",
    title: "AI Voice & Music",
    text:
      "Voice and music models can accelerate narration, prototypes and creative production. Commercial projects should check current licensing, voice rights and platform-specific usage rules before publication.",
  },
  {
    icon: "ðŸ–¥ï¸",
    title: "Local AI",
    text:
      "Local models run on a user's own computer or private infrastructure. They can offer more control over data and offline use, while requiring compatible hardware and sometimes sacrificing model capability or convenience.",
  },
  {
    icon: "ðŸ”",
    title: "AI Security",
    text:
      "AI security includes prompt injection, data leakage, unsafe tool use, model misuse and excessive agent permissions. Treat connected tools as part of the security boundary rather than assuming the model itself is the only risk.",
  },
  {
    icon: "âš™ï¸",
    title: "AI Automation",
    text:
      "Automation connects AI to repeatable business or creator workflows. A good automation has a clear trigger, bounded permissions, a useful output and a human checkpoint when an action can create real consequences.",
  },
];

const aiUseCases = [
  {
    icon: "ðŸŽ“",
    title: "Students",
    text:
      "Use AI to explain difficult concepts, generate practice questions, organize revision and provide feedback on your own drafts. Keep the learning process active instead of outsourcing every assignment.",
    workflow: "Explain â†’ practice â†’ review â†’ revise",
  },
  {
    icon: "ðŸŽ¥",
    title: "YouTubers & Creators",
    text:
      "Use AI for topic research, outlines, scripts, thumbnail concepts, images, video ideas, captions and voice workflows. Human storytelling and final editing remain important.",
    workflow: "Research â†’ script â†’ visual â†’ edit â†’ publish",
  },
  {
    icon: "ðŸ‘¨â€ðŸ’»",
    title: "Developers",
    text:
      "AI can accelerate debugging, documentation, tests, refactoring and repetitive code. Give it exact context and verify generated changes locally before committing.",
    workflow: "Context â†’ generate â†’ test â†’ review",
  },
  {
    icon: "ðŸª",
    title: "Small Businesses",
    text:
      "AI can help with customer-response drafts, product descriptions, market research, internal documentation and simple workflow automation.",
    workflow: "Collect â†’ draft â†’ review â†’ automate",
  },
  {
    icon: "ðŸ“£",
    title: "Marketers",
    text:
      "Use AI for campaign ideas, content variations, research, audience questions and creative testing while keeping brand claims and factual statements under human review.",
    workflow: "Brief â†’ variations â†’ verify â†’ test",
  },
  {
    icon: "ðŸ’¼",
    title: "Job Seekers",
    text:
      "AI can help tailor resumes, practice interviews, organize job research and improve professional writing. Do not let generated material misrepresent your experience.",
    workflow: "Target â†’ draft â†’ personalize â†’ practice",
  },
];

const promptTemplates = [
  {
    title: "Research prompt",
    text:
      "Act as a research assistant. Break this topic into the 5 most important questions, identify what evidence would answer each question, and separate established facts from claims that need verification: [TOPIC].",
  },
  {
    title: "YouTube script prompt",
    text:
      "Create a practical YouTube outline for [TOPIC]. Audience: [AUDIENCE]. Goal: teach one useful outcome. Include a strong opening, 5 clear sections, examples, mistakes to avoid and a concise conclusion. Do not invent facts.",
  },
  {
    title: "Coding debugger",
    text:
      "Help debug this issue. First explain the likely cause, then identify the smallest safe fix, then provide the corrected code. Do not assume package versions I have not provided. Error: [ERROR]. Code: [CODE].",
  },
  {
    title: "AI image prompt",
    text:
      "Create a detailed image prompt for [PURPOSE]. Subject: [SUBJECT]. Environment: [LOCATION]. Composition: [SHOT]. Lighting: [LIGHT]. Mood: [MOOD]. Style: [STYLE]. Leave [AREA] clear for text.",
  },
  {
    title: "Business workflow",
    text:
      "Design a simple AI workflow for [TASK]. List the trigger, inputs, AI step, human review step, final output, failure cases and privacy risks. Prefer the fewest tools necessary.",
  },
  {
    title: "Compare AI tools",
    text:
      "Compare [TOOL A] and [TOOL B] for [USE CASE]. Use the same criteria for both: core capability, ease of use, output quality, editing effort, integrations, pricing model, limitations and who should test each one.",
  },
];

const aiTrendCards = [
  {
    label: "TREND 01",
    title: "From chatbots to agents",
    text:
      "The industry is moving toward systems that can plan, call tools, browse, manipulate files and complete multi-step work. Reliability and permission design become just as important as model intelligence.",
  },
  {
    label: "TREND 02",
    title: "AI is moving into existing apps",
    text:
      "AI features are increasingly appearing inside documents, browsers, creative software, messaging apps and business systems. The winning workflow may be the one that removes context switching.",
  },
  {
    label: "TREND 03",
    title: "Models are becoming multimodal",
    text:
      "Text is no longer the only interface. Images, audio, video, screenshots, documents and live camera inputs are becoming normal parts of AI workflows.",
  },
  {
    label: "TREND 04",
    title: "Infrastructure is strategic",
    text:
      "AI growth depends on accelerators, memory, networking, data centers, cooling and power. Model progress and infrastructure progress increasingly move together.",
  },
  {
    label: "TREND 05",
    title: "Evaluation matters more",
    text:
      "As systems become capable of taking actions, measuring reliability, safety and real-world task performance matters more than a single benchmark score.",
  },
  {
    label: "TREND 06",
    title: "AI literacy is becoming a skill",
    text:
      "Knowing how to verify AI output, protect sensitive information, write useful instructions and design repeatable workflows is becoming practical digital literacy.",
  },
];


function PublisherToolsPage({
  tools,
  toolCategories,
  toolCategory,
  setToolCategory,
  toolSearch,
  setToolSearch,
  goHome,
  openArticles,
}) {
  const hasSearch = toolSearch.trim().length > 0;

  const categoryGuides = {
    "AI Chat": "AI chat tools are useful for research, drafting, brainstorming, summarizing and everyday problem solving. Compare how well each tool handles your actual prompts, sources, context length, privacy needs and workflow before paying.",
    "AI Images": "AI image generators differ in prompt control, editing, consistency, typography, commercial-use terms and output limits. Test the type of images you actually create rather than relying only on showcase examples.",
    "AI Video": "AI video tools can help with short-form clips, product visuals, animation and creative experiments. Compare generation quality, consistency, credits, rendering time and licensing before choosing a workflow.",
    "AI Writing": "AI writing assistants can speed up drafting, rewriting, editing and content planning. The useful comparison is not simply which tool writes the mostâ€”it is which one produces a draft that needs the least correction for your specific work.",
    "AI Audio": "AI audio tools cover voice generation, music, sound design and speech workflows. Check voice quality, pronunciation, commercial rights, usage limits and whether your intended use is supported.",
    Productivity: "AI productivity tools can automate repetitive work, organize information and connect services. Before adopting one, check integrations, permissions, reliability, pricing and the amount of manual review still required.",
  };

  const currentGuide = toolCategory === "All"
    ? "Use the directory to compare AI tools by the job they perform. Start with your actual task, test realistic inputs, measure the editing or review you still need to do, and then compare price, privacy and usage limits."
    : categoryGuides[toolCategory] || "Compare tools using realistic tasks, current pricing, privacy requirements and the amount of human review needed to produce a useful result.";

  return (
    <div className="app ai-techsphere-theme tools-page-rich">
      <header className="navbar">
        <div className="nav-container">
          <button className="logo" onClick={goHome} aria-label="Go to AI TechSphere home">
            <span className="logo-icon">AI</span>
            <span>TechSphere</span>
          </button>
          <nav className="nav-links" aria-label="Main navigation">
            <button onClick={goHome}>Home</button>
            <button className="active" aria-current="page">AI Tools</button>
            <button onClick={() => openArticles("All")}>Articles</button>
          </nav>
          <button className="nav-button" onClick={goHome}>Back Home</button>
        </div>
      </header>

      <main>
        <section className="tools-hero">
          <div className="section-container">
            <div className="section-label"><span></span>AI TOOL DIRECTORY</div>
            <h1>Find the right <span className="gradient-text">AI tool</span></h1>
            <p>
              Explore AI tools for chat, images, video, writing, audio and productivity.
              This directory is designed as a practical starting point: understand what a
              category does, compare tools against your real task, and verify current pricing,
              features and terms on the provider's official website.
            </p>

            <div className="tools-search" role="search">
              <span aria-hidden="true">ðŸ”</span>
              <input
                type="search"
                aria-label="Search AI tools"
                placeholder="Search AI tools..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
              />
              {toolSearch && (
                <button
                  type="button"
                  aria-label="Clear tool search"
                  onClick={() => setToolSearch("")}
                  style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: "18px", opacity: 0.65, padding: "4px 8px" }}
                >Ã—</button>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "18px", color: "rgba(255,255,255,0.72)", fontSize: "14px" }}>
              <span>âœ“ Curated categories</span>
              <span>âœ“ Official provider links</span>
              <span>âœ“ Free & paid options</span>
              <span>âœ“ Practical selection guidance</span>
            </div>
          </div>
        </section>

        <section className="tools-list-section">
          <div className="section-container">
            <div className="tool-category-tabs" aria-label="AI tool categories">
              {toolCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={toolCategory === category ? "tool-category active" : "tool-category"}
                  onClick={() => setToolCategory(category)}
                  aria-pressed={toolCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>

            <div style={{ maxWidth: "900px", margin: "0 auto 34px", padding: "24px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.035)" }}>
              <div className="section-label" style={{ marginBottom: "10px" }}><span></span>EDITORIAL GUIDE</div>
              <h2 style={{ marginBottom: "10px" }}>
                {toolCategory === "All" ? "How to evaluate an AI tool" : `Choosing a ${toolCategory} tool`}
              </h2>
              <p style={{ margin: 0, lineHeight: 1.8, opacity: 0.82 }}>{currentGuide}</p>
            </div>

            <div className="tools-result-header">
              <div>
                <div className="section-label" style={{ marginBottom: "8px" }}><span></span>DIRECTORY</div>
                <h2>{toolCategory === "All" ? "All AI Tools" : toolCategory}</h2>
              </div>
              <span>{tools.length} {tools.length === 1 ? "tool" : "tools"}</span>
            </div>

            <div className="tool-directory-grid">
              {tools.map((tool) => {
                const destination = tool.affiliateUrl || tool.url;
                const isAffiliate = Boolean(tool.affiliateUrl);
                return (
                  <article className="directory-card" key={tool.id}>
                    <div className={`directory-icon ${tool.color || ""}`} aria-hidden="true">{tool.icon}</div>
                    <div className="directory-info">
                      <span className="directory-category">{tool.category}</span>
                      <h3>{tool.name}</h3>
                      <p>{tool.description}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginTop: "auto" }}>
                        <span className="pricing">{tool.pricing}</span>
                        {isAffiliate && <span style={{ fontSize: "11px", fontWeight: 600, opacity: 0.55 }}>Affiliate link</span>}
                      </div>
                    </div>
                    <div className="directory-actions">
                      <a
                        className="visit-tool"
                        href={destination}
                        target="_blank"
                        rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                        aria-label={`${isAffiliate ? tool.affiliateLabel || `Try ${tool.name}` : `Visit ${tool.name}`} opens in a new tab`}
                      >
                        {isAffiliate ? tool.affiliateLabel || `Try ${tool.name} â†’` : "Visit Tool"}<span>â†—</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {tools.length === 0 && (
              <div className="no-tools">
                <div>ðŸ”Ž</div>
                <h3>No AI tools found</h3>
                <p>{hasSearch ? `We couldn't find a tool matching â€œ${toolSearch}â€.` : "Try another category."}</p>
                {(hasSearch || toolCategory !== "All") && (
                  <button type="button" className="primary-button" onClick={() => { setToolSearch(""); setToolCategory("All"); }}>
                    Show All Tools
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: "20px 0 84px" }}>
          <div className="section-container">
            <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "18px" }}>
              {[
                ["01", "Start with the task", "Define the exact job before choosing a product. A chatbot, image model, video generator and automation platform solve different problems."],
                ["02", "Test realistic inputs", "Use your own examples when possible. Marketing demos rarely show the full amount of editing, prompting or review a workflow requires."],
                ["03", "Check the real cost", "Look beyond the headline plan. Credits, generation limits, API usage, storage, team seats and your time can all affect the total cost."],
                ["04", "Check privacy and rights", "Review what data is sent, how files are handled, what permissions are requested and whether the provider's terms support your intended use."],
              ].map(([number, title, text]) => (
                <article key={number} style={{ padding: "24px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.025)" }}>
                  <span style={{ fontSize: "12px", letterSpacing: "0.12em", opacity: 0.55 }}>{number}</span>
                  <h3 style={{ margin: "10px 0 8px" }}>{title}</h3>
                  <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.75 }}>{text}</p>
                </article>
              ))}
            </div>

            <div style={{ maxWidth: "900px", margin: "46px auto 0", padding: "30px", borderRadius: "22px", border: "1px solid rgba(124,58,237,0.22)", background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.05))" }}>
              <div className="section-label"><span></span>KEEP LEARNING</div>
              <h2 style={{ marginBottom: "12px" }}>A tool directory is only the starting point.</h2>
              <p style={{ lineHeight: 1.8, opacity: 0.8 }}>
                The best way to understand an AI product is to see it used for a concrete job. AI TechSphere also publishes comparisons, tutorials, prompt examples and practical workflows so you can move from choosing a tool to actually using it.
              </p>
              <button className="primary-button" onClick={() => openArticles("All")}>Read AI & Tech Guides â†’</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-container">
          <div className="footer-bottom">
            <span>Â© 2026 AI TechSphere. All rights reserved.</span>
            <span>Built for the AI generation ðŸš€</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   MAIN APP
   ========================================================= */

/* =========================================================
   MAIN APP
   ========================================================= */

function App() {
  const initialParams = new URLSearchParams(window.location.search);
  const initialArticleSlug = initialParams.get("article");
  const initialLegalPage = initialParams.get("page");
  const initialArticle = articles.find(
    (item) => createArticleSlug(item) === initialArticleSlug
  ) || null;

  const [selectedArticle, setSelectedArticle] = useState(initialArticle);
  const [legalPage, setLegalPage] = useState(initialLegalPage || null);
  const [showTools, setShowTools] = useState(false);

  const [toolCategory, setToolCategory] = useState("All");
  const [toolSearch, setToolSearch] = useState("");

  const [articleCategory, setArticleCategory] = useState("All");
  const [articleSearch, setArticleSearch] = useState("");
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [newsCategory, setNewsCategory] = useState("All");
  const [newsSearch, setNewsSearch] = useState("");
  const [expandedNews, setExpandedNews] = useState(null);


  /* =======================================================
     SEO / META TAGS
     ======================================================= */

  useEffect(() => {
    const article = selectedArticle;
    const slug = article ? createArticleSlug(article) : null;
    const legalTitles = {
      about: `About Us | ${SITE_NAME}`,
      contact: `Contact Us | ${SITE_NAME}`,
      privacy: `Privacy Policy | ${SITE_NAME}`,
      terms: `Terms & Conditions | ${SITE_NAME}`,
      disclaimer: `Disclaimer | ${SITE_NAME}`,
    };
    const legalDescriptions = {
      about: "Learn about AI TechSphere, our mission, and how we help readers discover useful AI and technology resources.",
      contact: "Contact AI TechSphere for questions, feedback, corrections, partnerships, or other inquiries.",
      privacy: "Read the AI TechSphere privacy policy and learn how information is handled when you use our website.",
      terms: "Read the terms and conditions that apply to your use of the AI TechSphere website.",
      disclaimer: "Read the AI TechSphere disclaimer covering information, affiliate links, reviews, and external services.",
    };
    const pageTitle = article
      ? `${article.title} | ${SITE_NAME}`
      : legalPage
      ? legalTitles[legalPage] || SITE_NAME
      : `${SITE_NAME} â€” AI Tools, Guides & Tech Reviews`;
    const description = article?.excerpt || legalDescriptions[legalPage] || SITE_DESCRIPTION;
    const canonicalUrl = article
      ? `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(slug)}`
      : legalPage
      ? `${window.location.origin}${window.location.pathname}?page=${encodeURIComponent(legalPage)}`
      : `${window.location.origin}${window.location.pathname}`;

    document.title = pageTitle;

    upsertMeta("description", description);
    upsertMeta("robots", "index, follow");

    upsertMeta("og:title", pageTitle, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:type", article ? "article" : "website", "property");
    upsertMeta("og:url", canonicalUrl, "property");

    if (article?.image) {
      upsertMeta("og:image", article.image, "property");
      upsertMeta("twitter:image", article.image);
    }

    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", pageTitle);
    upsertMeta("twitter:description", description);

    upsertLink("canonical", canonicalUrl);

    const siteUrl = `${window.location.origin}${window.location.pathname}`;
    const organization = {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: SITE_NAME,
      url: siteUrl,
    };

    const schema = article
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${canonicalUrl}#article`,
              headline: article.title,
              description,
              image: article.image ? [article.image] : undefined,
              datePublished: article.date,
              dateModified: article.date,
              articleSection: article.category,
              inLanguage: "en",
              author: {
                "@type": "Organization",
                name: article.author || SITE_NAME,
                url: siteUrl,
              },
              publisher: {
                "@id": `${siteUrl}#organization`,
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": canonicalUrl,
              },
              isPartOf: {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                name: SITE_NAME,
                url: siteUrl,
              },
            },
            {
              "@type": "WebPage",
              "@id": canonicalUrl,
              url: canonicalUrl,
              name: pageTitle,
              description,
              isPartOf: {
                "@id": `${siteUrl}#website`,
              },
              breadcrumb: {
                "@id": `${canonicalUrl}#breadcrumb`,
              },
              inLanguage: "en",
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${canonicalUrl}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: SITE_NAME,
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Articles",
                  item: `${siteUrl}?articles=all`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: article.title,
                  item: canonicalUrl,
                },
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${siteUrl}#website`,
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: siteUrl,
              publisher: {
                "@id": `${siteUrl}#organization`,
              },
            },
            organization,
          ],
        }
      : legalPage
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          name: pageTitle,
          description,
          url: canonicalUrl,
          inLanguage: "en",
          isPartOf: {
            "@id": `${siteUrl}#website`,
          },
          publisher: {
            "@id": `${siteUrl}#organization`,
          },
        }
      : {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${siteUrl}#website`,
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: siteUrl,
              inLanguage: "en",
              publisher: {
                "@id": `${siteUrl}#organization`,
              },
            },
            {
              ...organization,
            },
          ],
        };

    upsertStructuredData(schema);
  }, [selectedArticle, legalPage]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("article");
      const page = params.get("page");
      const article = articles.find(
        (item) => createArticleSlug(item) === slug
      ) || null;
      setSelectedArticle(article);
      setLegalPage(page || null);
      setShowTools(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /* =======================================================
     FILTER TOOLS
     ======================================================= */

  const filteredTools = useMemo(() => {
    const query = toolSearch.trim().toLowerCase();

    return aiTools.filter((tool) => {
      const categoryMatch =
        toolCategory === "All" ||
        tool.category === toolCategory;

      if (!query) return categoryMatch;

      const searchMatch =
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [toolCategory, toolSearch]);

  /* =======================================================
     FILTER ARTICLES
     ======================================================= */

  const filteredArticles = useMemo(() => {
    const query = articleSearch.trim().toLowerCase();

    return articles.filter((article) => {
      const categoryMatch =
        articleCategory === "All" ||
        article.category === articleCategory;

      if (!query) return categoryMatch;

      const title = typeof article.title === "string" ? article.title : "";
      const excerpt = typeof article.excerpt === "string" ? article.excerpt : "";

      const searchMatch =
        title.toLowerCase().includes(query) ||
        excerpt.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [articleCategory, articleSearch]);

  const filteredNews = useMemo(() => {
    const query = newsSearch.trim().toLowerCase();
    return aiNews.filter((item) => {
      const categoryMatch = newsCategory === "All" || item.category === newsCategory;
      if (!query) return categoryMatch;
      const searchable = `${item.title} ${item.summary} ${item.why} ${item.tags.join(" ")}`.toLowerCase();
      return categoryMatch && searchable.includes(query);
    });
  }, [newsCategory, newsSearch]);

  const newsCategories = useMemo(
    () => ["All", ...new Set(aiNews.map((item) => item.category))],
    []
  );

  /* =======================================================
     NAVIGATION
     ======================================================= */

  const scrollToSection = (id) => {
    if (selectedArticle || legalPage || showTools) {
      setSelectedArticle(null);
      setLegalPage(null);
      setShowTools(false);
      window.history.pushState({}, "", window.location.pathname);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const goHome = () => {
    setSelectedArticle(null);
    setLegalPage(null);
    setShowTools(false);
    setShowAllArticles(false);

    window.history.pushState({}, "", window.location.pathname);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openTools = (category = "All") => {
    setSelectedArticle(null);
    setLegalPage(null);
    setShowTools(true);

    setToolCategory(category);
    setToolSearch("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openArticles = (category = "All") => {
    setSelectedArticle(null);
    setLegalPage(null);
    setShowTools(false);
    setShowAllArticles(true);

    setArticleCategory(category);

    setTimeout(() => {
      document
        .getElementById("articles")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 50);
  };

  const openArticle = (article) => {
    setSelectedArticle(article);
    setLegalPage(null);
    setShowTools(false);

    const slug = createArticleSlug(article);
    window.history.pushState(
      { articleSlug: slug },
      "",
      `?article=${encodeURIComponent(slug)}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openLegalPage = (page) => {
    setSelectedArticle(null);
    setShowTools(false);
    setLegalPage(page);
    window.history.pushState({}, "", `?page=${encodeURIComponent(page)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* =======================================================
     SHOW ARTICLE PAGE
     ======================================================= */

  if (selectedArticle) {
    return (
      <ArticlePage
        article={selectedArticle}
        goHome={goHome}
        openArticles={openArticles}
        openArticle={openArticle}
      />
    );
  }

  /* =======================================================
     SHOW LEGAL / INFORMATION PAGE
     ======================================================= */

  if (legalPage) {
    const legalContent = {
      about: {
        title: "About AI TechSphere",
        intro: "AI TechSphere is an independent AI and technology publication focused on helping people discover useful tools, practical guides, tutorials, reviews and technology resources.",
        sections: [
          ["Our Mission", "Our goal is simple: make AI and technology easier to understand and easier to use. We organize useful tools and practical information so readers can spend less time searching and more time building, learning and creating."],
          ["What We Cover", "We publish AI tool guides, technology explainers, comparisons, tutorials, creator workflows and practical tips. Information can change over time, so readers should also check the official website of a product or service for the latest details."],
          ["Editorial Approach", "We aim to provide clear, useful and practical information. We may update articles when products, features or pricing change. If you notice an error or outdated information, please contact us so we can review it."]
        ]
      },
      contact: {
        title: "Contact Us",
        intro: "Have a question, correction, suggestion or partnership inquiry? We would love to hear from you.",
        sections: [
          ["General Questions", "For questions about our articles, AI tools directory or website, please contact the AI TechSphere team by email."],
          ["Corrections & Feedback", "If you find inaccurate, outdated or misleading information, please tell us the article title and the specific issue so we can review it."],
          ["Business & Partnerships", "For advertising, affiliate, partnership or collaboration inquiries, please include your company or project name and a short description of your proposal."]
        ],
        email: "contact@aitechspherehub.com"
      },
      privacy: {
        title: "Privacy Policy",
        intro: "This Privacy Policy explains, in general terms, how AI TechSphere handles information when you use this website.",
        sections: [
          ["Information You Provide", "If you voluntarily submit information through a contact or newsletter form, we may receive the information you choose to provide. Do not submit sensitive personal information through forms on this website."],
          ["Analytics & Cookies", "The website may use analytics and cookies provided by third-party services. These services may collect information such as device type, browser information, approximate location, pages visited and interaction data according to their own policies. We use such technologies only as permitted by applicable law and the settings of the services we use."],
          ["Google Advertising & Personalized Ads", "If Google AdSense or other Google advertising services are enabled on AI TechSphere, third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's advertising cookies may help Google and its partners select and measure ads. Users can manage or opt out of personalized advertising through Google Ads Settings at https://adssettings.google.com/. Google may also use other technologies and signals as described in its own policies."],
          ["Third-Party Advertising Vendors", "If third-party advertising networks or vendors other than Google are used, AI TechSphere may identify those vendors in this policy and provide information about their applicable privacy choices. Users may also use available industry opt-out resources, such as https://optout.aboutads.info/, where applicable."],
          ["External Links", "AI TechSphere links to external websites and services. Once you leave our website, the external service's privacy policy and terms apply."],
          ["Updates", "We may update this Privacy Policy when the website, services or legal requirements change. Please check this page periodically for the latest version."]
        ]
      },
      terms: {
        title: "Terms & Conditions",
        intro: "By using AI TechSphere, you agree to use the website responsibly and in accordance with these general terms.",
        sections: [
          ["Website Content", "The articles, guides and tool information on AI TechSphere are provided for general informational and educational purposes. We do not guarantee that every piece of information will always be complete, current or error-free."],
          ["External Services", "AI TechSphere may link to third-party AI tools, software and websites. We are not responsible for the availability, policies, pricing, performance or content of those external services."],
          ["Acceptable Use", "Do not use the website to engage in unlawful activity, abuse our forms or systems, attempt unauthorized access, or interfere with the operation of the website."],
          ["Changes", "We may update website content, features or these terms from time to time. Continued use of the website after changes means you accept the updated terms."]
        ]
      },
      disclaimer: {
        title: "Disclaimer",
        intro: "The information on AI TechSphere is provided for general informational and educational purposes.",
        sections: [
          ["Accuracy", "We make reasonable efforts to provide useful and accurate information, but AI products, software features, pricing and availability can change quickly. Always verify important details with the official provider before making a decision."],
          ["Reviews & Recommendations", "Our reviews, comparisons and recommendations reflect the information and evaluation available when an article is prepared. They are not guarantees of future performance or suitability for every user."],
          ["Affiliate Links", "Some links on AI TechSphere may be affiliate links. If you purchase or sign up through an eligible link, we may receive a commission at no additional cost to you. Affiliate relationships do not guarantee a positive review."],
          ["No Professional Advice", "Our content should not be treated as legal, financial, medical, security or other professional advice. Seek a qualified professional when you need advice for a specific situation."]
        ]
      }
    };

    const page = legalContent[legalPage] || legalContent.about;

    return (
      <div className="app ai-techsphere-theme">
        <header className="navbar">
          <div className="nav-container">
            <button className="logo" onClick={goHome}>
              <span className="logo-icon">AI</span>
              <span>TechSphere</span>
            </button>
            <nav className="nav-links">
              <button onClick={goHome}>Home</button>
              <button onClick={() => openTools("All")}>AI Tools</button>
              <button onClick={() => openArticles("All")}>Articles</button>
              <button onClick={() => openArticles("How-To")}>How-To</button>
            </nav>
            <button className="nav-button" onClick={() => openTools("All")}>Explore AI</button>
          </div>
        </header>

        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 100px" }}>
          <button type="button" onClick={goHome} style={{ marginBottom: "28px", background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontSize: "15px" }}>
            â† Back to AI TechSphere
          </button>

          <div style={{ maxWidth: "780px" }}>
            <div className="section-label"><span></span>AI TECHSPHERE</div>
            <h1 style={{ fontSize: "clamp(38px, 6vw, 64px)", lineHeight: 1.05, marginBottom: "22px" }}>{page.title}</h1>
            <p style={{ fontSize: "19px", lineHeight: 1.8, opacity: 0.82, marginBottom: "44px" }}>{page.intro}</p>

            {page.email && (
              <div style={{ padding: "22px 24px", borderRadius: "16px", marginBottom: "42px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <strong>Email:</strong> {page.email}
              </div>
            )}

            {page.sections.map(([heading, text]) => (
              <section key={heading} style={{ marginBottom: "36px" }}>
                <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>{heading}</h2>
                {heading === "Google Advertising & Personalized Ads" ? (
                  <p style={{ fontSize: "17px", lineHeight: 1.85, opacity: 0.84 }}>
                    If Google AdSense or other Google advertising services are enabled on AI TechSphere, third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's advertising cookies may help Google and its partners select and measure ads. Users can manage or opt out of personalized advertising through{" "}
                    <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                      Google Ads Settings
                    </a>
                    . Google may also use other technologies and signals as described in its own policies.
                  </p>
                ) : heading === "Third-Party Advertising Vendors" ? (
                  <p style={{ fontSize: "17px", lineHeight: 1.85, opacity: 0.84 }}>
                    If third-party advertising networks or vendors other than Google are used, AI TechSphere may identify those vendors in this policy and provide information about their applicable privacy choices. Users may also use available industry opt-out resources, such as{" "}
                    <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                      AboutAds.info
                    </a>
                    , where applicable.
                  </p>
                ) : (
                  <p style={{ fontSize: "17px", lineHeight: 1.85, opacity: 0.84 }}>{text}</p>
                )}
              </section>
            ))}
          </div>
        </main>

        <footer className="footer">
          <div className="section-container">
            <div className="footer-bottom">
              <span>Â© 2026 AI TechSphere. All rights reserved.</span>
              <span>Built for the AI generation ðŸš€</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  /* =======================================================
     SHOW TOOLS PAGE
     ======================================================= */

  if (showTools) {
    return (
      <PublisherToolsPage
        tools={filteredTools}
        toolCategories={toolCategories}
        toolCategory={toolCategory}
        setToolCategory={setToolCategory}
        toolSearch={toolSearch}
        setToolSearch={setToolSearch}
        goHome={goHome}
        openArticles={openArticles}
      />
    );
  }

  /* =======================================================
     HOME PAGE
     ======================================================= */

  return (
    <div className="app ai-techsphere-theme">
      <AIHomeStyles />

      {/* NAVBAR */}

      <header className="navbar">
        <div className="nav-container">

          <button
            className="logo"
            onClick={goHome}
          >
            <span className="logo-icon">
              AI
            </span>

            <span>
              TechSphere
            </span>
          </button>

          <nav className="nav-links">

            <button onClick={goHome}>
              Home
            </button>

            <button
              onClick={() => openTools("All")}
            >
              AI Tools
            </button>

            <button
              onClick={() => openArticles("All")}
            >
              Articles
            </button>

            <button
              onClick={() => scrollToSection("ai-news")}
            >
              AI News
            </button>

            <button
              onClick={() => openArticles("How-To")}
            >
              How-To
            </button>

          </nav>

          <button
            className="nav-button"
            onClick={() => openTools("All")}
          >
            Explore AI
          </button>

        </div>
      </header>

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            ðŸš€ AI tools, guides & practical tech
          </div>

          <h1>
            Discover the{" "}
            <span className="gradient-text">
              Future of AI
            </span>
          </h1>

          <p>
            Find useful AI tools, practical guides, honest comparisons and
            creator-friendly tutorials â€” all in one place.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={() => openTools("All")}
            >
              Explore AI Tools â†’
            </button>

            <button
              className="secondary-button"
              onClick={() => openArticles("All")}
            >
              Read Articles
            </button>

          </div>

          <div className="hero-stats">

            <div>
              <strong>15+</strong>
              <span>AI Tools</span>
            </div>

            <div>
              <strong>15+</strong>
              <span>Articles</span>
            </div>

            <div>
              <strong>Weekly</strong>
              <span>Updates</span>
            </div>

          </div>

        </div>

      </section>

      {/* AI NEWSROOM */}

      <section className="ai-newsroom-section" id="ai-news">
        <div className="section-container">
          <div className="ai-newsroom-hero">
            <div>
              <div className="section-label">
                <span></span>
                AI NEWSROOM
              </div>
              <h2>What is happening in AI right now?</h2>
              <p>
                An editorial snapshot checked on September 22, 2026, covering models, AI agents, creative tools, developer platforms, security, infrastructure and the companies building the next generation of AI products.
              </p>
            </div>
            <div className="ai-newsroom-date">
              <strong>Updated</strong>
              <span>{AI_NEWS_UPDATED}</span>
              <small>Source links are provided for verification.</small>
            </div>
          </div>

          <div className="ai-news-controls">
            <div className="ai-news-search-wrap">
              <span>âŒ•</span>
              <input
                value={newsSearch}
                onChange={(event) => setNewsSearch(event.target.value)}
                placeholder="Search AI news, agents, models, tools..."
                aria-label="Search AI news"
              />
              {newsSearch && (
                <button type="button" onClick={() => setNewsSearch("")}>
                  Clear
                </button>
              )}
            </div>

            <div className="ai-news-filters">
              {newsCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={newsCategory === category ? "active" : ""}
                  onClick={() => setNewsCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-news-grid">
            {filteredNews.map((item) => {
              const isExpanded = expandedNews === item.id;
              return (
                <article className="ai-news-card" key={item.id}>
                  <div className="ai-news-image-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="ai-news-image"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="ai-news-image-label">AI TechSphere Editorial</span>
                  </div>
                  <div className="ai-news-card-top">
                    <span>{item.category}</span>
                    <time>{item.date}</time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>

                  <div className={`ai-news-detail ${isExpanded ? "open" : ""}`}>
                    <strong>Why it matters</strong>
                    <p>{item.why}</p>
                  </div>

                  <div className="ai-news-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>

                  <div className="ai-news-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedNews(isExpanded ? null : item.id)
                      }
                    >
                      {isExpanded ? "Hide analysis â†‘" : "Read analysis â†“"}
                    </button>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source: {item.source} â†—
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredNews.length === 0 && (
            <div className="ai-news-empty">
              <strong>No AI news matches that search.</strong>
              <p>Try a broader term such as agents, models, images, security or infrastructure.</p>
              <button
                type="button"
                onClick={() => {
                  setNewsSearch("");
                  setNewsCategory("All");
                }}
              >
                Reset Newsroom
              </button>
            </div>
          )}
        </div>
      </section>

      {/* AI CURRENT AFFAIRS / EDITORIAL BRIEF */}

      <section className="ai-brief-section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <div className="section-label">
                <span></span>
                THE AI BRIEF
              </div>
              <h2>The bigger AI story behind today's headlines.</h2>
              <p>
                AI TechSphere looks beyond launch announcements. These short
                explainers connect individual product updates to the larger
                changes happening across AI.
              </p>
            </div>
          </div>

          <div className="ai-trend-grid">
            {aiTrendCards.map((item) => (
              <article className="ai-trend-card" key={item.label}>
                <span className="ai-trend-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="ai-editorial-callout">
            <div>
              <span className="ai-editorial-kicker">EDITORIAL PRINCIPLE</span>
              <h3>Separate the announcement from the evidence.</h3>
              <p>
                AI companies naturally describe their products in the strongest
                possible terms. Our job is to explain what was actually announced,
                what is available, what is still changing and what a user should
                verify before relying on it.
              </p>
            </div>
            <div className="ai-editorial-points">
              <span>âœ“ Identify the original source</span>
              <span>âœ“ Explain practical impact</span>
              <span>âœ“ Flag changing features and pricing</span>
              <span>âœ“ Avoid copying press releases</span>
            </div>
          </div>
        </div>
      </section>



      {/* SEARCH */}

      <section className="search-section">

        <div className="search-box">

          <span>ðŸ”</span>

          <input
            type="text"
            placeholder="Search articles, guides and comparisons..."
            value={articleSearch}
            onChange={(e) => {
              setArticleSearch(e.target.value);
              setArticleCategory("All");
            }}
          />

          <button
            onClick={() => openTools("All")}
          >
            Browse AI Tools
          </button>

        </div>

      </section>

      {/* FEATURED STORY */}

      {articles.length > 0 && (
        <section className="featured-section">

          <div className="section-container">

            <div className="section-label">
              <span></span>
              FEATURED STORY
            </div>

            <article
              className="featured-card"
              style={{
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                className="featured-content"
                style={{
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  <span className="article-category">
                    {articles[0].category}
                  </span>

                  <span
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.62)",
                    }}
                  >
                    âœ¦ Editor's Pick
                  </span>
                </div>

                <h2>
                  {articles[0].title}
                </h2>

                <p>
                  {articles[0].excerpt}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "22px",
                    color: "rgba(255,255,255,0.62)",
                    fontSize: "14px",
                  }}
                >
                  <span>ðŸ“– Practical guide</span>
                  {articles[0].readTime && (
                    <span>â€¢ {articles[0].readTime}</span>
                  )}
                </div>

                <button
                  className="read-button"
                  onClick={() =>
                    openArticle(articles[0])
                  }
                >
                  Read Full Article â†’
                </button>
              </div>

              <div
                className="featured-visual"
                style={{
                  position: "relative",
                  minHeight: "100%",
                  overflow: "hidden",
                }}
              >
                {articles[0].image ? (
                  <>
                    <img
                      src={articles[0].image}
                      alt={articles[0].title}
                      loading="eager"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: "320px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(90deg, rgba(16,18,45,0.1), rgba(16,18,45,0.38))",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        right: "18px",
                        bottom: "18px",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: "rgba(10,12,30,0.72)",
                        border: "1px solid rgba(255,255,255,0.14)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      Featured guide â†—
                    </div>
                  </>
                ) : (
                  <div className="featured-orb">
                    AI
                  </div>
                )}
              </div>
            </article>

          </div>

        </section>
      )}


      {/* AI EXPLAINER HUB */}

      <section className="ai-explainer-section">
        <div className="section-container">
          <div className="section-heading centered">
            <div>
              <div className="section-label centered-label">
                <span></span>
                AI KNOWLEDGE HUB
                <span></span>
              </div>
              <h2>Understand the AI technology behind the hype.</h2>
              <p>
                Short, practical explainers for the concepts that keep appearing
                in today's AI products and news.
              </p>
            </div>
          </div>

          <div className="ai-explainer-grid">
            {aiExplainers.map((item) => (
              <article className="ai-explainer-card" key={item.title}>
                <div className="ai-explainer-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>AI TechSphere Explainer â†’</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI USE CASES */}

      <section className="ai-usecases-section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <div className="section-label">
                <span></span>
                AI USE CASES
              </div>
              <h2>What can you actually do with AI?</h2>
              <p>
                The useful unit is not the model. It is the workflow you can
                complete with the model, tools and human review around it.
              </p>
            </div>
          </div>

          <div className="ai-usecases-grid">
            {aiUseCases.map((item) => (
              <article className="ai-usecase-card" key={item.title}>
                <div className="ai-usecase-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="ai-usecase-workflow">
                  <small>WORKFLOW</small>
                  <strong>{item.workflow}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROMPT LAB */}

      <section className="prompt-lab-section">
        <div className="section-container">
          <div className="prompt-lab-header">
            <div>
              <div className="section-label">
                <span></span>
                FREE PROMPT LAB
              </div>
              <h2>Useful prompts you can adapt today.</h2>
              <p>
                Good prompting is less about magic words and more about giving
                an AI system a clear objective, useful context, constraints and
                a way to evaluate the result.
              </p>
            </div>
            <div className="prompt-lab-badge">
              <strong>FREE RESOURCE</strong>
              <span>No signup required</span>
            </div>
          </div>

          <div className="prompt-grid">
            {promptTemplates.map((item) => (
              <article className="prompt-card" key={item.title}>
                <div className="prompt-card-head">
                  <span>Prompt</span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.text}</p>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(item.text);
                    }
                  }}
                >
                  Copy Prompt â†—
                </button>
              </article>
            ))}
          </div>

          <div className="prompt-method">
            <h3>A simple prompt formula</h3>
            <div className="prompt-formula">
              <span>Goal</span>
              <b>+</b>
              <span>Context</span>
              <b>+</b>
              <span>Constraints</span>
              <b>+</b>
              <span>Output format</span>
              <b>+</b>
              <span>Quality check</span>
            </div>
            <p>
              Start with the result you want, explain the situation, state what
              the AI should not assume, specify the format and ask it to identify
              uncertainty when facts matter.
            </p>
          </div>
        </div>
      </section>

      {/* AI TOOL DISCOVERY CONTENT */}

      <section className="ai-discovery-section">
        <div className="section-container">
          <div className="section-heading centered">
            <div>
              <div className="section-label centered-label">
                <span></span>
                AI DISCOVERY GUIDE
                <span></span>
              </div>
              <h2>How to choose an AI tool without wasting money.</h2>
              <p>
                Tool lists are useful only when they help you make a better
                decision. Use this simple evaluation process before subscribing.
              </p>
            </div>
          </div>

          <div className="ai-discovery-steps">
            <div>
              <span>01</span>
              <h3>Define the job</h3>
              <p>Write down the exact task you want AI to improve.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Test real inputs</h3>
              <p>Use your own realistic examples instead of marketing demos.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Measure editing</h3>
              <p>Count how much human cleanup is required before the result is useful.</p>
            </div>
            <div>
              <span>04</span>
              <h3>Check total cost</h3>
              <p>Consider subscriptions, credits, API usage, storage and time.</p>
            </div>
            <div>
              <span>05</span>
              <h3>Check privacy</h3>
              <p>Understand what data you are sending and which permissions the tool needs.</p>
            </div>
            <div>
              <span>06</span>
              <h3>Re-test later</h3>
              <p>AI products change quickly, so a comparison can become outdated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES */}

      <section
        className="articles-section"
        id="articles"
      >

        <div className="section-container">

          <div className="section-heading">

            <div>

              <div className="section-label">
                <span></span>
                LATEST ARTICLES
              </div>

              <h2>
                Practical AI & Tech, without the noise.
              </h2>

              <p>
                Clear guides, comparisons and useful ideas to help you choose tools
                and get more from today's technology.
              </p>

            </div>

            <button
              className="view-all"
              onClick={() =>
                openArticles("All")
              }
            >
              View All â†’
            </button>

          </div>

          {/* CATEGORY FILTERS */}

          <div className="article-filters">

            {[
              "All",
              "AI",
              "Tech",
              "How-To",
              "Reviews",
            ].map((category) => (

              <button
                key={category}
                className={
                  articleCategory === category
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setArticleCategory(category)
                }
              >
                {category}
              </button>

            ))}

          </div>

          {/* ARTICLE SEARCH */}

          <div className="article-search">

            <input
              type="text"
              placeholder="Search articles..."
              value={articleSearch}
              onChange={(e) =>
                setArticleSearch(e.target.value)
              }
            />

          </div>

          {/* ARTICLE CARDS */}

          <div className="article-grid">

            {(showAllArticles || articleSearch.trim()
              ? filteredArticles
              : filteredArticles.slice(0, 9)
            ).map((article) => (

              <article
                className="article-card"
                key={article.id}
                onClick={() =>
                  openArticle(article)
                }
              >

                <div className="article-image">

                  {article.image ? (

                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                    />

                  ) : (

                    <div className="article-placeholder">
                      AI
                    </div>

                  )}

                </div>

                <div className="article-body">

                  <span className="article-category">
                    {article.category}
                  </span>

                  <h3>
                    {article.title}
                  </h3>

                  <p>
                    {article.excerpt}
                  </p>

                  <span className="article-link">
                    Read More â†’
                  </span>

                </div>

              </article>

            ))}

          </div>

          {filteredArticles.length === 0 && (

            <div className="empty-state">
              No articles found.
            </div>

          )}

        </div>

      </section>

      {/* AI CATEGORIES */}

      <section className="tools-section">

        <div className="section-container">

          <div className="section-heading centered">

            <div>

              <div className="section-label centered-label">
                <span></span>
                AI TOOL DIRECTORY
                <span></span>
              </div>

              <h2>
                Popular AI Categories
              </h2>

              <p>
                Discover powerful AI tools for work,
                creativity and productivity.
              </p>

            </div>

          </div>

          <div className="category-grid">

            <ToolCard
              icon="ðŸ’¬"
              title="AI Chat"
              description="Chatbots, assistants and AI companions."
              color="purple"
              onClick={() =>
                openTools("AI Chat")
              }
            />

            <ToolCard
              icon="ðŸŽ¨"
              title="AI Images"
              description="Generate stunning images and artwork."
              color="pink"
              onClick={() =>
                openTools("AI Images")
              }
            />

            <ToolCard
              icon="ðŸŽ¬"
              title="AI Video"
              description="Create videos with generative AI."
              color="blue"
              onClick={() =>
                openTools("AI Video")
              }
            />

            <ToolCard
              icon="âœï¸"
              title="AI Writing"
              description="Write, edit and improve content."
              color="green"
              onClick={() =>
                openTools("AI Writing")
              }
            />

            <ToolCard
              icon="ðŸ”Š"
              title="AI Audio"
              description="Generate voices, music and audio."
              color="orange"
              onClick={() =>
                openTools("AI Audio")
              }
            />

            <ToolCard
              icon="âš™ï¸"
              title="Productivity"
              description="Automate tasks and work smarter."
              color="cyan"
              onClick={() =>
                openTools("Productivity")
              }
            />

          </div>

          <div className="center-button">

            <button
              className="primary-button"
              onClick={() =>
                openTools("All")
              }
            >
              Explore All AI Tools â†’
            </button>

          </div>

        </div>

      </section>

      {/* WHY */}

      <section className="why-section">

        <div className="section-container">

          <div className="section-heading centered">

            <div>

              <div className="section-label centered-label">
                <span></span>
                WHY AI TECHSPHERE
                <span></span>
              </div>

              <h2>
                Everything AI. One Place.
              </h2>

              <p>
                We make it easier to discover
                and understand useful technology.
              </p>

            </div>

          </div>

          <div className="why-grid">

            <div className="why-card">

              <div className="why-icon">
                ðŸ”Ž
              </div>

              <h3>
                Discover
              </h3>

              <p>
                Find useful AI tools without
                spending hours searching.
              </p>

            </div>

            <div className="why-card">

              <div className="why-icon">
                ðŸ“š
              </div>

              <h3>
                Learn
              </h3>

              <p>
                Simple guides and tutorials
                that anyone can understand.
              </p>

            </div>

            <div className="why-card">

              <div className="why-icon">
                âš¡
              </div>

              <h3>
                Stay Updated
              </h3>

              <p>
                Keep up with important AI
                and technology developments.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* EDITORIAL TRUST */}

      <section
        className="editorial-trust-section"
        style={{
          padding: "72px 0",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="section-container">
          <div
            style={{
              maxWidth: "820px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div className="section-label centered-label">
              <span></span>
              EDITORIAL APPROACH
              <span></span>
            </div>

            <h2 style={{ marginBottom: "16px" }}>
              Practical AI information you can trust.
            </h2>

            <p
              style={{
                maxWidth: "720px",
                margin: "0 auto 30px",
                lineHeight: 1.8,
              }}
            >
              AI TechSphere focuses on useful tools, practical tutorials,
              comparisons and creator workflows. We aim to explain products
              clearly, keep information useful, and point readers to official
              sources when features or pricing can change.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "16px",
                marginTop: "28px",
              }}
            >
              <div
                style={{
                  padding: "22px 18px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <strong style={{ display: "block", marginBottom: "8px" }}>
                  âœ¦ Practical
                </strong>
                <span style={{ opacity: 0.72, lineHeight: 1.6 }}>
                  Clear guides focused on real use cases.
                </span>
              </div>

              <div
                style={{
                  padding: "22px 18px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <strong style={{ display: "block", marginBottom: "8px" }}>
                  âœ“ Transparent
                </strong>
                <span style={{ opacity: 0.72, lineHeight: 1.6 }}>
                  Recommendations and affiliate relationships are disclosed.
                </span>
              </div>

              <div
                style={{
                  padding: "22px 18px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <strong style={{ display: "block", marginBottom: "8px" }}>
                  â†» Updated
                </strong>
                <span style={{ opacity: 0.72, lineHeight: 1.6 }}>
                  We review content as tools and features evolve.
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "28px",
              }}
            >
              <button
                type="button"
                className="secondary-button"
                onClick={() => openLegalPage("about")}
              >
                About Us
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => openLegalPage("disclaimer")}
              >
                Editorial & Affiliate Disclosure
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* READER VALUE */}

      <section className="reviews-section">

        <div className="section-container">

          <div className="section-heading centered">

            <div>

              <div className="section-label centered-label">
                <span></span>
                WHY AI TECHSPHERE
                <span></span>
              </div>

              <h2>
                Built for practical AI discovery.
              </h2>

            </div>

          </div>

          <div className="reviews-grid">

            <div className="review-card">
              <div className="stars">âœ¦</div>
              <h3>Practical guides</h3>
              <p>
                Step-by-step explainers, workflows and comparisons designed around real tasks.
              </p>
            </div>

            <div className="review-card">
              <div className="stars">âœ“</div>
              <h3>Clear recommendations</h3>
              <p>
                We explain what a tool is useful for, who it may suit and what to check before using it.
              </p>
            </div>

            <div className="review-card">
              <div className="stars">â†»</div>
              <h3>Useful over time</h3>
              <p>
                AI products change quickly, so our guides can be reviewed and updated as information evolves.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* AI EDITORIAL / UPDATE DESK */}

      <section className="ai-update-desk-section">
        <div className="section-container">
          <div className="ai-update-desk">
            <div className="ai-update-main">
              <div className="section-label">
                <span></span>
                AI TECHSPHERE UPDATE DESK
              </div>
              <h2>Built to keep learning as AI changes.</h2>
              <p>
                AI TechSphere is designed as a practical reference rather than a
                collection of copied announcements. We combine AI news, original
                explainers, tool discovery, comparisons, tutorials and workflow
                ideas so a reader can move from â€œWhat happened?â€ to â€œWhat does
                this mean for me?â€.
              </p>
              <div className="ai-update-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => scrollToSection("ai-news")}
                >
                  Read AI News â†’
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => openArticles("All")}
                >
                  Browse Guides â†’
                </button>
              </div>
            </div>

            <div className="ai-update-checklist">
              <h3>What we aim to do on every update</h3>
              <div>âœ“ Find the original announcement or source</div>
              <div>âœ“ Summarize in original language</div>
              <div>âœ“ Explain the practical user impact</div>
              <div>âœ“ Separate facts from interpretation</div>
              <div>âœ“ Point readers to official details</div>
              <div>âœ“ Review information when products change</div>
            </div>
          </div>

          <div className="ai-topic-strip">
            <span>AI MODELS</span>
            <span>AI AGENTS</span>
            <span>AI SEARCH</span>
            <span>AI IMAGES</span>
            <span>AI VIDEO</span>
            <span>AI AUDIO</span>
            <span>AI CODING</span>
            <span>AI AUTOMATION</span>
            <span>AI SECURITY</span>
            <span>AI CHIPS</span>
            <span>AI DATA CENTERS</span>
            <span>AI PRODUCTIVITY</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div className="section-container">

          <div className="footer-grid">

            <div>

              <button
                className="logo footer-logo"
                onClick={goHome}
              >

                <span className="logo-icon">
                  AI
                </span>

                <span>
                  TechSphere
                </span>

              </button>

              <p>
                Discover the future of artificial
                intelligence and technology.
              </p>

            </div>

            <div>

              <h4>
                Explore
              </h4>

              <button
                onClick={() =>
                  openTools("All")
                }
              >
                AI Tools
              </button>

              <button
                onClick={() =>
                  openArticles("All")
                }
              >
                Articles
              </button>

              <button
                onClick={() =>
                  openArticles("How-To")
                }
              >
                How-To Guides
              </button>

            </div>

            <div>

              <h4>
                Categories
              </h4>

              <button
                onClick={() =>
                  openTools("AI Chat")
                }
              >
                AI Chat
              </button>

              <button
                onClick={() =>
                  openTools("AI Images")
                }
              >
                AI Images
              </button>

              <button
                onClick={() =>
                  openTools("AI Video")
                }
              >
                AI Video
              </button>

            </div>

            <div>

              <h4>
                More
              </h4>

              <button
                onClick={() =>
                  openArticles("Reviews")
                }
              >
                Reviews
              </button>

              <button
                onClick={() =>
                  openTools("Productivity")
                }
              >
                Productivity
              </button>

              <button onClick={() => openLegalPage("about")}>About Us</button>
              <button onClick={() => openLegalPage("contact")}>Contact Us</button>
              <button onClick={() => openLegalPage("privacy")}>Privacy Policy</button>
              <button onClick={() => openLegalPage("terms")}>Terms & Conditions</button>
              <button onClick={() => openLegalPage("disclaimer")}>Disclaimer</button>

            </div>

          </div>

          <div className="footer-bottom">

            <span>
              Â© 2026 AI TechSphere.
              All rights reserved.
            </span>

            <span>
              Built for the AI generation ðŸš€
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   AI CONTENT HUB STYLES
   Kept in App.jsx so this upgrade is a single-file replacement.
   ========================================================= */

const AIHomeStyles = () => (
  <style>{`
    .ai-newsroom-section,
    .ai-brief-section,
    .ai-explainer-section,
    .ai-usecases-section,
    .prompt-lab-section,
    .ai-discovery-section,
    .ai-update-desk-section {
      position: relative;
      overflow: hidden;
    }

    .ai-newsroom-section {
      padding: 92px 0 96px;
      background:
        radial-gradient(circle at 10% 10%, rgba(109, 40, 217, .16), transparent 32%),
        linear-gradient(180deg, #0c1027 0%, #111735 100%);
      color: #fff;
    }

    .ai-newsroom-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 260px;
      gap: 40px;
      align-items: end;
      margin-bottom: 34px;
    }

    .ai-newsroom-hero h2,
    .ai-brief-section h2,
    .ai-explainer-section h2,
    .ai-usecases-section h2,
    .prompt-lab-section h2,
    .ai-discovery-section h2,
    .ai-update-desk-section h2 {
      margin: 14px 0 14px;
      font-size: clamp(32px, 4vw, 52px);
      line-height: 1.08;
      letter-spacing: -.03em;
    }

    .ai-newsroom-hero p,
    .ai-brief-section .section-heading p,
    .ai-explainer-section .section-heading p,
    .ai-usecases-section .section-heading p,
    .prompt-lab-header p,
    .ai-discovery-section .section-heading p {
      max-width: 780px;
      font-size: 17px;
      line-height: 1.8;
      opacity: .78;
    }

    .ai-newsroom-date {
      padding: 22px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 20px;
      background: rgba(255,255,255,.05);
      display: grid;
      gap: 6px;
    }

    .ai-newsroom-date strong { font-size: 12px; text-transform: uppercase; letter-spacing: .12em; opacity: .65; }
    .ai-newsroom-date span { font-size: 20px; font-weight: 800; }
    .ai-newsroom-date small { opacity: .58; line-height: 1.5; }

    .ai-news-controls { margin-bottom: 28px; }
    .ai-news-search-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 16px;
      background: rgba(255,255,255,.06);
      margin-bottom: 14px;
    }

    .ai-news-search-wrap span { opacity: .65; font-size: 20px; }
    .ai-news-search-wrap input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: #fff;
      font: inherit;
      padding: 12px 0;
    }
    .ai-news-search-wrap input::placeholder { color: rgba(255,255,255,.45); }
    .ai-news-search-wrap button,
    .ai-news-filters button,
    .ai-news-actions button {
      border: 0;
      cursor: pointer;
      font: inherit;
    }
    .ai-news-search-wrap button {
      padding: 8px 12px;
      border-radius: 10px;
      background: rgba(255,255,255,.1);
      color: #fff;
    }

    .ai-news-filters {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
    }
    .ai-news-filters button {
      padding: 8px 13px;
      border-radius: 999px;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.1);
      color: rgba(255,255,255,.76);
    }
    .ai-news-filters button.active {
      background: #fff;
      color: #10142c;
      border-color: #fff;
      font-weight: 700;
    }

    .ai-news-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .ai-news-card {
      padding: 24px;
      border-radius: 22px;
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.055);
      box-shadow: 0 20px 50px rgba(0,0,0,.16);
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }


    .ai-news-image-wrap {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      border-radius: 16px;
      margin: -6px -6px 20px;
      background: #171c3b;
    }

    .ai-news-image {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      transition: transform .35s ease;
    }

    .ai-news-card:hover .ai-news-image {
      transform: scale(1.035);
    }

    .ai-news-image-label {
      position: absolute;
      left: 12px;
      bottom: 12px;
      padding: 6px 9px;
      border-radius: 999px;
      background: rgba(8, 11, 29, .78);
      border: 1px solid rgba(255,255,255,.16);
      color: rgba(255,255,255,.88);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .04em;
      backdrop-filter: blur(8px);
    }

    .ai-news-card-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
      font-size: 12px;
    }
    .ai-news-card-top span {
      color: #d8b4fe;
      font-weight: 800;
      letter-spacing: .07em;
      text-transform: uppercase;
    }
    .ai-news-card-top time { opacity: .55; white-space: nowrap; }
    .ai-news-card h3 { margin: 0 0 12px; font-size: 21px; line-height: 1.3; }
    .ai-news-card > p { margin: 0; line-height: 1.72; color: rgba(255,255,255,.72); }

    .ai-news-detail {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height .25s ease, opacity .25s ease, margin .25s ease;
    }
    .ai-news-detail.open {
      max-height: 220px;
      opacity: 1;
      margin-top: 18px;
    }
    .ai-news-detail strong { font-size: 12px; text-transform: uppercase; letter-spacing: .1em; color: #c4b5fd; }
    .ai-news-detail p { margin: 7px 0 0; line-height: 1.65; color: rgba(255,255,255,.7); }

    .ai-news-tags { display: flex; gap: 7px; flex-wrap: wrap; margin-top: auto; padding-top: 22px; }
    .ai-news-tags span {
      font-size: 11px;
      color: rgba(255,255,255,.55);
      padding: 5px 8px;
      border-radius: 999px;
      background: rgba(255,255,255,.055);
    }

    .ai-news-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,.08);
    }
    .ai-news-actions button {
      background: transparent;
      color: #e9d5ff;
      font-weight: 700;
      padding: 0;
    }
    .ai-news-actions a { color: #fff; font-size: 13px; opacity: .65; text-decoration: none; }
    .ai-news-actions a:hover { opacity: 1; text-decoration: underline; }

    .ai-news-empty {
      text-align: center;
      padding: 50px 20px;
      border: 1px dashed rgba(255,255,255,.16);
      border-radius: 20px;
    }
    .ai-news-empty p { opacity: .65; }
    .ai-news-empty button {
      border: 0;
      border-radius: 10px;
      padding: 10px 15px;
      cursor: pointer;
      font-weight: 700;
    }

    .ai-brief-section,
    .ai-explainer-section,
    .ai-usecases-section,
    .ai-discovery-section {
      padding: 94px 0;
    }

    /* =========================================================
       AI TECHSPHERE DARK FUTURE THEME
       Keep the entire homepage visually coherent instead of mixing
       white sections with the dark AI/newsroom sections.
       ========================================================= */
    .ai-techsphere-theme {
      --ats-bg: #070a18;
      --ats-surface: #0c1022;
      --ats-surface-2: #11172d;
      --ats-card: #121a33;
      --ats-card-hover: #17213d;
      --ats-border: rgba(148, 163, 184, .16);
      --ats-text: #f8fafc;
      --ats-muted: #aab4ca;
      --ats-soft: #7f8aa3;
      --ats-purple: #8b5cf6;
      --ats-purple-2: #a78bfa;
      --ats-cyan: #22d3ee;
      background: var(--ats-bg) !important;
      color: var(--ats-text) !important;
      min-height: 100vh;
    }

    .ai-techsphere-theme,
    .ai-techsphere-theme * {
      box-sizing: border-box;
    }

    .ai-techsphere-theme .navbar {
      background: rgba(7, 10, 24, .92) !important;
      border-bottom: 1px solid rgba(148,163,184,.12) !important;
      backdrop-filter: blur(18px);
    }

    .ai-techsphere-theme .nav-links button,
    .ai-techsphere-theme .logo {
      color: #e8edf7 !important;
    }

    .ai-techsphere-theme .nav-links button:hover {
      color: #c4b5fd !important;
    }

    .ai-techsphere-theme .hero {
      background:
        radial-gradient(circle at 15% 20%, rgba(139,92,246,.24), transparent 30%),
        radial-gradient(circle at 85% 30%, rgba(34,211,238,.13), transparent 28%),
        linear-gradient(180deg, #070a18 0%, #0b1022 100%) !important;
      color: #fff !important;
    }

    .ai-techsphere-theme .hero p {
      color: #aab4ca !important;
    }

    .ai-techsphere-theme .hero-stats > div {
      background: rgba(255,255,255,.045) !important;
      border-color: rgba(255,255,255,.10) !important;
    }

    .ai-techsphere-theme .search-section {
      background: #0b1022 !important;
    }

    .ai-techsphere-theme .search-box {
      background: #121a33 !important;
      border-color: rgba(148,163,184,.18) !important;
    }

    .ai-techsphere-theme .search-box input {
      background: transparent !important;
      color: #f8fafc !important;
    }

    .ai-techsphere-theme .search-box input::placeholder {
      color: #7f8aa3 !important;
    }

    .ai-techsphere-theme .featured-section,
    .ai-techsphere-theme .articles-section,
    .ai-techsphere-theme .tools-section,
    .ai-techsphere-theme .why-section,
    .ai-techsphere-theme .reviews-section,
    .ai-techsphere-theme .editorial-trust-section {
      background: #0b1022 !important;
      color: #f8fafc !important;
    }

    .ai-techsphere-theme .article-card,
    .ai-techsphere-theme .why-card,
    .ai-techsphere-theme .review-card,
    .ai-techsphere-theme .featured-card {
      background: #121a33 !important;
      border-color: rgba(148,163,184,.16) !important;
      color: #f8fafc !important;
    }

    .ai-techsphere-theme .article-card h3,
    .ai-techsphere-theme .why-card h3,
    .ai-techsphere-theme .review-card h3,
    .ai-techsphere-theme .featured-card h2,
    .ai-techsphere-theme .section-heading h2 {
      color: #f8fafc !important;
    }

    .ai-techsphere-theme .article-card p,
    .ai-techsphere-theme .why-card p,
    .ai-techsphere-theme .review-card p,
    .ai-techsphere-theme .section-heading p {
      color: #aab4ca !important;
    }

    .ai-techsphere-theme .section-label,
    .ai-techsphere-theme .article-category {
      color: #a78bfa !important;
    }

    .ai-techsphere-theme .ai-brief-section,
    .ai-techsphere-theme .ai-explainer-section,
    .ai-techsphere-theme .ai-usecases-section,
    .ai-techsphere-theme .ai-discovery-section,
    .ai-techsphere-theme .ai-update-desk-section {
      background: #0b1022 !important;
      color: var(--ats-text) !important;
    }

    .ai-techsphere-theme .ai-brief-section h2,
    .ai-techsphere-theme .ai-explainer-section h2,
    .ai-techsphere-theme .ai-usecases-section h2,
    .ai-techsphere-theme .ai-discovery-section h2,
    .ai-techsphere-theme .ai-update-desk-section h2,
    .ai-techsphere-theme .ai-brief-section h3,
    .ai-techsphere-theme .ai-explainer-section h3,
    .ai-techsphere-theme .ai-usecases-section h3,
    .ai-techsphere-theme .ai-discovery-section h3,
    .ai-techsphere-theme .ai-update-desk-section h3 {
      color: #f8fafc !important;
    }

    .ai-techsphere-theme .ai-brief-section .section-heading p,
    .ai-techsphere-theme .ai-explainer-section .section-heading p,
    .ai-techsphere-theme .ai-usecases-section .section-heading p,
    .ai-techsphere-theme .ai-discovery-section .section-heading p,
    .ai-techsphere-theme .ai-update-desk-section p {
      color: #aab4ca !important;
      opacity: 1;
    }

    .ai-techsphere-theme .ai-brief-section .section-label,
    .ai-techsphere-theme .ai-explainer-section .section-label,
    .ai-techsphere-theme .ai-usecases-section .section-label,
    .ai-techsphere-theme .ai-discovery-section .section-label,
    .ai-techsphere-theme .ai-update-desk-section .section-label {
      color: #a78bfa !important;
    }

    .ai-techsphere-theme .ai-trend-card,
    .ai-techsphere-theme .ai-explainer-card,
    .ai-techsphere-theme .ai-usecase-card,
    .ai-techsphere-theme .ai-discovery-steps > div,
    .ai-techsphere-theme .ai-update-desk {
      background: #121a33 !important;
      border-color: rgba(148,163,184,.16) !important;
      color: #f8fafc !important;
      box-shadow: 0 18px 50px rgba(0,0,0,.18);
    }

    .ai-techsphere-theme .ai-trend-card p,
    .ai-techsphere-theme .ai-explainer-card p,
    .ai-techsphere-theme .ai-usecase-card p,
    .ai-techsphere-theme .ai-discovery-steps p {
      color: #aab4ca !important;
    }

    .ai-techsphere-theme .ai-trend-card {
      transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
    }

    .ai-techsphere-theme .ai-trend-card:hover,
    .ai-techsphere-theme .ai-explainer-card:hover,
    .ai-techsphere-theme .ai-usecase-card:hover {
      transform: translateY(-3px);
      border-color: rgba(139,92,246,.35) !important;
      box-shadow: 0 22px 60px rgba(0,0,0,.28);
    }

    .ai-techsphere-theme .ai-trend-label,
    .ai-techsphere-theme .ai-editorial-kicker {
      color: #a78bfa !important;
    }

    .ai-techsphere-theme .ai-discovery-steps > div {
      background: #0f162c !important;
    }

    .ai-techsphere-theme .ai-discovery-steps span {
      background: rgba(139,92,246,.16) !important;
      color: #c4b5fd !important;
    }

    .ai-techsphere-theme .ai-update-desk-section {
      background: #070a18 !important;
    }

    .ai-techsphere-theme .ai-update-checklist {
      background: #0f162c !important;
      border-color: rgba(148,163,184,.14) !important;
    }

    .ai-techsphere-theme .ai-update-checklist div {
      color: #aab4ca !important;
    }

    .ai-techsphere-theme .ai-topic-strip span {
      background: #121a33 !important;
      border-color: rgba(148,163,184,.16) !important;
      color: #aab4ca !important;
    }

    .ai-techsphere-theme .footer {
      background: #050711 !important;
      color: #aab4ca !important;
      border-top: 1px solid rgba(148,163,184,.12) !important;
    }

    .ai-techsphere-theme .footer h3,
    .ai-techsphere-theme .footer strong {
      color: #f8fafc !important;
    }

    .ai-techsphere-theme .footer a,
    .ai-techsphere-theme .footer button {
      color: #9da8bf !important;
    }

    .ai-techsphere-theme .footer a:hover,
    .ai-techsphere-theme .footer button:hover {
      color: #c4b5fd !important;
    }

    .ai-techsphere-theme .tools-section .tool-card {
      background: #121a33 !important;
      border-color: rgba(148,163,184,.16) !important;
      color: #f8fafc !important;
    }

    .ai-techsphere-theme .tools-section .tool-card h3 {
      color: #f8fafc !important;
    }

    .ai-techsphere-theme .tools-section .tool-card p {
      color: #aab4ca !important;
    }

    .ai-techsphere-theme .ai-editorial-callout {
      background: linear-gradient(135deg, #121a33, #0d1429) !important;
      border: 1px solid rgba(139,92,246,.22);
    }

    .ai-techsphere-theme .ai-editorial-points span {
      background: rgba(255,255,255,.055) !important;
    }

    .ai-techsphere-theme .primary-button,
    .ai-techsphere-theme .nav-button {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9) !important;
      color: #fff !important;
      border-color: transparent !important;
      box-shadow: 0 12px 30px rgba(109,40,217,.25);
    }

    .ai-techsphere-theme .secondary-button {
      background: rgba(255,255,255,.055) !important;
      color: #f8fafc !important;
      border-color: rgba(255,255,255,.14) !important;
    }

    .ai-techsphere-theme .secondary-button:hover {
      background: rgba(255,255,255,.09) !important;
    }

    .ai-techsphere-theme .featured-card {
      box-shadow: 0 25px 70px rgba(0,0,0,.25);
    }

    .ai-techsphere-theme .article-card:hover,
    .ai-techsphere-theme .why-card:hover,
    .ai-techsphere-theme .tool-card:hover {
      border-color: rgba(139,92,246,.32) !important;
      box-shadow: 0 22px 60px rgba(0,0,0,.26) !important;
    }

    .ai-techsphere-theme .prompt-lab-section {
      background:
        radial-gradient(circle at 90% 10%, rgba(34,211,238,.10), transparent 30%),
        radial-gradient(circle at 10% 80%, rgba(139,92,246,.16), transparent 32%),
        #070a18 !important;
    }

    .ai-trend-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 18px;
    }
    .ai-trend-card {
      padding: 26px;
      border-radius: 20px;
      border: 1px solid #e7e7ef;
      background: #fff;
    }
    .ai-trend-label,
    .ai-editorial-kicker {
      display: block;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .12em;
      color: #6d28d9;
      margin-bottom: 12px;
    }
    .ai-trend-card h3 { margin: 0 0 10px; font-size: 21px; }
    .ai-trend-card p { margin: 0; color: #5d6270; line-height: 1.7; }

    .ai-editorial-callout {
      margin-top: 22px;
      display: grid;
      grid-template-columns: 1.4fr .8fr;
      gap: 30px;
      padding: 32px;
      border-radius: 24px;
      background: #111735;
      color: #fff;
    }
    .ai-editorial-callout h3 { margin: 0 0 12px; font-size: 28px; }
    .ai-editorial-callout p { margin: 0; line-height: 1.75; opacity: .75; }
    .ai-editorial-points { display: grid; gap: 12px; align-content: center; }
    .ai-editorial-points span { padding: 12px 14px; border-radius: 12px; background: rgba(255,255,255,.06); color: rgba(255,255,255,.82); }

    .ai-explainer-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0,1fr));
      gap: 16px;
    }
    .ai-explainer-card {
      padding: 24px;
      border: 1px solid #e7e7ef;
      border-radius: 20px;
      background: #fff;
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .ai-explainer-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(30,25,70,.08); }
    .ai-explainer-icon { font-size: 30px; margin-bottom: 16px; }
    .ai-explainer-card h3 { margin: 0 0 9px; font-size: 19px; }
    .ai-explainer-card p { margin: 0 0 18px; line-height: 1.65; color: #626776; }
    .ai-explainer-card span { font-size: 12px; font-weight: 800; color: #6d28d9; }

    .ai-usecases-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 18px;
    }
    .ai-usecase-card {
      padding: 26px;
      border-radius: 22px;
      background: #fff;
      border: 1px solid #e5e7ef;
    }
    .ai-usecase-icon { font-size: 32px; margin-bottom: 14px; }
    .ai-usecase-card h3 { margin: 0 0 10px; font-size: 22px; }
    .ai-usecase-card p { color: #626776; line-height: 1.7; }
    .ai-usecase-workflow {
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid #ececf2;
      display: grid;
      gap: 5px;
    }
    .ai-usecase-workflow small { color: #7c3aed; font-weight: 900; letter-spacing: .1em; }
    .ai-usecase-workflow strong { font-size: 14px; }

    .prompt-lab-section {
      padding: 96px 0;
      background:
        radial-gradient(circle at 90% 10%, rgba(124,58,237,.18), transparent 35%),
        #111735;
      color: #fff;
    }
    .prompt-lab-header {
      display: flex;
      justify-content: space-between;
      gap: 30px;
      align-items: end;
      margin-bottom: 28px;
    }
    .prompt-lab-header p { color: rgba(255,255,255,.68); }
    .prompt-lab-badge {
      flex: 0 0 190px;
      padding: 18px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.05);
      display: grid;
      gap: 5px;
    }
    .prompt-lab-badge strong { font-size: 11px; letter-spacing: .12em; color: #d8b4fe; }
    .prompt-lab-badge span { opacity: .65; font-size: 13px; }

    .prompt-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 16px;
    }
    .prompt-card {
      padding: 22px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.05);
    }
    .prompt-card-head span { color: #d8b4fe; font-size: 11px; text-transform: uppercase; letter-spacing: .12em; font-weight: 900; }
    .prompt-card h3 { margin: 7px 0 12px; font-size: 20px; }
    .prompt-card p {
      margin: 0;
      color: rgba(255,255,255,.7);
      line-height: 1.65;
      font-size: 14px;
    }
    .prompt-card button {
      margin-top: 18px;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 10px;
      background: rgba(255,255,255,.07);
      color: #fff;
      padding: 9px 12px;
      cursor: pointer;
      font-weight: 700;
    }
    .prompt-method {
      margin-top: 22px;
      padding: 26px;
      border-radius: 20px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.1);
    }
    .prompt-method h3 { margin: 0 0 16px; }
    .prompt-formula { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .prompt-formula span { padding: 9px 12px; border-radius: 999px; background: rgba(255,255,255,.08); }
    .prompt-formula b { opacity: .45; }
    .prompt-method p { margin: 17px 0 0; opacity: .68; line-height: 1.7; }

    .ai-discovery-steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 16px;
    }
    .ai-discovery-steps > div {
      padding: 24px;
      border: 1px solid #e6e6ee;
      border-radius: 20px;
      background: #fafaff;
    }
    .ai-discovery-steps span {
      display: inline-flex;
      width: 38px;
      height: 38px;
      border-radius: 12px;
      align-items: center;
      justify-content: center;
      background: #eee8ff;
      color: #6d28d9;
      font-weight: 900;
      margin-bottom: 16px;
    }
    .ai-discovery-steps h3 { margin: 0 0 8px; }
    .ai-discovery-steps p { margin: 0; color: #656a78; line-height: 1.65; }

    .ai-update-desk-section {
      padding: 84px 0 96px;
      background: #f5f3ff;
    }
    .ai-update-desk {
      display: grid;
      grid-template-columns: 1.3fr .7fr;
      gap: 24px;
      padding: 34px;
      border-radius: 26px;
      background: #fff;
      border: 1px solid #e4e0f1;
    }
    .ai-update-main p { max-width: 760px; color: #5f6472; line-height: 1.8; font-size: 17px; }
    .ai-update-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
    .ai-update-checklist {
      padding: 22px;
      border-radius: 18px;
      background: #f8f7fc;
      border: 1px solid #eceaf4;
      display: grid;
      gap: 11px;
      align-content: center;
    }
    .ai-update-checklist h3 { margin: 0 0 8px; }
    .ai-update-checklist div { color: #555b69; font-size: 14px; line-height: 1.5; }
    .ai-topic-strip {
      margin-top: 18px;
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
    }
    .ai-topic-strip span {
      padding: 8px 11px;
      border-radius: 999px;
      background: #fff;
      border: 1px solid #e4e0f1;
      color: #65606f;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .05em;
    }

    @media (max-width: 1050px) {
      .ai-news-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .ai-explainer-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
      .ai-trend-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .ai-usecases-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .prompt-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .ai-discovery-steps { grid-template-columns: repeat(2, minmax(0,1fr)); }
    }

    @media (max-width: 760px) {
      .ai-newsroom-section,
      .ai-brief-section,
      .ai-explainer-section,
      .ai-usecases-section,
      .prompt-lab-section,
      .ai-discovery-section { padding: 68px 0; }
      .ai-update-desk-section { padding: 60px 0 70px; }
      .ai-newsroom-hero,
      .ai-editorial-callout,
      .ai-update-desk { grid-template-columns: 1fr; }
      .ai-news-grid,
      .ai-trend-grid,
      .ai-explainer-grid,
      .ai-usecases-grid,
      .prompt-grid,
      .ai-discovery-steps { grid-template-columns: 1fr; }
      .prompt-lab-header { flex-direction: column; align-items: flex-start; }
      .prompt-lab-badge { width: 100%; box-sizing: border-box; }
      .ai-news-actions { align-items: flex-start; flex-direction: column; }
      .ai-newsroom-date { width: auto; }
    }
    @media (max-width: 900px) {
      .ai-news-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .ai-news-grid {
        grid-template-columns: 1fr;
      }
      .ai-news-image-wrap {
        margin: -4px -4px 18px;
      }
    }
  `}</style>
);

/* =========================================================
   TOOL CARD
   ========================================================= */


export default App;
