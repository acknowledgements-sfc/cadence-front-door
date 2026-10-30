import Image from 'next/image';
import Link from 'next/link';
import { content, pages, type Section } from '@/content';
import { BetaForm, Walkthrough } from './Interactive';
import { BrandIllustration, MotionEntrance } from './Motion';

const C = content.common;

export function Button({ href = '/beta', children = C.primary, light = false }: { href?: string; children?: React.ReactNode; light?: boolean }) {
  return <Link className={`button ${light ? 'button-light' : ''}`} href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}

function SectionHeading({ section }: { section: Section }) {
  return <div className="section-heading"><span className="eyebrow">{section.label}</span><h2>{section.title}</h2><p>{section.body}</p></div>;
}

function SectionLink({ link, className = 'text-link' }: { link: NonNullable<Section['link']>; className?: string }) {
  const content = <>{link.label}<span aria-hidden="true">↗</span></>;
  return link.external
    ? <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">{content}</a>
    : <Link className={className} href={link.href}>{content}</Link>;
}

function Cards({ section }: { section: Section }) {
  return <>
    <div className={`cards cards-${section.cards?.length}`}>
      {section.cards?.map((card, i) => <article className="card" key={card.title}>
        <div className="card-top"><span className="eyebrow">0{i + 1}</span><span aria-hidden="true">{i === 0 ? '↗' : i === 1 ? '◎' : '↔'}</span></div>
        <h3>{card.title}</h3><p>{card.body}</p>
      </article>)}
    </div>
    {section.link && <div className="section-action"><SectionLink link={section.link}/></div>}
  </>;
}

function ContentSection({ section: s, index }: { section: Section; index: number }) {
  if (s.kind === 'vision') return <section className="vision section" id={s.id}>
    <BrandIllustration variant="open-form" className="vision-art" />
    <div><span className="eyebrow">{s.label}</span><h2>{s.title}</h2></div>
    <div className="vision-copy"><p>{s.body}</p>{s.link && <SectionLink link={s.link} className="button button-light"/>}</div>
  </section>;

  if (s.kind === 'feature') return <section className={`section feature ${index % 2 ? 'feature-reverse' : ''}`} id={s.id}>
    <div><SectionHeading section={s}/>{s.aside && <p className="feature-aside">{s.aside}</p>}</div>
    <figure className="feature-figure"><div className="feature-image"><Image unoptimized loading="eager" src={`/assets/${s.image}.png`} alt={C.walkthrough.steps.find(x => x.image === s.image)?.alt || ''} width="1440" height="565"/></div><figcaption>{C.ui.imageCaption}</figcaption></figure>
  </section>;

  if (s.kind === 'walkthrough') return <section className="section demo-section" id={s.id || 'walkthrough'}>
    <SectionHeading section={s}/><Walkthrough/>
  </section>;

  if (s.kind === 'voice-doorway') return <section className="section voice-doorway" id={s.id}>
    <SectionHeading section={s}/>
    <div className="voice-steps">{s.cards?.map((card, i) => <article className="voice-step" key={card.title}>
      <span className="eyebrow">0{i + 1}</span><h3>{card.title}</h3><p>{card.body}</p>
    </article>)}</div>
    {s.aside && <p className="voice-disclosure">{s.aside}</p>}
    {s.link && <SectionLink link={s.link} className="button voice-link"/>}
  </section>;

  if (s.kind === 'cards' || s.kind === 'offer') return <section className={`section ${s.kind === 'offer' ? 'offer-section' : 'cards-section'}`} id={s.id}>
    <SectionHeading section={s}/><Cards section={s}/>
    {s.kind === 'offer' && <div className="offer-action"><Button/><span>{C.ui.offerNote}</span></div>}
  </section>;

  if (s.kind === 'beta') return <section className="section beta-invitation" id={s.id}>
    <SectionHeading section={s}/><div className="invitation-action"><Button/><Link className="text-link" href="/pricing">{C.ui.betaAbout} <span aria-hidden="true">↗</span></Link></div>
  </section>;

  if (s.kind === 'founder') return <section className="section founder-section" id={s.id}>
    <div className="founder-identity"><span className="monogram" aria-hidden="true">RM</span><span className="eyebrow">ROB MARTIN<br/>BEHIND CADENCE</span></div><SectionHeading section={s}/>
  </section>;

  const isStartingPoint = s.title === 'There is no one right starting point.';
  return <section className={`section editorial-section ${isStartingPoint ? 'starting-point-section' : ''}`} id={s.id}>
    <span className="eyebrow">{s.label}</span><div className="editorial-copy"><h2>{s.title}</h2><p>{s.body}</p></div>
    {isStartingPoint && <BrandIllustration variant="paths" className="branching-art" />}
  </section>;
}

export function Footer({reviewMode=true}:{reviewMode?:boolean}) {
  return <footer className="footer">
    <div className="footer-invitation"><span className="eyebrow">{C.ui.footerLabel}</span><h2>{C.footer.headline}</h2><p>{C.footer.body}</p><Button light/></div>
    <div className="footer-bottom"><Link href="/" className="brand brand-light" aria-label="Cadence home"><Image unoptimized loading="eager" src="/assets/cadence-wordmark.svg" alt="Cadence" width="162" height="45"/></Link>
      <nav aria-label="Footer navigation"><Link href="/">{C.ui.home}</Link>{C.nav.map(([n, h]) => <Link key={h} href={h}>{n}</Link>)}<Link href="/docs">Docs</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link><a href="https://app.cadencemgmt.site/">Sign in</a></nav>{reviewMode&&<span>{C.draft} / 2026</span>}
    </div>{reviewMode&&<p className="footer-note">{C.footer.note}</p>}
  </footer>;
}

export default function Site({ pageKey, reviewMode=true }: { pageKey: string; reviewMode?:boolean }) {
  const page = pages[pageKey];
  return <><main id="main-content">
    <section className={`hero ${page.heroVisual ? 'hero-with-visual' : 'inner-hero'} ${page.heroAnchors ? 'hero-with-anchors' : ''} ${pageKey === 'beta' ? 'beta-hero' : ''}`}>
      <div className="hero-copy"><span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.headline.split('\n').map((line, i) => <span key={`${line}-${i}`} data-home-hero-line={pageKey === 'home' ? '' : undefined} className={i === 1 ? 'headline-second' : undefined}>{line}</span>)}</h1>
        <div className="hero-bottom"><p data-home-hero-support={pageKey === 'home' ? '' : undefined}>{page.intro}</p><div className="hero-actions" data-home-hero-actions={pageKey === 'home' ? '' : undefined}>{pageKey !== 'beta' && <Button/>}
          {page.heroAnchors?.map(([label, href]) => <a className="text-link" href={href} key={href}>{label}<span aria-hidden="true">↗</span></a>)}
          {!page.heroAnchors && pageKey !== 'demo' && pageKey !== 'beta' && <Link className="text-link" href="/demo">{C.secondary}<span aria-hidden="true">↗</span></Link>}
        </div></div>
      </div>
      {page.heroVisual && <figure className="hero-product"><div className="hero-product-bar"><span><i className="status-dot"/>{C.ui.productBar}</span><span>{C.ui.mapView}</span></div>
        <Image unoptimized loading="eager" src="/assets/map.png" alt={C.walkthrough.steps[0].alt} width="1440" height="557" fetchPriority="high"/><figcaption>{C.ui.imageCaption}</figcaption>
      </figure>}
      <MotionEntrance pageKey={pageKey} />
    </section>
    {pageKey === 'beta' ? <section className="section beta-layout">
      <div className="beta-context"><span className="eyebrow">{C.ui.betaContextLabel}</span><h2>{C.ui.betaContextTitle}</h2><p>{reviewMode?C.ui.betaContextBody:C.ui.betaLiveContextBody}</p><Link href="/pricing" className="text-link">{C.ui.betaRead}<span aria-hidden="true">↗</span></Link>
        {reviewMode&&<div className="beta-note"><span className="eyebrow">{C.ui.betaNoteLabel}</span><p>{C.ui.betaNote}</p></div>}
      </div><BetaForm reviewMode={reviewMode}/>
    </section> : page.sections.map((s, i) => <ContentSection key={`${s.label}-${i}`} section={s} index={i}/>)}
    {page.faqs.length > 0 && <section className="section faq-section"><div><span className="eyebrow">{C.ui.faqLabel}</span><h2>{C.ui.faqTitle}</h2></div>
      <div className="faqs">{page.faqs.map(([q, a], i) => <details key={q}><summary><span className="faq-number">0{i + 1}</span>{q}<span className="faq-symbol" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
    </section>}
  </main><Footer reviewMode={reviewMode}/></>;
}
