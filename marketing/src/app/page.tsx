import Site from '@/components/Site';
import { pages } from '@/content';
const reviewMode=process.env.VERCEL_ENV!=='production';
export const metadata={title:pages.home.title,description:pages.home.description,robots:reviewMode?{index:false,follow:false}:{index:true,follow:true}};
export default function Home(){return <Site pageKey="home" reviewMode={reviewMode}/>;}
