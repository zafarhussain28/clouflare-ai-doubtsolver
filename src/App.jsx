import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowUp } from 'lucide-react';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import ImageUploader from './components/ImageUploader.jsx';
import LoadingState from './components/LoadingState.jsx';
import Navbar from './components/Navbar.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import { useStemSolver } from './hooks/useStemSolver.js';
import { validateImageFile } from './utils/imageUtils.js';

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('stem-solver-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [notice, setNotice] = useState('');
  const uploadRef = useRef(null);
  const { solve, cancel, clear, result, error, loading } = useStemSolver();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('stem-solver-theme', theme);
    } catch {
      // Theme selection still works when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleFile = (file) => {
    setUploadError('');
    if (!file) return;
    const validationMessage = validateImageFile(file);
    if (validationMessage) {
      setSelectedFile(null);
      setUploadError(validationMessage);
      return;
    }
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setUploadError('Choose an image of a question before analyzing.');
      return;
    }
    await solve(selectedFile);
  };

  const handleCopy = async (label, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(`${label} copied`);
    } catch {
      setNotice('Clipboard access is unavailable in this browser');
    }
  };

  const handleAnother = () => {
    clear();
    setSelectedFile(null);
    setUploadError('');
    uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="app-shell min-h-screen" id="home">
      <Navbar theme={theme} onThemeChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      <main>
        <section className="hero-section page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <Hero />
          </div>
          <div className="solver-column" ref={uploadRef}>
            <ImageUploader
              file={selectedFile}
              onFileSelect={handleFile}
              error={uploadError}
              disabled={loading}
            />
            {error && (
              <div className="error-banner" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}
            {loading ? (
              <LoadingState onCancel={cancel} />
            ) : (
              <button
                className="analyze-button flex w-full items-center justify-center gap-2"
                type="button"
                onClick={handleAnalyze}
                disabled={!selectedFile}
              >
                Analyze question <ArrowUp size={17} aria-hidden="true" />
              </button>
            )}
            {!loading && (
              <p className="privacy-note">Your image is sent securely for analysis and is not stored by this page.</p>
            )}
          </div>
        </section>

        {result && (
          <ResultsDashboard
            result={result}
            onCopy={handleCopy}
            onAnalyzeAnother={handleAnother}
          />
        )}

        <section className="how-section" id="how-it-works">
          <div className="page-width how-inner">
            <div className="section-heading">
              <span className="eyebrow">A clearer way through</span>
              <h2>From a question photo to a worked solution.</h2>
            </div>
            <div className="how-steps">
              <article className="how-step">
                <span className="step-number">01</span>
                <h3>Share the question</h3>
                <p>Upload a clear photo of the problem, including any diagrams or equations.</p>
              </article>
              <article className="how-step">
                <span className="step-number">02</span>
                <h3>Read it closely</h3>
                <p>Vision AI extracts the text and mathematical notation from your image.</p>
              </article>
              <article className="how-step">
                <span className="step-number">03</span>
                <h3>Understand each step</h3>
                <p>Get a structured solution with the reasoning and final answer together.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

export default App;