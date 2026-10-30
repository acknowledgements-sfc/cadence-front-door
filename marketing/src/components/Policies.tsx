import Link from 'next/link';
import { Footer } from '@/components/Site';

const policies={
  privacy:{title:'Privacy',intro:'Cadence is early access software for independent artists. This page says what is stored and how it is used — plainly.',sections:[
    {heading:'What is stored',body:'Waitlist submissions include the answer text you write and the email address you share so Cadence can invite you. Inside the product, plan data for your pursuits and movements is stored so the map can hold your work. Product analytics use PostHog events without attaching personal identifiers to those events.'},
    {heading:'Email',body:'Transactional email is sent through Resend — for example a weekly settled summary or a quiet-season note, and the magic-link used to sign in. Cadence does not sell contact information or answer text to advertisers.'},
    {heading:'Leaving',body:'You can leave whenever. To ask that account data be removed, write to the contact address on the Contact page.'}
  ]},
  terms:{title:'Terms',intro:'Cadence is an early-access preview. These terms are short on purpose while the product is still finding its shape.',sections:[
    {heading:'Early access',body:'Features may change. Data you enter may be used to improve the product. Nothing here is a promise of uptime, feature permanence, or a finished contract.'},
    {heading:'Leave whenever',body:'Early access for independent artists. No spam, leave whenever. Leaving the waitlist or the product is always available — write contact if something is stuck.'},
    {heading:'Your work',body:'You keep ownership of the creative work and plans you enter. Cadence stores them to run the product for you, not to claim them.'}
  ]},
  contact:{title:'Contact',intro:'Email is the support path for early access. There is no live chat and no promised response window beyond what a small team can manage.',body:'Use this address for account questions, data removal requests, or anything the product cannot answer on its own.',email:'yo@rcawhatsgood.com'}
} as const;

export function PolicyPage({page,reviewMode=true}:{page:'privacy'|'terms'|'contact';reviewMode?:boolean}){
 const copy=policies[page];
 return <><main id="main-content" className="policy-page section"><span className="eyebrow">CADENCE / {copy.title.toUpperCase()}</span><h1>{copy.title}</h1><p className="policy-intro">{copy.intro}</p>{'sections'in copy&&copy.sections.map(section=><section className="policy-section" key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}{'body'in copy&&<section className="policy-section"><p>{copy.body}</p><p className="eyebrow policy-label">Write to</p><a className="text-link" href={`mailto:${copy.email}`}>{copy.email}</a></section>}<p className="policy-back"><Link className="text-link" href="/">Back to Cadence <span aria-hidden="true">↗</span></Link></p></main><Footer reviewMode={reviewMode}/></>;
}
