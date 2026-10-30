import type { Metadata } from 'next';
import { PolicyPage } from '@/components/Policies';
const reviewMode=process.env.VERCEL_ENV!=='production';
export const metadata:Metadata={title:'Terms — Cadence',description:'Early access terms for Cadence.',robots:reviewMode?{index:false,follow:false}:{index:true,follow:true}};
export default function Terms(){return <PolicyPage page="terms" reviewMode={reviewMode}/>;}
