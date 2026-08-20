import React, {createContext, useContext} from 'react';
import {beat, type Rhythm} from './timing';

const RhythmContext = createContext<Rhythm>('medium');

export const RhythmProvider: React.FC<{rhythm: Rhythm; children: React.ReactNode}> = ({
  rhythm,
  children,
}) => React.createElement(RhythmContext.Provider, {value: rhythm}, children);

export const useRhythm = () => useContext(RhythmContext);

/**
 * Converts a frame count written against the measured 30fps reference into the
 * current rhythm. Every delay and duration in a template goes through this, so
 * `rhythm="fast"` compresses the whole choreography without rewriting beats.
 */
export const useBeat = () => {
  const rhythm = useRhythm();
  return (frames: number) => beat(frames, rhythm);
};
