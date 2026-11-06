import { Atom, ArrowUpRight } from 'lucide-react';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-inner">
        <a className="footer-brand" href="#home"><Atom size={18} aria-hidden="true" /> STEM Solver AI</a>
        <p>Good questions deserve thoughtful answers.</p>
        <a className="footer-top" href="#home">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}

export default Footer;