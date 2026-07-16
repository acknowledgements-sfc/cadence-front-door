import { getSupabase } from "./supabase";

export interface WaitlistResult {
  ok: boolean;
  error: string;
  id?: string;
}

function normalizeEmail(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  return trimmed;
}

export async function submitWaitlist(
  answerText: string,
  email: string,
): Promise<WaitlistResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      ok: false,
      error: "Waitlist is not configured yet. Check back soon.",
    };
  }

  const emailNorm = normalizeEmail(email);
  if (!emailNorm) {
    return { ok: false, error: "A valid email is required." };
  }

  const { data, error } = await supabase.rpc("waitlist_submit", {
    p_answer_text: answerText,
    p_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    p_email: emailNorm,
  });

  if (error) {
    const raw = error.message ?? "";
    if (raw.includes("email required") || raw.includes("email invalid")) {
      return { ok: false, error: "A valid email is required." };
    }
    const msg = raw.includes("waitlist_submit")
      ? "Waitlist is not open yet — check back soon."
      : raw;
    return { ok: false, error: msg };
  }

  return { ok: true, error: "", id: data as string };
}
