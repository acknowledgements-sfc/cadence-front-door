import { notFound } from 'next/navigation';
import Site from '@/components/Site';
import { pages } from '@/content';
export const dynamicParams=false;
const reviewMode=process.env.VERCEL_ENV!=='production';
export function generateStaticParams(){return Object.keys(pages).filter(k=>k!=='home').map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=pages[slug];if(!p)return{};const description=slug==='beta'&&reviewMode?'Preview the Cadence beta access form. Try the flow with sample details; no information is sent or saved.':p.description;return{title:p.title,description,robots:reviewMode?{index:false,follow:false}:{index:true,follow:true}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!pages[slug]||slug==='home')notFound();return <Site pageKey={slug} reviewMode={reviewMode}/>;}
