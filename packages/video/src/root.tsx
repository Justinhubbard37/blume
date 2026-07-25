import "./index.css";
import { Composition } from "remotion";

import { AUDIT_VIDEO_DURATION, AuditVideo } from "./audit-composition";
import { LaunchVideo } from "./composition";
import { EVAL_VIDEO_DURATION, EvalVideo } from "./eval-composition";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LaunchVideo"
      component={LaunchVideo}
      durationInFrames={1371}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="AuditVideo"
      component={AuditVideo}
      durationInFrames={AUDIT_VIDEO_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EvalVideo"
      component={EvalVideo}
      durationInFrames={EVAL_VIDEO_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
