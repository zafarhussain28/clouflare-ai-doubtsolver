import { ArrowDown, Check, FlaskConical, Sigma, Sparkles } from 'lucide-react';

function Hero() {
  return (
    <>
      <div className="hero-kicker"><span className="live-dot" /> A little more clarity, in every subject</div>
      <h1 id="hero-title">Solve any STEM question <span>with AI.</span></h1>
      <p className="hero-description">
        Upload a question image and get accurate text extraction, mathematical recognition, and step-by-step AI explanations.
      </p>
      <div className="subject-label" id="subjects">Ready for your next big question</div>
      <div className="subject-list flex flex-wrap gap-2" aria-label="Supported subjects">
        <span className="subject-chip"><Sigma size={16} aria-hidden="true" /> Mathematics</span>
        <span className="subject-chip"><FlaskConical size={16} aria-hidden="true" /> Chemistry</span>
        <span className="subject-chip"><Sparkles size={16} aria-hidden="true" /> Physics</span>
      </div>
      <a className="scroll-hint" href="#how-it-works"><span className="scroll-icon"><ArrowDown size={15} aria-hidden="true" /></span> See how it works</a>
      <div className="hero-proof"><Check size={15} aria-hidden="true" /> Built for the working, not just the answer</div>
    </>
  );
}

export default Hero;