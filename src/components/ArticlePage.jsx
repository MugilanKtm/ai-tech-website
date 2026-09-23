import { Fragment, memo } from "react";
import articles from "../data/articles";

function ArticlePage({
  article,
  goHome,
  openArticles,
  openArticle,
}) {
  const sections = Array.isArray(article.content)
    ? article.content
    : [];

  const tocSections = sections.filter(
    (section) => section?.heading
  );

  const firstParagraph =
    sections.find(
      (section) =>
        Array.isArray(section?.paragraphs) &&
        section.paragraphs.length > 0
    )?.paragraphs?.[0] || "";

  const relatedArticles = articles
    .filter((item) => item.id !== article.id)
    .filter(
      (item) =>
        item.category === article.category ||
        article.category === "AI"
    )
    .slice(0, 3);

  const contextualLinks = (() => {
    const title = `${article.title || ""} ${article.excerpt || ""}`.toLowerCase();
    const rules = [
      {
        terms: ["chatgpt", "gemini", "claude", "ai assistant"],
        keywords: ["chatgpt", "gemini", "claude"],
      },
      {
        terms: ["image", "midjourney", "ideogram", "ai images"],
        keywords: ["image", "midjourney", "ideogram"],
      },
      {
        terms: ["video", "runway", "kling", "pika"],
        keywords: ["video", "runway", "kling", "pika"],
      },
      {
        terms: ["laptop", "ram", "windows 11"],
        keywords: ["laptop", "ram", "windows 11"],
      },
      {
        terms: ["youtube", "youtuber", "creator"],
        keywords: ["youtube", "youtuber", "creator"],
      },
    ];

    const matched = rules.find((rule) =>
      rule.terms.some((term) => title.includes(term))
    );

    if (!matched) return [];

    return articles
      .filter((item) => item.id !== article.id)
      .filter((item) => {
        const text = `${item.title || ""} ${item.excerpt || ""}`.toLowerCase();
        return matched.keywords.some((keyword) => text.includes(keyword));
      })
      .slice(0, 2);
  })();

  const scrollToSection = (index) => {
    document
      .getElementById(`article-section-${index}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <div className="article-page">
      <header className="navbar">
        <div className="nav-container">
          <button className="logo" onClick={goHome}>
            <span className="logo-icon">AI</span>
            <span>AI TechSphere</span>
          </button>

          <nav className="nav-links">
            <button onClick={goHome}>Home</button>
            <button onClick={() => openArticles("All")}>
              Articles
            </button>
            <button onClick={() => openArticles("How-To")}>
              How-To
            </button>
          </nav>

          <button className="nav-button" onClick={goHome}>
            Back Home
          </button>
        </div>
      </header>

      <main className="single-article">
        <div className="section-container">
          <nav className="article-breadcrumbs" aria-label="Breadcrumb">
  <button type="button" onClick={goHome}>
    AI TechSphere
  </button>
  <span>›</span>
  <button type="button" onClick={() => openArticles("All")}>
    Articles
  </button>
  <span>›</span>
  <span className="article-breadcrumb-current">
    {article.title}
  </span>
</nav>
          <button
            className="back-button"
            onClick={() => openArticles("All")}
          >
            ← Back to Articles
          </button>

          <div className="single-article-header premium-article-header">
            <div className="article-header-topline">
              <span className="article-category">
                {article.category}
              </span>
              <span className="article-updated-badge">✦ Updated for 2026</span>
            </div>

            <h1>{article.title}</h1>

            <p className="article-header-excerpt">{article.excerpt}</p>

            <div className="article-meta premium-article-meta">
              <span className="article-author">✍️ {article.author || "AI TechSphere Editorial Team"}</span>
              <span>•</span>
              <span>📅 Published {article.date || "2026"}</span>
              {article.readTime && (
                <>
                  <span>•</span>
                  <span>⏱️ {article.readTime}</span>
                </>
              )}
            </div>

            <div className="article-editorial-note">
              <strong>Editorial note</strong>
              <span>
                We aim to keep this guide practical and useful. Product features, pricing and availability can change, so check the official provider for the latest details.
              </span>
            </div>

            <div className="article-share-row">
              <span>Share this guide</span>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: article.title, url: window.location.href });
                  } else {
                    navigator.clipboard?.writeText(window.location.href);
                  }
                }}
              >
                ↗ Share
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                }}
              >
                🔗 Copy link
              </button>
            </div>
          </div>

          {article.image && (
            <div className="single-article-image">
              <img
                src={article.image}
                alt={article.title}
                width="1200"
                height="675"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          )}

          <div className="article-layout">
            <aside className="article-sidebar">
              <div className="article-sidebar-card">
                <h3>📑 In this article</h3>
                <div className="article-toc">
                  {tocSections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(index)}
                    >
                      {section.heading.replace(/^\d+\.\s*/, "")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="article-sidebar-card article-ad-box">
                <span>ADVERTISEMENT</span>
                <div>Ad space</div>
                <small>
                  Future space for relevant advertising.
                </small>
              </div>
            </aside>

            <article className="article-content">
              <div className="article-key-takeaway">
                <div className="article-key-icon">💡</div>
                <div>
                  <strong>Key takeaway</strong>
                  <p>
                    {firstParagraph ||
                      "Explore the guide below for practical information and recommendations."}
                  </p>
                </div>
              </div>

              {sections.map((section, index) => (
                <Fragment key={index}>
                <section
                  id={`article-section-${index}`}
                  className="article-content-section"
                >
                  {section.heading && <h2>{section.heading}</h2>}

                  {Array.isArray(section.paragraphs) &&
                    section.paragraphs.map(
                      (paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      )
                    )}

                  {section.tool && (
                    <div className="article-tool-card">
                      <div className="article-tool-top">
                        <span className="article-tool-number">
                          {section.tool.number}
                        </span>
                        <div>
                          <span className="article-tool-label">
                            {section.tool.category}
                          </span>
                          <h3>{section.tool.name}</h3>
                        </div>
                      </div>

                      {section.tool.rating && (
                        <div className="article-tool-rating">
                          <span className="rating-label">AI TechSphere rating</span>
                          <span className="rating-stars" aria-label={`${section.tool.rating} out of 5`}>
                            {"★".repeat(Math.round(section.tool.rating))}
                            {"☆".repeat(5 - Math.round(section.tool.rating))}
                          </span>
                          <strong>{section.tool.rating}/5</strong>
                        </div>
                      )}

                      {section.tool.bestFor && (
                        <div className="article-best-for">
                          <strong>Best for:</strong>{" "}
                          {section.tool.bestFor}
                        </div>
                      )}

                      {section.tool.useCases && (
                        <p>
                          <strong>Useful for:</strong>{" "}
                          {section.tool.useCases}
                        </p>
                      )}

                      <div className="article-tool-bottom">
                        <span className="article-pricing">
                          {section.tool.pricing}
                        </span>
                        <button
                          className="article-tool-button"
                          onClick={() =>
                            window.open(
                              section.tool.url,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          Visit Official Site ↗
                        </button>
                      </div>

                      <div className="article-pros-cons">
                        <div>
                          <strong>✓ Pros</strong>
                          <ul>
                            {(section.tool.pros || []).map(
                              (item, i) => (
                                <li key={i}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <strong>− Considerations</strong>
                          <ul>
                            {(section.tool.cons || []).map(
                              (item, i) => (
                                <li key={i}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.image && (
                    <figure className="article-inline-image">
                      <img
                        src={section.image}
                        alt={section.imageAlt || section.heading || article.title}
                        loading="lazy"
                        decoding="async"
                        width="1200"
                        height="675"
                      />
                      {section.imageCaption && (
                        <figcaption>
                          {section.imageCaption}
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {section.callout && (
                    <div className="article-callout">
                      <strong>{section.callout.title}</strong>
                      <p>{section.callout.text}</p>
                    </div>
                  )}

                  {section.table && (
                    <div className="article-table-wrap">
                      <table className="article-table">
                        <thead>
                          <tr>
                            {section.table.headers.map((header, i) => (
                              <th key={i}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, i) => (
                            <tr key={i}>
                              {row.map((cell, j) => (
                                <td key={j}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {index === 1 && contextualLinks.length > 0 && (
                  <div className="article-inline-links">
                    <div className="section-label">
                      <span></span>
                      RELATED GUIDES
                    </div>
                    <h3>Keep exploring AI TechSphere</h3>
                    <p>Useful guides related to this topic:</p>
                    <div className="article-inline-links-grid">
                      {contextualLinks.map((item) => (
                        <a
                          key={item.id}
                          href={`?article=${encodeURIComponent(
                            item.slug ||
                              item.title
                                ?.toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")
                          )}`}
                          onClick={(event) => {
                            event.preventDefault();
                            openArticle(item);
                          }}
                        >
                          <span>{item.category}</span>
                          <strong>{item.title}</strong>
                          <small>Read guide →</small>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                </Fragment>
              ))}

              <div className="article-action-box">
                <h3>👍 Was this guide useful?</h3>
                <p>
                  Save AI TechSphere and come back for more
                  practical AI and technology guides.
                </p>
                <button
                  className="primary-button"
                  onClick={() => openArticles("All")}
                >
                  Explore More Articles →
                </button>
              </div>

              <div className="article-faq">
                <div className="section-label">
                  <span></span>
                  QUICK FAQ
                </div>

                <h2>Frequently Asked Questions</h2>

                <details>
                  <summary>
                    Is this information useful for beginners?
                  </summary>
                  <p>
                    Yes. The articles are written in practical
                    language and aim to make technology easier
                    to understand.
                  </p>
                </details>

                <details>
                  <summary>
                    Should I use every tool mentioned?
                  </summary>
                  <p>
                    No. Choose tools and recommendations that
                    match your needs, budget and workflow.
                  </p>
                </details>

                <details>
                  <summary>
                    Where can I check the latest information?
                  </summary>
                  <p>
                    For features, pricing and availability,
                    always check the official product website.
                  </p>
                </details>
              </div>

              {relatedArticles.length > 0 && (
                <div className="related-articles">
                  <div className="section-label">
                    <span></span>
                    KEEP READING
                  </div>

                  <h2>Related Articles</h2>

                  <div className="related-article-grid">
                    {relatedArticles.map((item) => (
                      <a
                        key={item.id}
                        className="related-article-card"
                        href={`?article=${encodeURIComponent(
                          item.slug ||
                            item.title
                              ?.toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, "")
                        )}`}
                        onClick={(event) => {
                          event.preventDefault();
                          openArticle(item);
                        }}
                      >
                        <span>{item.category}</span>
                        <h3>{item.title}</h3>
                        <p>{item.excerpt}</p>
                        <strong>Read Article →</strong>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(ArticlePage);
