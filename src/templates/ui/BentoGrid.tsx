import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Stage, Surface, useStagger} from '../../primitives';

/**
 * Archetype: product UI showcase — capability grid.
 * Evidence: bento-grid — 1 keep (brutalist), 0 maybe, 6 reject. Kept only in
 * its hardest-edged form; the soft variants were all rejected. A bento of soft
 * shadowed cards apparently reads as filler, a bento of hard boxes reads as a
 * spec sheet.
 *
 * Choreography (measured): cells enter in reading order at frames 5, 11, 17,
 * 24, 33, 45 — roughly a 7-frame step, faster than the standard 8 because the
 * cells are small and the eye can take two at a time.
 */
export const BentoGridSchema = z.object({
  ...stageShape,
  cells: z
    .array(
      z.object({
        icon: z.string().optional(),
        label: z.string(),
        /** Column span within a 6-column grid. Defaults alternate 4/2, 2/4. */
        span: z.number().optional(),
      }),
    )
    .min(2)
    .max(6),
});

export type BentoGridProps = z.infer<typeof BentoGridSchema>;

export const bentoGridDuration = (p: BentoGridProps) =>
  durationFor(5 + (p.cells.length - 1) * 7, p.rhythm);

export const BentoGrid: React.FC<BentoGridProps> = ({palette, skin, rhythm, cells}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Grid cells={cells} />
  </Stage>
);

const Grid: React.FC<Pick<BentoGridProps, 'cells'>> = ({cells}) => {
  const t = useTheme();
  const {u, isLandscape} = useCanvas();
  const delays = useStagger(cells.length, {delay: 5, step: 7});

  // Alternating 4/2 and 2/4 rows produce the uneven bento rhythm without
  // asking the caller to think about it.
  const spanOf = (i: number, given?: number) => given ?? (Math.floor(i / 2) % 2 === 0 ? (i % 2 === 0 ? 4 : 2) : i % 2 === 0 ? 2 : 4);

  return (
    <Column maxWidth={1360}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: isLandscape ? 20 * u : 16 * u,
        }}
      >
        {cells.map((cell, i) => (
          <FadeRise
            key={cell.label}
            delay={delays[i]}
            distance={14}
            style={{gridColumn: `span ${spanOf(i, cell.span)}`}}
          >
            <Surface
              style={{
                padding: 28 * u,
                height: isLandscape ? 168 * u : 150 * u,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <span style={{fontSize: 40 * u, lineHeight: 1}}>{cell.icon ?? ''}</span>
              <span style={textStyle(t, u, 'dataTick', {fontWeight: 650})}>{cell.label}</span>
            </Surface>
          </FadeRise>
        ))}
      </div>
    </Column>
  );
};
