function ToolsPage({
  tools,
  toolCategories,
  toolCategory,
  setToolCategory,
  toolSearch,
  setToolSearch,
  goHome,
}) {
  const hasSearch = toolSearch.trim().length > 0;

  return (
    <div className="tools-page">
      <header className="navbar">
        <div className="nav-container">
          <button className="logo" onClick={goHome} aria-label="Go to AI TechSphere home">
            <span className="logo-icon">AI</span>
            <span>TechSphere</span>
          </button>

          <nav className="nav-links" aria-label="Main navigation">
            <button onClick={goHome}>Home</button>
            <button className="active" aria-current="page">AI Tools</button>
            <button onClick={() => goHome()}>Articles</button>
          </nav>

          <button className="nav-button" onClick={goHome}>
            Back Home
          </button>
        </div>
      </header>

      <main className="tools-directory">
        <section className="tools-hero">
          <div className="section-container">
            <div className="section-label">
              <span></span>
              AI TOOL DIRECTORY
            </div>

            <h1>
              Find the right <span className="gradient-text">AI tool</span>
            </h1>

            <p>
              Discover useful AI tools for chat, images, video, writing, audio
              and productivity — with simple descriptions so you can compare
              your options quickly.
            </p>

            <div className="tools-search" role="search">
              <span aria-hidden="true">🔍</span>
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
                  style={{
                    border: 0,
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "18px",
                    opacity: 0.65,
                    padding: "4px 8px",
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "18px",
                color: "rgba(255,255,255,0.72)",
                fontSize: "14px",
              }}
            >
              <span>✓ Curated categories</span>
              <span>✓ Official tool links</span>
              <span>✓ Free & paid options</span>
            </div>
          </div>
        </section>

        <section className="tools-list-section">
          <div className="section-container">
            <div
              className="tool-category-tabs"
              aria-label="AI tool categories"
            >
              {toolCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    toolCategory === category
                      ? "tool-category active"
                      : "tool-category"
                  }
                  onClick={() => setToolCategory(category)}
                  aria-pressed={toolCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="tools-result-header">
              <div>
                <div className="section-label" style={{ marginBottom: "8px" }}>
                  <span></span>
                  DIRECTORY
                </div>
                <h2>
                  {toolCategory === "All" ? "All AI Tools" : toolCategory}
                </h2>
              </div>
              <span>
                {tools.length} {tools.length === 1 ? "tool" : "tools"}
              </span>
            </div>

            <div className="tool-directory-grid">
              {tools.map((tool) => {
                const destination = tool.affiliateUrl || tool.url;
                const isAffiliate = Boolean(tool.affiliateUrl);

                return (
                  <article className="directory-card" key={tool.id}>
                    <div
                      className={`directory-icon ${tool.color || ""}`}
                      aria-hidden="true"
                    >
                      {tool.icon}
                    </div>

                    <div className="directory-info">
                      <span className="directory-category">
                        {tool.category}
                      </span>

                      <h3>{tool.name}</h3>

                      <p>{tool.description}</p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginTop: "auto",
                        }}
                      >
                        <span className="pricing">{tool.pricing}</span>
                        {isAffiliate && (
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              opacity: 0.55,
                            }}
                          >
                            Affiliate link
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="directory-actions">
                      <a
                        className="visit-tool"
                        href={destination}
                        target="_blank"
                        rel={
                          isAffiliate
                            ? "sponsored noopener noreferrer"
                            : "noopener noreferrer"
                        }
                        aria-label={`${
                          isAffiliate
                            ? tool.affiliateLabel || `Try ${tool.name}`
                            : `Visit ${tool.name}`
                        } opens in a new tab`}
                      >
                        {isAffiliate
                          ? tool.affiliateLabel || `Try ${tool.name} →`
                          : "Visit Tool"}
                        <span>↗</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {tools.length === 0 && (
              <div className="no-tools">
                <div>🔎</div>
                <h3>No AI tools found</h3>
                <p>
                  {hasSearch
                    ? `We couldn't find a tool matching “${toolSearch}”.`
                    : "Try another category."}
                </p>
                {(hasSearch || toolCategory !== "All") && (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                      setToolSearch("");
                      setToolCategory("All");
                    }}
                  >
                    Show All Tools
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="tools-cta">
          <div className="section-container">
            <div className="tools-cta-box">
              <div className="section-label centered-label">
                <span></span>
                KEEP EXPLORING
                <span></span>
              </div>

              <h2>More AI tools are on the way.</h2>
              <p>
                AI changes quickly. We’re building this directory around useful
                tools that can help you create, work, learn and automate.
              </p>

              <button className="primary-button" onClick={goHome}>
                Explore AI TechSphere →
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ToolsPage;
