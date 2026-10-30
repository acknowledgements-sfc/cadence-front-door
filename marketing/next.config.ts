import type { NextConfig } from 'next';
const reviewMode=process.env.VERCEL_ENV!=='production';
const nextConfig:NextConfig={
  devIndicators:false,
  turbopack:{root:process.cwd()},
  async headers(){return reviewMode?[{source:'/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}]:[];},
  async rewrites(){return[
    {source:'/_mintlify/:path*',destination:'https://acknowledgements.mintlify.site/_mintlify/:path*'},
    {source:'/mintlify-assets/:path+',destination:'https://acknowledgements.mintlify.site/mintlify-assets/:path+'},
    {source:'/docs',destination:'https://acknowledgements.mintlify.site/docs'},
    {source:'/docs/:path*',destination:'https://acknowledgements.mintlify.site/docs/:path*'}
  ];}
};
export default nextConfig;
