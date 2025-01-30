import { Link } from 'react-router-dom';
import './Layout.css';

function Layout({ className }: { className?: string }) {
  return (
    <header className={`header ${className || ''}`}>
      <div className="logo">
        <Link to="/">
          <img src="/logo.png" alt="GitSeek" width="32" height="32" />
          GitSeek
        </Link>
      </div>
      <nav className="nav">
          <Link to="/docs" className="button">Docs</Link>
          <a href="https://x.com/GitSeek" className="button" target="_blank" rel="noopener noreferrer">X</a>
        <a href="https://github.com" className="button" target="_blank" rel="noopener noreferrer">GitHub</a>
        <Link to="/app" className="button primary">Launch App</Link>
      </nav>
    </header>
  );
}

export default Layout;
