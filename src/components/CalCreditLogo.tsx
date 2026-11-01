import type { CSSProperties } from 'react';

/**
 * CalCredit logo: the single source of truth for the mark and the wordmark.
 * Use this component everywhere the logo appears so it always matches the brand SVG.
 *
 * Colours come from CSS variables (see the snippet at the bottom of this file). The wordmark is
 * outlined geometry, not text, so it never depends on a font.
 */
type Props = {
  /** Height and width of the icon in px. Set to 0 to hide it. */
  markSize?: number;
  /** Height of the wordmark in px (width follows). Set to 0 to hide it. */
  wordHeight?: number;
  /** true = cream rounded tile behind the icon (app-icon look). Default false = icon only. */
  tile?: boolean;
  /** Space between icon and wordmark in px. */
  gap?: number;
  className?: string;
  style?: CSSProperties;
};

const WORD = "<g style=\"fill:var(--cc-cal,#F0482E)\"><path d=\"M35.91 -6.22A20.60 20.60 0 1 1 35.91 -33.78L31.30 -29.64A14.40 14.40 0 1 0 31.30 -10.36Z\"/><circle cx=\"33.61\" cy=\"-8.29\" r=\"3.10\"/><circle cx=\"33.61\" cy=\"-31.71\" r=\"3.10\"/><path fill-rule=\"evenodd\" d=\"M40.10 -14.00a14.60 14.60 0 1 0 29.20 0a14.60 14.60 0 1 0 -29.20 0ZM46.30 -14.00a8.40 8.40 0 1 0 16.80 0a8.40 8.40 0 1 0 -16.80 0Z\"/><path d=\"M63.30 -24.90H69.50V-3.10H63.30Z\"/><circle cx=\"66.40\" cy=\"-24.90\" r=\"3.10\"/><circle cx=\"66.40\" cy=\"-3.10\" r=\"3.10\"/><path d=\"M77.70 -40.90H83.90V-3.10H77.70Z\"/><circle cx=\"80.80\" cy=\"-40.90\" r=\"3.10\"/><circle cx=\"80.80\" cy=\"-3.10\" r=\"3.10\"/></g><g style=\"fill:var(--cc-credit,#F5EEDC)\"><path d=\"M126.61 -6.22A20.60 20.60 0 1 1 126.61 -33.78L122.00 -29.64A14.40 14.40 0 1 0 122.00 -10.36Z\"/><circle cx=\"124.31\" cy=\"-8.29\" r=\"3.10\"/><circle cx=\"124.31\" cy=\"-31.71\" r=\"3.10\"/><path d=\"M131.80 -24.90H138.00V-3.10H131.80Z\"/><circle cx=\"134.90\" cy=\"-24.90\" r=\"3.10\"/><circle cx=\"134.90\" cy=\"-3.10\" r=\"3.10\"/><path d=\"M131.87 -14.13A13.10 13.10 0 0 1 144.90 -28.60L144.90 -22.40A6.90 6.90 0 0 0 138.04 -14.78Z\"/><circle cx=\"144.90\" cy=\"-25.50\" r=\"3.10\"/><path d=\"M154.50 -17.10H180.27A14.60 14.60 0 0 1 180.27 -10.90H154.50Z\"/><path d=\"M173.30 -1.36A14.60 14.60 0 1 1 180.60 -14.00L174.40 -14.00A8.40 8.40 0 1 0 170.20 -6.73Z\"/><circle cx=\"171.75\" cy=\"-4.04\" r=\"3.10\"/><path fill-rule=\"evenodd\" d=\"M186.40 -14.00a14.60 14.60 0 1 0 29.20 0a14.60 14.60 0 1 0 -29.20 0ZM192.60 -14.00a8.40 8.40 0 1 0 16.80 0a8.40 8.40 0 1 0 -16.80 0Z\"/><path d=\"M209.60 -40.90H215.80V-3.10H209.60Z\"/><circle cx=\"212.70\" cy=\"-40.90\" r=\"3.10\"/><circle cx=\"212.70\" cy=\"-3.10\" r=\"3.10\"/><path d=\"M224.00 -24.90H230.20V-3.10H224.00Z\"/><circle cx=\"227.10\" cy=\"-24.90\" r=\"3.10\"/><circle cx=\"227.10\" cy=\"-3.10\" r=\"3.10\"/><path d=\"M244.50 -34.90H250.70V-9.50H244.50Z\"/><circle cx=\"247.60\" cy=\"-34.90\" r=\"3.10\"/><path d=\"M241.70 -28.00H253.50V-21.80H241.70Z\"/><circle cx=\"241.70\" cy=\"-24.90\" r=\"3.10\"/><circle cx=\"253.50\" cy=\"-24.90\" r=\"3.10\"/><path d=\"M255.60 0.60A11.10 11.10 0 0 1 244.56 -11.66L250.73 -11.01A4.90 4.90 0 0 0 255.60 -5.60Z\"/><circle cx=\"255.60\" cy=\"-2.50\" r=\"3.10\"/></g><g style=\"fill:var(--cc-dot,#FFD23F)\"><circle cx=\"227.10\" cy=\"-37.50\" r=\"4.40\"/></g>";
const MARK_PLAIN = "<g transform=\"translate(60 60) scale(0.95) translate(-64.5 -60)\"><g transform=\"translate(-3.5,-2)\" fill=\"none\" stroke-width=\"8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"stroke:var(--cc-credit,#F5EEDC)\"><path d=\"M35 52 L45 43.5 V80.5\"/><ellipse cx=\"76\" cy=\"63.5\" rx=\"11.5\" ry=\"17\"/></g><path d=\"M87 34 C77.6 23.6 70 21 56 21 C34.5 21 19.5 40.5 19.5 62 C19.5 83.5 38.5 98.5 60 98.5 C74 98.5 77.6 96.4 87 86\" fill=\"none\" stroke-width=\"8\" stroke-linecap=\"round\" style=\"stroke:var(--cc-cal,#F0482E)\"/><g transform=\"translate(87,86) rotate(35)\"><path d=\"M0 0L-4-9V-34Q-4-38 0-38Q4-38 4-34V-9Z\" style=\"fill:var(--cc-credit,#F5EEDC)\"/><rect x=\"-4\" y=\"-27\" width=\"8\" height=\"4.5\" style=\"fill:var(--cc-dot,#FFD23F)\"/><path d=\"M0 0L-2.4-5.4H2.4Z\" style=\"fill:var(--cc-cal,#F0482E)\"/></g></g>";
const MARK_TILE = "<rect width=\"120\" height=\"120\" rx=\"26\" fill=\"#F5EEDC\"/><g transform=\"translate(60 60) scale(0.95) translate(-64.5 -60)\"><g transform=\"translate(-3.5,-2)\" fill=\"none\" stroke-width=\"8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"stroke:#1B1815\"><path d=\"M35 52 L45 43.5 V80.5\"/><ellipse cx=\"76\" cy=\"63.5\" rx=\"11.5\" ry=\"17\"/></g><path d=\"M87 34 C77.6 23.6 70 21 56 21 C34.5 21 19.5 40.5 19.5 62 C19.5 83.5 38.5 98.5 60 98.5 C74 98.5 77.6 96.4 87 86\" fill=\"none\" stroke-width=\"8\" stroke-linecap=\"round\" style=\"stroke:#E23B22\"/><g transform=\"translate(87,86) rotate(35)\"><path d=\"M0 0L-4-9V-34Q-4-38 0-38Q4-38 4-34V-9Z\" style=\"fill:#1B1815\"/><rect x=\"-4\" y=\"-27\" width=\"8\" height=\"4.5\" style=\"fill:#FFD23F\" stroke=\"#1B1815\" stroke-width=\"1\"/><path d=\"M0 0L-2.4-5.4H2.4Z\" style=\"fill:#E23B22\"/></g></g>";
const WORD_ASPECT = 259.70 / 46.6;

export default function CalCreditLogo({
  markSize = 36, wordHeight = 24, tile = false, gap = 10, className, style,
}: Props) {
  return (
    <span
      role="img"
      aria-label="CalCredit"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap, lineHeight: 0, ...style }}
    >
      {markSize > 0 && (
        <svg
          width={markSize} height={markSize} aria-hidden="true"
          viewBox={tile ? '0 0 120 120' : '8 8 104 104'}
          dangerouslySetInnerHTML={{ __html: tile ? MARK_TILE : MARK_PLAIN }}
        />
      )}
      {wordHeight > 0 && (
        <svg
          height={wordHeight} width={wordHeight * WORD_ASPECT} aria-hidden="true"
          viewBox="-0.5 -45 259.7 46.6"
          dangerouslySetInnerHTML={{ __html: WORD }}
        />
      )}
    </span>
  );
}

/* Add once to your global CSS (for example src/index.css). Dark values are also the fallbacks above.

:root { --cc-cal: #d97757; --cc-credit: #1B1815; --cc-dot: #E89B00; }
[data-theme="dark"] { --cc-cal: #F0482E; --cc-credit: #F5EEDC; --cc-dot: #FFD23F; }
*/
