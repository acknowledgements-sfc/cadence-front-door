const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request:Request){
  if(process.env.VERCEL_ENV!=='production')return Response.json({ok:false,error:'Waitlist submissions are disabled in review previews.'},{status:404});
  let body:{email?:unknown;answerText?:unknown};
  try{body=await request.json() as typeof body;}catch{return Response.json({ok:false,error:'Enter a valid email and a short answer.'},{status:400});}
  const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
  const answerText=typeof body.answerText==='string'?body.answerText.trim():'';
  if(!emailPattern.test(email)||email.length>320)return Response.json({ok:false,error:'Enter a valid email address.'},{status:400});
  if(!answerText||answerText.length>2000)return Response.json({ok:false,error:'Add a short answer about what you want to make real.'},{status:400});
  const url=process.env.VITE_SUPABASE_URL;
  const key=process.env.VITE_SUPABASE_ANON_KEY;
  if(!url||!key)return Response.json({ok:false,error:'Waitlist is not configured yet. Please try again later.'},{status:503});
  try{
    const response=await fetch(`${url.replace(/\/$/,'')}/rest/v1/rpc/waitlist_submit`,{
      method:'POST',cache:'no-store',headers:{'Content-Type':'application/json',apikey:key,Authorization:`Bearer ${key}`},
      body:JSON.stringify({p_answer_text:answerText,p_user_agent:request.headers.get('user-agent')?.slice(0,512)??null,p_email:email})
    });
    if(!response.ok){
      const message=await response.text();
      if(/email required|email invalid|answer required|answer too long|email too long/i.test(message))return Response.json({ok:false,error:'Check the email and answer, then try again.'},{status:400});
      return Response.json({ok:false,error:'We could not add you to the waitlist just now. Please try again.'},{status:502});
    }
    return Response.json({ok:true},{status:201});
  }catch{return Response.json({ok:false,error:'We could not reach the waitlist just now. Please try again.'},{status:502});}
}
