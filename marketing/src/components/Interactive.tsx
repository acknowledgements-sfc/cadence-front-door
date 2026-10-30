'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { content } from '@/content';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { BrandIllustration, prefersReducedMotion } from './Motion';

export function Header() {
 const [open,setOpen]=useState(false); const path=usePathname(); const button=useRef<HTMLButtonElement>(null); const nav=useRef<HTMLElement>(null);
 useEffect(()=>{if(!open)return; const close=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);button.current?.focus();}}; document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close);},[open]);
 return <header className="header"><Link className="brand" href="/" aria-label="Cadence home"><Image unoptimized loading="eager" src="/assets/cadence-wordmark.svg" alt="Cadence" width="162" height="45"/></Link><nav ref={nav} id="main-nav" aria-label="Main navigation" className={open?'navigation is-open':'navigation'}>{content.common.nav.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={path===href?'page':undefined}>{label}</Link>)}</nav><div className="header-actions"><Link href="/beta" className="button button-small header-cta"><span className="header-cta-icon" aria-hidden="true">↗</span>{content.common.primary}</Link><button ref={button} className="menu-toggle" aria-controls="main-nav" aria-expanded={open} aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(v=>!v)}><span/ ><span/></button></div></header>;
}
export function Walkthrough({compact=false}:{compact?:boolean}) {
 const [step,setStep]=useState(0);
 const [previousImage,setPreviousImage]=useState<string|null>(null);
 const [selectionCount,setSelectionCount]=useState(0);
 const root=useRef<HTMLDivElement>(null);
 const currentImage=useRef<HTMLImageElement>(null);
 const copy=useRef<HTMLDivElement>(null);
 const w=content.common.walkthrough;
 const current=w.steps[step];

 useGSAP(() => {
  if (!previousImage || prefersReducedMotion()) return;
  const outgoing=root.current?.querySelector<HTMLImageElement>('.walkthrough-image-previous');
  const incoming=currentImage.current;
  if (!outgoing || !incoming) return;
  const timeline=gsap.timeline({onComplete:()=>setPreviousImage(null)});
  timeline.fromTo(incoming,{opacity:0},{opacity:1,duration:0.26,ease:'power1.out'},0)
   .to(outgoing,{opacity:0,duration:0.26,ease:'power1.out'},0);
  if(copy.current) timeline.fromTo(copy.current,{opacity:0.55,y:5},{opacity:1,y:0,duration:0.22,ease:'power1.out'},0.04);
 },{scope:root,dependencies:[step,previousImage],revertOnUpdate:true});

 function chooseStep(next:number){
  const selected=(next+w.steps.length)%w.steps.length;
  if(selected===step)return;
  setPreviousImage(prefersReducedMotion()?null:current.image);
  setStep(selected);
  setSelectionCount(value=>value+1);
 }

 return <div ref={root} className={compact?'walkthrough compact':'walkthrough'}>
  <div className="walkthrough-top"><span className="eyebrow"><i className="status-dot"/>{w.label}</span><span className="counter">0{step+1} / 04</span></div>
  <div className="product-presentation">
   <BrandIllustration variant="focus" className="focus-illustration" progress={selectionCount}/>
   <div className="product-view">
    <div className="product-images">
     {previousImage&&<Image unoptimized loading="eager" className="walkthrough-image walkthrough-image-previous" src={`/assets/${previousImage}.png`} alt="" aria-hidden="true" width="1440" height="565"/>}
     <Image unoptimized loading="eager" ref={currentImage} className="walkthrough-image walkthrough-image-current" src={`/assets/${current.image}.png`} alt={current.alt} width="1440" height="565"/>
    </div>
    <span className="product-label">CADENCE / {current.name.toUpperCase()}</span>
   </div>
  </div>
  <div className="step-navigation" aria-label="Walkthrough views">{w.steps.map((s,i)=><button key={s.name} type="button" aria-pressed={i===step} onClick={()=>chooseStep(i)}><span className="step-number">0{i+1}</span>{s.name}<span className="step-arrow" aria-hidden="true">↗</span></button>)}</div>
  <div className="walkthrough-bottom"><div ref={copy} className="step-copy" aria-live="polite" aria-atomic="true"><h3>{current.title}</h3><p>{current.body}</p></div><div className="walk-controls"><button className="icon-button" type="button" aria-label={w.previous} disabled={step===0} onClick={()=>chooseStep(step-1)}>←</button><button className="icon-button" type="button" aria-label={step===3?w.restart:w.next} onClick={()=>chooseStep(step+1)}>→</button></div></div>
  <p className="caption">{w.sample}</p>{!compact&&<details className="text-walkthrough"><summary>{content.common.ui.walkthroughText}</summary><ol>{w.steps.map(s=><li key={s.name}><h4>{s.name} — {s.title}</h4><p>{s.body}</p></li>)}</ol></details>}
 </div>;
}
export function BetaForm({reviewMode=true}:{reviewMode?:boolean}){
 const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [done,setDone]=useState(false);const result=useRef<HTMLDivElement>(null);const email=useRef<HTMLInputElement>(null);const answer=useRef<HTMLTextAreaElement>(null);const c=content.common.form;
 useEffect(()=>{if(done)result.current?.focus();},[done]);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;const input=form.elements.namedItem('email') as HTMLInputElement;const answerInput=form.elements.namedItem('idea') as HTMLTextAreaElement;const trimmedAnswer=answerInput.value.trim();if(!input.value.trim()||!input.validity.valid){setError(c.invalid);input.focus();return;}if(!reviewMode&&!trimmedAnswer){setError(c.answerRequired);answerInput.focus();return;}
  if(reviewMode){form.reset();setError('');setDone(true);return;}
  setBusy(true);setError('');try{const response=await fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:input.value,answerText:trimmedAnswer})});const payload=await response.json() as {ok?:boolean;error?:string};if(!response.ok||!payload.ok)throw new Error(payload.error||c.submitError);form.reset();setDone(true);}catch(caught){setError(caught instanceof Error?caught.message:c.submitError);}finally{setBusy(false);}}
 if(done)return <div ref={result} className="form-result" tabIndex={-1} role="status"><span className="result-mark" aria-hidden="true">✓</span><h2>{reviewMode?c.success:c.liveSuccess}</h2><p>{reviewMode?c.successBody:c.liveSuccessBody}</p><button className="button" onClick={()=>{setDone(false);requestAnimationFrame(()=>email.current?.focus());}}>{c.again}<span aria-hidden="true">↗</span></button></div>;
 return <form className="beta-form" onSubmit={submit} noValidate autoComplete="off"><span className="eyebrow">{content.common.ui.formLabel}</span><h2>{c.title}</h2><p className="form-disclosure" id="preview-disclosure">{reviewMode?c.disclosure:<>{c.liveDisclosure} <Link href="/privacy">Privacy</Link>.</>}</p><label htmlFor="email">{c.email}</label><input ref={email} type="email" inputMode="email" name="email" id="email" required autoComplete="email" placeholder={c.emailPlaceholder} aria-describedby={error?'email-error preview-disclosure':'preview-disclosure'} aria-invalid={!!error} onChange={()=>error&&setError('')}/>{error&&<p className="form-error" id="email-error" role="alert">{error}</p>}<label htmlFor="idea">{reviewMode?c.idea:c.liveIdea}<span>{reviewMode?c.optional:c.required}</span></label><textarea ref={answer} id="idea" name="idea" rows={4} maxLength={2000} placeholder={c.ideaPlaceholder} required={!reviewMode} aria-describedby={error?'email-error preview-disclosure':'preview-disclosure'}/><button type="submit" className="button" disabled={busy}>{busy?c.sending:reviewMode?c.submit:c.liveSubmit}<span aria-hidden="true">↗</span></button></form>;
}
