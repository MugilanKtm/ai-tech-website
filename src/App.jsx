import { useEffect, useMemo, useState } from "react";
import articles from "./data/articles";
import aiTools from "./data/aiTools";
import ToolsPage from "./components/ToolsPage";
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
  "Explore the best AI tools, technology guides, tutorials, reviews and practical AI tips.";

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

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
      : `${SITE_NAME} — AI Tools, Guides & Tech Reviews`;
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

  /* =======================================================
     NAVIGATION
     ======================================================= */

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

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
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
      <div className="app">
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
            ← Back to AI TechSphere
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
              <span>© 2026 AI TechSphere. All rights reserved.</span>
              <span>Built for the AI generation 🚀</span>
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
      <ToolsPage
        tools={filteredTools}
        toolCategories={toolCategories}
        toolCategory={toolCategory}
        setToolCategory={setToolCategory}
        toolSearch={toolSearch}
        setToolSearch={setToolSearch}
        goHome={goHome}
      />
    );
  }

  /* =======================================================
     HOME PAGE
     ======================================================= */

  return (
    <div className="app">

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
            🚀 AI tools, guides & practical tech
          </div>

          <h1>
            Discover the{" "}
            <span className="gradient-text">
              Future of AI
            </span>
          </h1>

          <p>
            Find useful AI tools, practical guides, honest comparisons and
            creator-friendly tutorials — all in one place.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={() => openTools("All")}
            >
              Explore AI Tools →
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

      {/* SEARCH */}

      <section className="search-section">

        <div className="search-box">

          <span>🔍</span>

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
                    ✦ Editor's Pick
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
                  <span>📖 Practical guide</span>
                  {articles[0].readTime && (
                    <span>• {articles[0].readTime}</span>
                  )}
                </div>

                <button
                  className="read-button"
                  onClick={() =>
                    openArticle(articles[0])
                  }
                >
                  Read Full Article →
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
                      Featured guide ↗
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
              View All →
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
                    Read More →
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
              icon="💬"
              title="AI Chat"
              description="Chatbots, assistants and AI companions."
              color="purple"
              onClick={() =>
                openTools("AI Chat")
              }
            />

            <ToolCard
              icon="🎨"
              title="AI Images"
              description="Generate stunning images and artwork."
              color="pink"
              onClick={() =>
                openTools("AI Images")
              }
            />

            <ToolCard
              icon="🎬"
              title="AI Video"
              description="Create videos with generative AI."
              color="blue"
              onClick={() =>
                openTools("AI Video")
              }
            />

            <ToolCard
              icon="✍️"
              title="AI Writing"
              description="Write, edit and improve content."
              color="green"
              onClick={() =>
                openTools("AI Writing")
              }
            />

            <ToolCard
              icon="🔊"
              title="AI Audio"
              description="Generate voices, music and audio."
              color="orange"
              onClick={() =>
                openTools("AI Audio")
              }
            />

            <ToolCard
              icon="⚙️"
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
              Explore All AI Tools →
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
                🔎
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
                📚
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
                ⚡
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
                  ✦ Practical
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
                  ✓ Transparent
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
                  ↻ Updated
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
              <div className="stars">✦</div>
              <h3>Practical guides</h3>
              <p>
                Step-by-step explainers, workflows and comparisons designed around real tasks.
              </p>
            </div>

            <div className="review-card">
              <div className="stars">✓</div>
              <h3>Clear recommendations</h3>
              <p>
                We explain what a tool is useful for, who it may suit and what to check before using it.
              </p>
            </div>

            <div className="review-card">
              <div className="stars">↻</div>
              <h3>Useful over time</h3>
              <p>
                AI products change quickly, so our guides can be reviewed and updated as information evolves.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* NEWSLETTER */}

      <section className="newsletter-section">

        <div className="section-container">

          <div className="newsletter-box">

            <div>

              <div className="section-label">
                <span></span>
                STAY UPDATED
              </div>

              <h2>
                More AI & Tech guides are on the way.
              </h2>

              <p>
                We are building the newsletter experience. For now, explore the latest guides and AI tools on AI TechSphere.
              </p>

            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => openArticles("All")}
            >
              Browse Latest Articles →
            </button>

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
              © 2026 AI TechSphere.
              All rights reserved.
            </span>

            <span>
              Built for the AI generation 🚀
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

/* =========================================================
   TOOL CARD
   ========================================================= */


export default App;
