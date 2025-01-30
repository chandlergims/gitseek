import './DocsPage.css';

function DocsPage() {
  return (
    <div className="docs">
      <section className="docs-header">
        <h1>Documentation</h1>
        <p>Learn how GitSeek analyzes repositories to detect LARPs</p>
      </section>

      <section className="docs-content">
        <div className="docs-section">
          <h2>How It Works</h2>
          <p>GitSeek uses advanced AI models to analyze GitHub repositories and determine their authenticity. Our comprehensive analysis includes:</p>
          <ul>
            <li><strong>Repository Structure Analysis:</strong> Evaluating project organization, file hierarchy, and codebase architecture</li>
            <li><strong>Code Quality Assessment:</strong> Examining code patterns, best practices, and implementation details</li>
            <li><strong>Commit History Evaluation:</strong> Analyzing development timeline, contributor patterns, and commit authenticity</li>
            <li><strong>Documentation Review:</strong> Assessing completeness, accuracy, and consistency of documentation</li>
            <li><strong>Development Patterns Analysis:</strong> Identifying genuine development practices versus artificial patterns</li>
          </ul>
        </div>

        <div className="docs-section">
          <h2>Free Access & Token Benefits</h2>
          <p>GitSeek is committed to providing free access to essential repository analysis tools for everyone. Our platform operates on a dual model:</p>
          
          <h3>Free Features</h3>
          <ul>
            <li>Basic repository analysis with both GPT-4 and Deepseek models</li>
            <li>Standard confidence scoring and verdicts</li>
            <li>Basic pattern detection and analysis reports</li>
            <li>Community access and basic support</li>
          </ul>

          <h3>Token Holder Exclusive Benefits</h3>
          <ul>
            <li><strong>Priority Analysis:</strong> Fast-track queue for repository analysis</li>
            <li><strong>Advanced Metrics:</strong> Detailed technical metrics and in-depth pattern analysis</li>
            <li><strong>Custom Parameters:</strong> Adjustable analysis settings and custom filtering options</li>
            <li><strong>Early Access:</strong> Preview and beta testing of new AI models and features</li>
            <li><strong>Governance Rights:</strong> Participate in platform development decisions and feature voting</li>
          </ul>
        </div>

        <div className="docs-section">
          <h2>Getting Started</h2>
          <ol>
            <li>Navigate to the Launch App page</li>
            <li>Enter a GitHub repository URL</li>
            <li>Choose between GPT-4 or Deepseek model</li>
            <li>Click Analyze to start the process</li>
            <li>Review the detailed analysis results</li>
          </ol>
          <p className="note">No account required for basic analysis. Token holder features require wallet connection.</p>
        </div>

        <div className="docs-section">
          <h2>Understanding Results</h2>
          <p>Each analysis provides comprehensive insights:</p>
          <ul>
            <li><strong>Verdict:</strong> Clear LARP or GENUINE classification</li>
            <li><strong>Confidence Score:</strong> Numerical rating with confidence level explanation</li>
            <li><strong>Detailed Analysis:</strong> In-depth explanation of findings and reasoning</li>
            <li><strong>Evidence:</strong> Specific code examples and pattern documentation</li>
            <li><strong>Recommendations:</strong> Suggestions for verification or further investigation</li>
          </ul>
        </div>

        <div className="docs-section">
          <h2>Community & Development</h2>
          <p>GitSeek is built with community involvement at its core:</p>
          <ul>
            <li>Open feedback channels for continuous improvement</li>
            <li>Regular updates based on user suggestions</li>
            <li>Transparent development roadmap</li>
            <li>Active community engagement in feature prioritization</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default DocsPage;
