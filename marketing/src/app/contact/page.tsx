import type { Metadata } from 'next';
import { PolicyPage } from '@/components/Policies';
const reviewMode=process.env.VERCEL_ENV!=='production';
export const metadata:Metadata={title:'Contact — Cadence',description:'Contact Cadence about early access, accounts or data requests.',robots:reviewMode?{index:false,follow:false}:{index:true,follow:true}};
export default function Contact(){return <PolicyPage page="contact" reviewMode={reviewMode}/>;}
