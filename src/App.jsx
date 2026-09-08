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
  const initialArticleSlug = new URLSearchParams(window.location.search).get("article");
  const initialArticle = articles.find(
    (item) => createArticleSlug(item) === initialArticleSlug
  ) || null;

  const [selectedArticle, setSelectedArticle] = useState(initialArticle);
  const [showTools, setShowTools] = useState(false);

  const [toolCategory, setToolCategory] = useState("All");
  const [toolSearch, setToolSearch] = useState("");

  const [articleCategory, setArticleCategory] = useState("All");
  const [articleSearch, setArticleSearch] = useState("");

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  /* =======================================================
     SEO / META TAGS
     ======================================================= */

  useEffect(() => {
    const article = selectedArticle;
    const slug = article ? createArticleSlug(article) : null;
    const pageTitle = article
      ? `${article.title} | ${SITE_NAME}`
      : `${SITE_NAME} — AI Tools, Guides & Tech Reviews`;
    const description = article?.excerpt || SITE_DESCRIPTION;
    const canonicalUrl = article
      ? `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(slug)}`
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

    const schema = article
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description,
          image: article.image ? [article.image] : undefined,
          datePublished: article.date,
          dateModified: article.date,
          author: {
            "@type": "Organization",
            name: article.author || SITE_NAME,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
          },
          mainEntityOfPage: canonicalUrl,
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: `${window.location.origin}${window.location.pathname}`,
        };

    upsertStructuredData(schema);
  }, [selectedArticle]);

  useEffect(() => {
    const handlePopState = () => {
      const slug = new URLSearchParams(window.location.search).get("article");
      const article = articles.find(
        (item) => createArticleSlug(item) === slug
      ) || null;
      setSelectedArticle(article);
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
    setShowTools(false);

    window.history.pushState({}, "", window.location.pathname);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openTools = (category = "All") => {
    setSelectedArticle(null);
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
    setShowTools(false);

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
            🚀 AI & Tech Discovery Platform
          </div>

          <h1>
            Discover the{" "}
            <span className="gradient-text">
              Future of AI
            </span>
          </h1>

          <p>
            Explore the best AI tools, technology guides,
            reviews, tutorials and the latest trends —
            all in one place.
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
              <strong>50+</strong>
              <span>Guides</span>
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
            placeholder="Search AI tools, articles and guides..."
            value={articleSearch}
            onChange={(e) => {
              setArticleSearch(e.target.value);
              setArticleCategory("All");
            }}
          />

          <button
            onClick={() => openTools("All")}
          >
            Search Tools
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

            <div className="featured-card">

              <div className="featured-content">

                <span className="article-category">
                  {articles[0].category}
                </span>

                <h2>
                  {articles[0].title}
                </h2>

                <p>
                  {articles[0].excerpt}
                </p>

                <button
                  className="read-button"
                  onClick={() =>
                    openArticle(articles[0])
                  }
                >
                  Read Full Article →
                </button>

              </div>

              <div className="featured-visual">

                <div className="featured-orb">
                  AI
                </div>

              </div>

            </div>

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
                Learn. Explore. Build.
              </h2>

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

            {filteredArticles.map((article) => (

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

      {/* REVIEWS */}

      <section className="reviews-section">

        <div className="section-container">

          <div className="section-heading centered">

            <div>

              <div className="section-label centered-label">
                <span></span>
                COMMUNITY
                <span></span>
              </div>

              <h2>
                What Readers Say
              </h2>

            </div>

          </div>

          <div className="reviews-grid">

            <div className="review-card">

              <div className="stars">
                ★★★★★
              </div>

              <p>
                "The AI tool guides make it
                much easier to choose the
                right tools."
              </p>

              <strong>
                — Tech Creator
              </strong>

            </div>

            <div className="review-card">

              <div className="stars">
                ★★★★★
              </div>

              <p>
                "Simple explanations and
                useful AI recommendations."
              </p>

              <strong>
                — Digital Marketer
              </strong>

            </div>

            <div className="review-card">

              <div className="stars">
                ★★★★★
              </div>

              <p>
                "A great place to discover
                new AI tools."
              </p>

              <strong>
                — Content Creator
              </strong>

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
                Get the latest AI & Tech updates.
              </h2>

              <p>
                New tools, useful guides and important
                technology news delivered to your inbox.
              </p>

            </div>

            {!subscribed ? (

              <form
                className="newsletter-form"
                onSubmit={handleSubscribe}
              >

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

                <button type="submit">
                  Subscribe
                </button>

              </form>

            ) : (

              <div className="subscribe-success">
                ✅ Thanks for subscribing!
              </div>

            )}

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
