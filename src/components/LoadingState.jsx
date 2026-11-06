import { useEffect, useState } from 'react';
import { Check, FileSearch, Image, ScanText, Sparkles, X } from 'lucide-react';

const stages = [
  { label: 'Sending your image', icon: Image },
  { label: 'Reading the question', icon: FileSearch },
  { label: 'Recognizing equations', icon: ScanText },
  { label: 'Working through a solution', icon: Sparkles },
  { label: 'Preparing your result', icon: Check },
];

function LoadingState({ onCancel }) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStage((current) => Math.min(current + 1, stages.length - 1));
    }, 7500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="loading-card" aria-live="polite" aria-label="Analysis in progress">
      <div className="loading-heading">
        <span className="loading-spinner" />
        <div><strong>Working on your question</strong><span>The complete analysis returns in one response.</span></div>
        <button className="icon-button cancel-button" type="button" onClick={onCancel} title="Cancel analysis" aria-label="Cancel analysis">
          <X size={17} aria-hidden="true" />
        </button>
      </div>
      <ol className="loading-stages">
        {stages.map(({ label, icon: Icon }, index) => (
          <li className={index === activeStage ? 'stage-active' : ''} key={label} aria-current={index === activeStage ? 'step' : undefined}>
            <span className="stage-icon"><Icon size={15} aria-hidden="true" /></span>
            <span>{label}</span>
            {index === activeStage && <span className="stage-pulse" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default LoadingState;