import { COPY } from "../copy";

type BeatKey = "beat1" | "beat2" | "beat3";

interface BeatCopyProps {
  beat: BeatKey;
  dimmed?: boolean;
}

export function BeatCopy({ beat, dimmed }: BeatCopyProps) {
  const content = COPY[beat];
  return (
    <div className={`beat-copy${dimmed ? " beat-copy--dimmed" : ""}`}>
      <h1 className="beat-copy__headline">{content.headline}</h1>
      <p className="beat-copy__sub">{content.sub}</p>
    </div>
  );
}
