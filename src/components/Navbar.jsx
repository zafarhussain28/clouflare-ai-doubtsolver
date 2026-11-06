import { Atom, Github, Moon, Sun } from 'lucide-react';

function Navbar({ theme, onThemeChange }) {
  return (
    <header className="site-header">
      <nav className="page-width nav-inner flex items-center justify-between" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="STEM Solver AI home">
          <span className="brand-mark"><Atom size={21} strokeWidth={2.2} aria-hidden="true" /></span>
          <span>stem<span className="brand-light">solver</span><span className="brand-ai">.ai</span></span>
        </a>
        <div className="nav-links flex items-center gap-6">
          <a href="#home">Home</a>
          <a href="#how-it-works">How it works</a>
          <a href="#subjects">Subjects</a>
        </div>
        <div className="nav-actions flex items-center gap-4">
          <a className="github-link" href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={17} aria-hidden="true" /> <span>GitHub</span>
          </a>
          <button
            className="icon-button theme-button"
            type="button"
            onClick={onThemeChange}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;