import React from "react";
import { Composition } from "remotion";
import { Rosetta } from "./Rosetta";
import { ShotFig } from "./ShotFig";

// Motion pieces for the alexhomebarista demos. Rendered to ../media (see motion/README.md).
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Rosetta"
        component={Rosetta}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="ShotFig"
        component={ShotFig}
        durationInFrames={240}
        fps={30}
        width={1200}
        height={900}
      />
    </>
  );
};
