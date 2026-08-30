import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Code2, Copy, ExternalLink, Github, Linkedin, Mail, MapPin, Menu, Send, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useRoute } from 'wouter';

const queryClient = new QueryClient();
const GITHUB_REPO = 'https://github.com/Gbenga22/personal-portfolio';
const githubProjectUrl = (slug: string) => `${GITHUB_REPO}/tree/main/projects/${slug}`;

type Project = {
  slug: string;
  number: string;
  title: string;
  type: string;
  year: string;
  summary: string;
  detail: string;
  tags: string[];
  color: 'cream' | 'coral' | 'lime';
  role: string;
  outcome: string;
  tools: string;
};

const projects: Project[] = [
  {
    slug: 'market-street',
    number: '01',
    title: 'Market Street',
    type: 'Civic commerce',
    year: '2024',
    summary: 'A field-tested toolkit that helps neighborhood businesses understand the money moving through their streets.',
    detail: 'Market Street turns messy point-of-sale exports into a calm, legible picture of local commerce. I worked with shop owners, a city data team, and a tiny research crew to make data feel useful before it felt impressive.',
    tags: ['Product strategy', 'React', 'Data viz'],
    color: 'cream',
    role: 'Lead product engineer',
    outcome: 'Pilot users found a useful answer in under 90 seconds, down from a full afternoon of spreadsheet work.',
    tools: 'TypeScript · React · D3 · Postgres',
  },
  {
    slug: 'relay',
    number: '02',
    title: 'Relay',
    type: 'Care coordination',
    year: '2023',
    summary: 'A quieter handoff system for community health workers carrying too many tabs and too much context.',
    detail: 'Relay gives frontline teams a shared place to hand off a case without flattening the human story behind it. The interface is deliberately paced: fewer alerts, better defaults, and a timeline that respects the sequence of care.',
    tags: ['UX systems', 'Next.js', 'Design ops'],
    color: 'coral',
    role: 'Design engineer',
    outcome: 'Reduced duplicate follow-ups by 31% during the first six-week rollout.',
    tools: 'Next.js · Prisma · Playwright · Figma',
  },
  {
    slug: 'komorebi',
    number: '03',
    title: 'Komorebi',
    type: 'Climate accounting',
    year: '2023',
    summary: 'A practical carbon ledger for teams that want to change their operations, not just their vocabulary.',
    detail: 'Komorebi makes operational emissions visible at the moment a decision gets made. I designed the information model and built the first reporting workflows, translating a complicated accounting standard into actions a small team could actually take.',
    tags: ['Systems thinking', 'Svelte', 'Research'],
    color: 'lime',
    role: 'Product engineer',
    outcome: 'Helped a 42-person studio identify three changes responsible for 68% of their reduction plan.',
    tools: 'SvelteKit · Supabase · Observable',
  },
  {
    slug: 'common-ground',
    number: '04',
    title: 'Common Ground',
    type: 'Public participation',
    year: '2022',
    summary: 'A more generous way for residents to shape the small decisions that define a neighborhood.',
    detail: 'Common Ground is a participation pattern library and lightweight voting tool for local groups. It pairs plain-language prompts with a visual map of trade-offs, helping a room move from opinions to shared decisions.',
    tags: ['Civic tech', 'Vue', 'Accessibility'],
    color: 'cream',
    role: 'Technical lead',
    outcome: 'Made 14 neighborhood planning sessions accessible on low-bandwidth devices.',
    tools: 'Vue · Node · Mapbox · WCAG 2.2',
  },
  {
    slug: 'ledger-letters',
    number: '05',
    title: 'Ledger Letters',
    type: 'Independent publishing',
    year: '2021',
    summary: 'A tiny publishing system for people with something specific to say and no appetite for a content factory.',
    detail: 'Ledger Letters gives independent writers a focused way to shape a thoughtful newsletter. I built the editor around the rhythm of writing rather than the mechanics of a CMS, with clear previews and a tiny, portable data model.',
    tags: ['Editorial tools', 'Astro', 'Typography'],
    color: 'coral',
    role: 'Founder / builder',
    outcome: 'Used by 180+ independent writers to publish their first issue without a tutorial.',
    tools: 'Astro · SQLite · MailChannels',
  },
];

const repos = [
  { name: 'market-street', description: 'A local commerce snapshot for neighborhood businesses.', language: 'HTML / JS', stars: '—' },
  { name: 'relay', description: 'A calm handoff timeline for teams coordinating care.', language: 'HTML / JS', stars: '—' },
  { name: 'komorebi', description: 'A lightweight operational emissions calculator.', language: 'HTML / JS', stars: '—' },
  { name: 'common-ground', description: 'An accessible neighborhood decision tool.', language: 'HTML / JS', stars: '—' },
  { name: 'ledger-letters', description: 'A focused split-pane newsletter writing surface.', language: 'HTML / JS', stars: '—' },
];

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const isDetail = location.startsWith('/work/');
  const jump = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-mark" data-testid="link-brand" onClick={jump}>
          <span className="brand-dot" aria-hidden="true" />
          <span>Gbenga Ayiola</span>
        </Link>
        <button className="menu-button" onClick={() => setOpen((value) => !value)} data-testid="button-menu" aria-label="Toggle navigation">
          {open ? <X size={16} /> : <Menu size={16} />} <span>{open ? 'Close' : 'Menu'}</span>
        </button>
        <nav className={`header-nav ${open ? 'open' : ''}`} aria-label="Primary navigation">
          {isDetail ? <Link href="/" onClick={jump} data-testid="link-back-home">Back to home</Link> : null}
          <a href="/#work" onClick={jump} data-testid="link-work">Selected work</a>
          <a href="/#about" onClick={jump} data-testid="link-about">About</a>
          <a href="/#contact" onClick={jump} data-testid="link-contact">Contact</a>
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer" onClick={jump} data-testid="link-github-nav">GitHub <ArrowUpRight size={13} /></a>
        </nav>
      </div>
    </header>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('.reveal-on-scroll'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="section-heading reveal-on-scroll">
      <div><span className="section-kicker">{eyebrow}</span></div>
      <div>
        <h2>{title}</h2>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div>
        <div className="hero-kicker reveal delay-1">Independent product engineer · Lagos / everywhere</div>
        <h1 className="reveal delay-2">I make<br /><em>useful</em><br />things.</h1>
        <p className="hero-copy reveal delay-3">I’m Gbenga — a developer and design-minded builder turning tangled, real-world problems into software people can understand, use, and come back to.</p>
        <div className="hero-actions reveal delay-3">
          <a className="button-primary" href="#work" data-testid="link-hero-work">See the work <ArrowUpRight size={16} /></a>
          <a className="button-quiet" href="#contact" data-testid="link-hero-contact">Start a conversation <Mail size={16} /></a>
        </div>
        <div className="scroll-line reveal delay-3">Keep scrolling · there is context</div>
      </div>
      <div className="hero-side">
        <div className="hero-stamp">Lagos<br />based<br />worldwide</div>
        <div className="orbit-card">
          <span className="orbit-label">A NOTE FROM THE DESK / 001</span>
          <span className="orbit-code">BUILD · LISTEN · SHIP · REPEAT</span>
          <div className="orbit-title">The best<br />software has<br />a point of view.</div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ['Product thinking', 'Frontend craft', 'Systems that scale', 'Human-sized software'];
  return (
    <div className="marquee" aria-label="Areas of practice">
      <div className="marquee-track">
        {[...words, ...words].map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}
      </div>
    </div>
  );
}

function Manifesto() {
  return (
    <div className="manifesto reveal-on-scroll" id="about">
      <div className="manifesto-grid">
        <div>
          <div className="section-kicker">The short version</div>
          <h2>Clarity is<br />a <span>feature.</span></h2>
        </div>
        <div>
          <p>I like the part before the obvious solution. The interviews, rough diagrams, awkward constraints, and tiny details that turn a technically correct product into one people trust.</p>
          <p className="manifesto-note">Currently open to ambitious teams, thoughtful collaborations, and difficult questions.</p>
        </div>
      </div>
    </div>
  );
}

function WorkList() {
  return (
    <div className="work-list reveal-on-scroll">
      {projects.map((project) => (
        <Link href={`/work/${project.slug}`} className="work-item" key={project.slug} data-testid={`link-project-${project.slug}`}>
          <span className="work-number">{project.number}</span>
          <span className="work-title">{project.title}</span>
          <span className="work-meta">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</span>
          <ArrowUpRight className="work-arrow" size={25} />
        </Link>
      ))}
    </div>
  );
}

function CaseStudies() {
  return (
    <div className="case-grid reveal-on-scroll">
      {projects.slice(0, 3).map((project) => (
        <Link href={`/work/${project.slug}`} className={`case-card ${project.color}`} key={project.slug} data-testid={`card-case-${project.slug}`}>
          <span className="case-index">{project.number} / CASE STUDY</span>
          <div className="case-card-art" aria-hidden="true"><span /><span /><span /></div>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <div className="case-footer"><span>{project.type}</span><ArrowUpRight size={18} /></div>
        </Link>
      ))}
    </div>
  );
}

function Resume() {
  const downloadResume = () => {
    const resume = `GBENGA AYIOLA\nProduct engineer · Lagos / everywhere\n\nPROFILE\nDesign-minded builder turning messy real-world problems into useful software.\n\nEXPERIENCE\nIndependent product engineer — 2021–present\nSelected work across civic tech, care coordination, climate accounting, and publishing.\n\nCAPABILITIES\nProduct strategy · Frontend systems · Prototyping · Accessibility · Team leadership\n\nCONTACT\ngbenga@example.com`;
    const blob = new Blob([resume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Gbenga-Ayiola-Resume.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="section reveal-on-scroll" id="resume">
      <SectionHeading eyebrow="A little more structure" title="The résumé, without the fog." intro="A snapshot of the work behind the work. Personal details are editable placeholders for now." />
      <div className="resume-panel" style={{ background: 'var(--coral)', padding: '30px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '30px', alignItems: 'end' }}>
        <div>
          <div className="section-kicker" style={{ color: 'var(--cream)' }}>2021 — now</div>
          <h3 style={{ font: '700 clamp(2rem, 4vw, 4rem)/.9 var(--app-font-serif)', letterSpacing: '-.07em', margin: '22px 0 20px', color: 'var(--cream)' }}>Independent product<br />engineer &amp; collaborator.</h3>
          <p style={{ maxWidth: '560px', color: 'rgba(244,239,229,.8)', lineHeight: 1.55, margin: 0 }}>From first sketch to shipped interface, I help teams make the complicated feel considered. I work across product strategy, frontend architecture, and the details between.</p>
        </div>
        <button className="button-quiet" style={{ background: 'var(--cream)', whiteSpace: 'nowrap' }} onClick={downloadResume} data-testid="button-download-resume">Download résumé <ArrowUpRight size={15} /></button>
      </div>
    </section>
  );
}

function GitHubSection() {
  return (
    <section className="section reveal-on-scroll" id="github">
      <div className="github-section">
        <div>
          <span className="section-kicker">Open source / GitHub</span>
          <h2>Things I leave<br />in the open.</h2>
          <p className="github-blurb">Small tools, generous defaults, and experiments that became useful enough to share. Browse the source, open a demo, and see how each idea takes shape.</p>
          <a className="button-quiet" href={GITHUB_REPO} target="_blank" rel="noreferrer" style={{ marginTop: '25px' }} data-testid="link-view-github">Visit GitHub <Github size={16} /></a>
        </div>
        <div className="repo-list">
          {repos.map((repo) => (
            <a className="repo" href={githubProjectUrl(repo.name)} target="_blank" rel="noreferrer" key={repo.name} data-testid={`link-repo-${repo.name}`}>
              <div><div className="repo-name">{repo.name}</div><div className="repo-description">{repo.description}</div></div>
              <div className="repo-side"><span className="repo-language">{repo.language}</span><span>{repo.stars} ★</span><ExternalLink size={14} /></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = 'gbenga@example.com';
  const copyEmail = async () => {
    await navigator.clipboard?.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Hello Gbenga — ${form.get('name') || 'a new project'}`);
    const body = encodeURIComponent(`${form.get('message') || ''}\n\nFrom: ${form.get('email') || ''}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };
  return (
    <section className="section" id="contact">
      <div className="contact reveal-on-scroll">
        <div>
          <span className="section-kicker">Your turn</span>
          <h2>Bring me<br /><span style={{ color: 'var(--coral)' }}>the knot.</span></h2>
          <p className="contact-copy">Have a product that needs a clearer shape, a gnarly interface, or a problem you cannot spreadsheet away? Tell me enough to get curious.</p>
          <div className="contact-links">
            <a className="contact-link" href={`mailto:${email}`} data-testid="link-email"><Mail size={14} /> {email}</a>
            <button className="contact-link" onClick={copyEmail} data-testid="button-copy-email">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy email'}</button>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '28px' }}>
            <a className="contact-link" href="https://linkedin.com" target="_blank" rel="noreferrer" data-testid="link-linkedin"><Linkedin size={14} /> LinkedIn</a>
            <span className="contact-link" style={{ border: 0 }}><MapPin size={14} /> Lagos, NG</span>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit} data-testid="form-contact">
          <label htmlFor="name">Your name<input id="name" name="name" placeholder="What should I call you?" required data-testid="input-name" /></label>
          <label htmlFor="email">Your email<input id="email" name="email" type="email" placeholder="you@somewhere.com" required data-testid="input-email" /></label>
          <label htmlFor="message">The knot<textarea id="message" name="message" placeholder="A little context goes a long way..." required data-testid="input-message" /></label>
          <button className="button-primary" type="submit" data-testid="button-send-message">Open mail client <Send size={15} /></button>
          {sent ? <div className="form-success" role="status" data-testid="status-message">Your mail client should be opening. I’ll keep an eye out.</div> : null}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Gbenga Ayiola</span>
      <span>Built with care, curiosity, and too many tabs.</span>
      <a href="#top" style={{ color: 'inherit' }} data-testid="link-back-top">Back to top ↑</a>
    </footer>
  );
}

function Home() {
  const revealRef = useScrollReveal();
  return (
    <div className="portfolio-shell" ref={revealRef}>
      <Header />
      <main className="page-wrap">
        <Hero />
        <Marquee />
        <section className="section" id="work">
          <SectionHeading eyebrow="Selected work / 01—05" title="Good software starts with a better question." intro="Five case studies from the ongoing practice of making useful things for real people, in real conditions." />
          <WorkList />
        </section>
        <Manifesto />
        <section className="section">
          <SectionHeading eyebrow="Three close-ups" title="The work, up close." intro="A few projects where the problem was as interesting as the interface." />
          <CaseStudies />
        </section>
        <Resume />
        <GitHubSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function ProjectDetail() {
  const [, params] = useRoute('/work/:slug');
  const project = projects.find((item) => item.slug === params?.slug);
  if (!project) return <NotFound />;
  return (
    <div className="portfolio-shell">
      <Header />
      <main className="page-wrap detail-page">
        <Link href="/#work" className="back-link" data-testid="link-detail-back"><ArrowLeft size={15} /> All selected work</Link>
        <div className="detail-top">
          <div>
            <div className="hero-kicker">{project.number} / {project.type} / {project.year}</div>
            <h1>{project.title}</h1>
          </div>
          <a className="button-quiet" href={githubProjectUrl(project.slug)} target="_blank" rel="noreferrer" data-testid={`link-detail-external-${project.slug}`}>View source <ExternalLink size={15} /></a>
        </div>
        <div className="detail-content">
          <aside className="detail-aside">
            <dl>
              <dt>Role</dt><dd>{project.role}</dd>
              <dt>Tools</dt><dd>{project.tools}</dd>
              <dt>Outcome</dt><dd>{project.outcome}</dd>
            </dl>
          </aside>
          <article className="detail-body">
            <div className="detail-visual" data-label={project.number} aria-label={`${project.title} project visual`} />
            <div className="detail-block">
              <h2>The question</h2>
              <p>{project.detail}</p>
            </div>
            <div className="detail-block">
              <h2>The shape of it</h2>
              <p>{project.summary} The final product is less about adding another layer and more about removing the friction that made the original problem feel inevitable.</p>
            </div>
            <div className="detail-block">
              <h2>What stayed with me</h2>
              <p>Good constraints are generous. They give a team a shared language, a user a clear next step, and the product enough character to be remembered.</p>
            </div>
            <div className="work-meta">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/work/:slug" component={ProjectDetail} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;