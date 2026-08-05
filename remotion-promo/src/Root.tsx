import { Composition } from "remotion";
import { CadencePromo, TOTAL_FRAMES } from "./cadence/CadencePromo";
import { CascadeCaptureEval, CASCADE_LOOP_FRAMES } from "./cadence/CascadeCaptureEval";
import { FPS } from "./cadence/tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CadencePromo"
        component={CadencePromo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="CascadeCaptureEval"
        component={CascadeCaptureEval}
        durationInFrames={CASCADE_LOOP_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
