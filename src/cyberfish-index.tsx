import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {CyberFishEvolution} from './projects/cyberfish/CyberFishEvolution';

const Root: React.FC = () => (
  <Composition
    id="CyberFishEvolution"
    component={CyberFishEvolution}
    durationInFrames={840}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
