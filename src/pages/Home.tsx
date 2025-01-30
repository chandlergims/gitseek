import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="title">Seeking Truth in<br />GitHub Repositories</h1>
          <p className="subtitle">AI-Powered Analysis to Detect LARPs and Verify Authenticity</p>
          <div className="hero-buttons">
            <a href="https://x.com/GitSeek" className="button" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://github.com" className="button" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="/app" className="button primary">Launch App</a>
          </div>
        </div>
        <div className="video-placeholder">
          <video 
            className="placeholder-content"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <div className="tech-info">
        <div className="tech-cards">
          <div className="tech-card">
            <div className="card-header">
              <h3>1. GitHub Repository Analysis</h3>
            </div>
          <div className="info-block">
            <p>We perform a comprehensive analysis of GitHub repositories by gathering:</p>
            <ul>
              <li>Repository metadata and description</li>
              <li>Complete codebase and file structure</li>
              <li>Commit history and patterns</li>
              <li>Documentation and README files</li>
              <li>Development timeline and activity</li>
              <li>Contributor information and patterns</li>
            </ul>
            <p>This data provides a complete picture of the repository's development history and authenticity indicators.</p>
          </div>
        </div>
        <div className="tech-card">
          <div className="card-header">
            <h3>2. AI-Powered LARP Detection</h3>
          </div>
          <div className="info-block">
            <p>Our AI models analyze the repository data through multiple lenses:</p>
            <ul>
              <li>Code quality and consistency analysis</li>
              <li>Development pattern recognition</li>
              <li>Technical depth evaluation</li>
              <li>Documentation authenticity checks</li>
              <li>Commit pattern analysis</li>
            </ul>
            <p>Choose between GPT-4 or Deepseek models for detailed analysis with confidence scores and comprehensive explanations.</p>
          </div>
        </div>
        <div className="tech-card">
          <div className="card-header">
            <h3>3. Supported Models</h3>
          </div>
          <div className="models-block">
            <div className="model-item">
              <img src="/openai.png" alt="GPT-4" className="model-logo" />
              <h4>GPT-4</h4>
            </div>
            <div className="model-item">
              <img src="/deepseek.png" alt="Deepseek" className="model-logo" />
              <h4>Deepseek</h4>
            </div>
          </div>
        </div>

          </div>
        </div>
      </div>
  );
}

export default Home;
