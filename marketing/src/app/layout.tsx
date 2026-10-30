import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Header } from '@/components/Interactive';
import './globals.css';
const reviewMode=process.env.VERCEL_ENV!=='production';
export const metadata: Metadata={title:'Cadence',description:'Cadence helps independent artists see the bigger picture and choose a useful next step.',robots:reviewMode?{index:false,follow:false}:{index:true,follow:true},icons:{icon:'/icon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main-content">Skip to content</a><Suspense fallback={<div className="header"/>}><Header/></Suspense>{children}</body></html>;}
