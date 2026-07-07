import { getSupabase } from "./supabase";

export interface WaitlistResult {
  ok: boolean;
  error: string;
  id?: string;
}

export async function submitWaitlist(answerText: string): Promise<WaitlistResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      ok: false,
      error: "Waitlist is not configured yet. Check back soon.",
    };
  }

  const { data, error } = await supabase.rpc("waitlist_submit", {
    p_answer_text: answerText,
    p_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  });

  if (error) {
    const msg = error.message.includes("waitlist_submit")
      ? "Waitlist is not open yet — check back soon."
      : error.message;
    return { ok: false, error: msg };
  }

  return { ok: true, error: "", id: data as string };
}
