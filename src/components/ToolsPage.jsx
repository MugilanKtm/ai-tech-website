import { memo } from "react";
import ToolCard from "./ToolCard";

function ToolsPage({
  tools,
  toolCategories,
  toolCategory,
  setToolCategory,
  toolSearch,
  setToolSearch,
  goHome,
}) {
  return (
    <div className="tools-page">

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

            <button className="active">
              AI Tools
            </button>

            <button onClick={goHome}>
              Articles
            </button>

          </nav>

          <button
            className="nav-button"
            onClick={goHome}
          >
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
              Find the right{" "}
              <span className="gradient-text">
                AI tool
              </span>
            </h1>

            <p>
              Explore AI tools for chat, images,
              video, writing, audio and productivity.
            </p>

            <div className="tools-search">

              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder="Search AI tools..."
                value={toolSearch}
                onChange={(e) =>
                  setToolSearch(e.target.value)
                }
              />

            </div>

          </div>

        </section>

        <section className="tools-list-section">

          <div className="section-container">

            <div className="tool-category-tabs">

              {toolCategories.map((category) => (

                <button
                  key={category}
                  className={
                    toolCategory === category
                      ? "tool-category active"
                      : "tool-category"
                  }
                  onClick={() =>
                    setToolCategory(category)
                  }
                >
                  {category}
                </button>

              ))}

            </div>

            <div className="tools-result-header">

              <h2>
                {toolCategory === "All"
                  ? "All AI Tools"
                  : toolCategory}
              </h2>

              <span>
                {tools.length} tools
              </span>

            </div>

            <div className="tool-directory-grid">

              {tools.map((tool) => (

                <div
                  className="directory-card"
                  key={tool.id}
                >

                  <div
                    className={`directory-icon ${tool.color}`}
                  >
                    {tool.icon}
                  </div>

                  <div className="directory-info">

                    <span className="directory-category">
                      {tool.category}
                    </span>

                    <h3>
                      {tool.name}
                    </h3>

                    <p>
                      {tool.description}
                    </p>

                    <span className="pricing">
                      {tool.pricing}
                    </span>

                  </div>

                  <div className="directory-actions">

                    <button
                      className="visit-tool"
                      onClick={() => {
                        window.open(
                          tool.url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                    >
                      Visit Tool
                      <span>
                        ↗
                      </span>
                    </button>

                    <button
                      className="tool-review"
                      onClick={() =>
                        alert(
                          `${tool.name} review page will be added here.`
                        )
                      }
                    >
                      Review
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {tools.length === 0 && (

              <div className="no-tools">

                <div>
                  🔍
                </div>

                <h3>
                  No AI tools found
                </h3>

                <p>
                  Try a different search term
                  or category.
                </p>

              </div>

            )}

          </div>

        </section>

        <section className="tools-cta">

          <div className="section-container">

            <div className="tools-cta-box">

              <h2>
                Can't find what you're looking for?
              </h2>

              <p>
                We're continuously adding new
                AI tools to the directory.
              </p>

              <button
                className="primary-button"
                onClick={goHome}
              >
                Back to AI TechSphere
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default memo(ToolsPage);
