import { useState } from "react";
import "./App.css";
import Workspace from "./components/workspace";

function App() {
  const [developerOpen, setDeveloperOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  return (
    <div className="app">

      {/* Background stars */}
      <div className="stars stars-1"></div>
      <div className="stars stars-2"></div>
      <div className="stars stars-3"></div>

      {/* Navigation */}
      <header className="navbar">

        <div className="logo">
          OMNILEARN
        </div>

        <nav className="nav-links">
          <a href="#features">FEATURES</a>
          <a href="#workspace">WORKSPACE</a>
          <a href="#about">ABOUT</a>
        </nav>

        {/* Developer */}
        <div className="developer-wrapper">

          <button
            className="developer-button"
            onClick={() => setDeveloperOpen(!developerOpen)}
            aria-label="Developer information"
          >
            <span className="developer-icon">⌘</span>
          </button>

          {developerOpen && (
            <div className="developer-card">

              <div className="developer-card-header">
                <div className="profile-icon">
                  K
                </div>

                <div>
                  <p className="developer-label">DEVELOPER</p>
                  <h3>Nazreen Imam</h3>
                </div>
              </div>

              <p className="developer-role">
                Computer Science & Engineering
              </p>

              <div className="developer-links">

                <a
                  href="https://www.linkedin.com/in/nazreen-imam-7a9430318/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>in</span>
                  LinkedIn
                </a>

                <a
                  href="https://github.com/nazreenimam01"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>◉</span>
                  GitHub
                </a>

              </div>

            </div>
          )}

        </div>

      </header>


      {/* Main Hero */}
      <main className="hero">

        <div className="hero-content">

          <div className="eyebrow">
            AI-POWERED MULTILINGUAL LEARNING
          </div>

          <h1>
            Learn Smarter.
            <br />
            <span>In Your Language.</span>
          </h1>

          <p className="hero-description">
            OmniLearn is your intelligent multilingual study assistant.
            Simplify complex documents, generate quizzes and flashcards,
            ask questions, and learn through voice — all in the language
            you prefer.
          </p>


          <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={() => {
                  setWorkspaceOpen(true);

                  setTimeout(() => {
                    document
                      .getElementById("workspace")
                      ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
              >
              START LEARNING
              <span>→</span>
            </button>

            <button
  className="secondary-button"
  onClick={() => {
    setWorkspaceOpen(true);

    setTimeout(() => {
      document
        .getElementById("workspace")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }}
>
  OPEN WORKSPACE
</button>

          </div>

        </div>

      </main>


      {/* Features */}
      <section className="features-section" id="features">

        <div className="section-heading">
          <p>WHAT OMNILEARN CAN DO</p>
          <h2>One workspace. Multiple ways to learn.</h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-number">01</div>
            <h3>Document Simplification</h3>
            <p>
              Turn complex study material and lengthy documents
              into simple, easy-to-understand explanations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">02</div>
            <h3>Quiz Generation</h3>
            <p>
              Automatically generate questions from your study
              material and test your understanding.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">03</div>
            <h3>Smart Flashcards</h3>
            <p>
              Convert important concepts into quick revision
              flashcards for efficient learning.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">04</div>
            <h3>Multilingual AI</h3>
            <p>
              Ask questions in your preferred language and receive
              understandable answers in the same language.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">05</div>
            <h3>Voice Learning</h3>
            <p>
              Speak naturally and interact with your AI study
              assistant using voice.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">06</div>
            <h3>RAG-Based Answers</h3>
            <p>
              Ask questions about uploaded documents and get answers
              based on relevant study material.
            </p>
          </div>

        </div>

      </section>


      {/* Workspace placeholder */}
      {/* Workspace */}
{/* Workspace */}

{workspaceOpen ? (
  <div id="workspace">

    <Workspace
      onClose={() => setWorkspaceOpen(false)}
    />

  </div>
) : (
  <section className="workspace-section" id="workspace">

    <div className="workspace-box">

      <div className="workspace-tag">
        YOUR STUDY SPACE
      </div>

      <h2>
        Everything you need
        <br />
        to <span>learn better.</span>
      </h2>

      <p>
        Upload your study material, ask questions,
        generate quizzes and flashcards, or interact
        with OmniLearn using your voice.
      </p>

      <button
        className="workspace-button"
        onClick={() => setWorkspaceOpen(true)}
      >
        ENTER WORKSPACE →
      </button>

    </div>

  </section>
)}


      {/* About */}
      <section className="about-section" id="about">

        <p className="section-small-title">
          ABOUT OMNILEARN
        </p>

        <h2>
          Learning should not be limited
          <br />
          by <span>language.</span>
        </h2>

        <p>
          OmniLearn combines artificial intelligence, multilingual
          processing, document understanding, retrieval-based
          question answering, and voice interaction to create
          a more accessible learning experience.
        </p>

      </section>


      {/* Footer */}
      <footer className="footer">

        <div className="footer-logo">
          OMNILEARN
        </div>

        <p>
          AI-powered multilingual learning assistant
        </p>

        <span>
          © 2026 OmniLearn
        </span>

      </footer>

    </div>
  );
}

export default App;