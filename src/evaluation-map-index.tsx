import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {EvaluationMap} from './projects/evaluation-map/EvaluationMap';

const Root: React.FC = () => (
  <Composition
    id="EvaluationMap"
    component={EvaluationMap}
    durationInFrames={690}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
