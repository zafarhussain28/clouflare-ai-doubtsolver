import { useState } from 'react';
import { Check, ChevronDown, Copy, Download, FileText, RotateCcw } from 'lucide-react';
import SolutionRenderer from './SolutionRenderer.jsx';

function ResultsDashboard({ result, onCopy, onAnalyzeAnother }) {
  const [ocrOpen, setOcrOpen] = useState(false);

  const downloadSolution = () => {
    const blob = new Blob([result.solution], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stem-solution.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="results-section page-width" aria-labelledby="results-title">
      <div className="results-heading">
        <div>
          <span className="eyebrow"><span className="result-dot" /> Analysis complete</span>
          <h2 id="results-title">Here&apos;s the way through.</h2>
        </div>
        <button className="secondary-button another-button" type="button" onClick={onAnalyzeAnother}>
          <RotateCcw size={16} aria-hidden="true" /> Another question
        </button>
      </div>

      <article className="question-panel rounded-lg">
        <div className="panel-heading">
          <span className="panel-icon question-icon"><FileText size={17} aria-hidden="true" /></span>
          <div><span className="eyebrow">01 · Extracted question</span><h3>The question, as read</h3></div>
          <button className="text-action" type="button" onClick={() => onCopy('Question', result.clean_question)}>
            <Copy size={15} aria-hidden="true" /> Copy
          </button>
        </div>
        <div className="question-text">{result.clean_question}</div>
        <details className="ocr-details" open={ocrOpen} onToggle={(event) => setOcrOpen(event.currentTarget.open)}>
          <summary><span>Full OCR transcript</span><ChevronDown size={16} aria-hidden="true" /></summary>
          <pre>{result.ocr_full}</pre>
        </details>
      </article>

      <article className="solution-panel rounded-lg">
        <div className="panel-heading solution-heading">
          <span className="panel-icon solution-icon"><Check size={18} aria-hidden="true" /></span>
          <div><span className="eyebrow">02 · Step-by-step</span><h3 id="solution-title">The solution</h3></div>
          <div className="solution-actions">
            <button className="text-action" type="button" onClick={() => onCopy('Solution', result.solution)}>
              <Copy size={15} aria-hidden="true" /> Copy
            </button>
            <button className="text-action" type="button" onClick={downloadSolution}>
              <Download size={15} aria-hidden="true" /> Download
            </button>
          </div>
        </div>
        <SolutionRenderer solution={result.solution} />
      </article>
    </section>
  );
}

export default ResultsDashboard;