import { Link } from 'react-router-dom';
import HeroIllustration from '../components/HeroIllustration';

export default function LandingPage() {
  const features = [
    {
      tag: '01',
      title: 'Sprint & Task Management',
      desc: 'Plan sprints, track tasks on a Kanban board, and keep your team aligned without the busywork.',
      accent: 'bg-accent',
    },
    {
      tag: '02',
      title: 'AI-Prioritized Review Queue',
      desc: "GitHub PRs flow in via webhooks and get automatically scored and flagged when they go stale — so nothing important slips through.",
      accent: 'bg-amber',
    },
    {
      tag: '03',
      title: 'Docs & Incident Search',
      desc: "Ask a question in plain English and get answers pulled straight from your team's docs and runbooks, with sources cited.",
      accent: 'bg-mint',
    },
  ];

  const whyCards = [
    { title: 'AI-Powered', desc: 'Real Gemini-backed search and PR triage, not rules-based scripts.' },
    { title: 'End-to-End', desc: 'From sprint planning to code review to documentation, one workspace.' },
    { title: 'Fast Setup', desc: 'Connect GitHub and start getting a prioritized review queue in minutes.' },
    { title: 'Source-Cited', desc: 'Every AI answer links back to the exact doc it came from.' },
  ];

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
        <span className="font-display font-semibold text-lg text-text">
          AI Eng Workplace
        </span>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-text-muted hover:text-text transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium bg-accent text-white px-4 py-2 rounded-md shadow-sm hover:bg-accent/90 hover:shadow-md transition-all"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero — split layout */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-mono text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-6">
            built for engineering teams
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-text tracking-tight leading-tight mb-6">
            Plan. Review.<br />
            <span className="text-accent">Ship, with AI.</span>
          </h1>
          <p className="text-text-muted text-lg mb-8 max-w-md">
            AI Eng Workplace brings sprints, prioritized PR reviews, and
            source-cited doc search into one intelligent workspace.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="bg-accent text-white px-6 py-3 rounded-md text-sm font-medium shadow-sm hover:bg-accent/90 hover:shadow-md transition-all"
            >
              Get started free
            </Link>
            <Link
              to="/login"
              className="bg-white border border-border text-text px-6 py-3 rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Right visual: real workflow, not fake agents */}
        <div className="flex items-center justify-center">
          <HeroIllustration />
        </div>
      </section>

      {/* Why section */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-display text-2xl font-semibold text-text text-center mb-10">
          Why AI Eng Workplace?
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {whyCards.map((c) => (
            <div
              key={c.title}
              className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="font-display font-medium text-sm text-text mb-2">
                {c.title}
              </h3>
              <p className="text-text-muted text-xs leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.tag}
              className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`h-1 ${f.accent}`} />
              <div className="p-6">
                <span className="font-mono text-xs text-text-dim">{f.tag}</span>
                <h3 className="font-display font-medium text-lg text-text mt-2 mb-2">
                  {f.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="font-mono text-xs text-text-dim">
            AI Eng Workplace — portfolio project
          </span>
          <span className="text-xs text-text-dim">
            Built with React, Express, FastAPI & Gemini
          </span>
        </div>
      </footer>
    </div>
  );
}