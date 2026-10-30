import type { Metadata } from 'next';
import { PolicyPage } from '@/components/Policies';
const reviewMode=process.env.VERCEL_ENV!=='production';
export const metadata:Metadata={title:'Privacy — Cadence',description:'How Cadence uses information shared through the waitlist and product.',robots:reviewMode?{index:false,follow:false}:{index:true,follow:true}};
export default function Privacy(){return <PolicyPage page="privacy" reviewMode={reviewMode}/>;}
