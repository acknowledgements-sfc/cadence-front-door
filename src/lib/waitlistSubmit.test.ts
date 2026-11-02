import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSupabase } from "./supabase";
import { submitWaitlist } from "./waitlistSubmit";

vi.mock("./supabase", () => ({
  getSupabase: vi.fn(),
}));

const getSupabaseMock = vi.mocked(getSupabase);

describe("submitWaitlist deployment gate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_WAITLIST_ENABLED", "");
  });

  it("fails closed when the production-only enable flag is absent", async () => {
    const result = await submitWaitlist("A small tour", "artist@example.com");

    expect(result.ok).toBe(false);
    expect(result.error).toContain("Waitlist is not open");
    expect(getSupabaseMock).not.toHaveBeenCalled();
  });

  it("submits only when the enable flag is explicitly true", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: "waitlist-row-id", error: null });
    getSupabaseMock.mockReturnValue({ rpc } as never);
    vi.stubEnv("VITE_WAITLIST_ENABLED", "true");

    const result = await submitWaitlist("A small tour", "ARTIST@example.com");

    expect(result).toEqual({ ok: true, error: "", id: "waitlist-row-id" });
    expect(rpc).toHaveBeenCalledWith("waitlist_submit", expect.objectContaining({
      p_answer_text: "A small tour",
      p_email: "artist@example.com",
    }));
  });
});
