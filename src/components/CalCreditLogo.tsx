import type { CSSProperties } from 'react';
import compactLightUrl from '../../design/calcredit-logo/calcredit_logo_compact_light.svg?url';
import compactDarkUrl from '../../design/calcredit-logo/calcredit_logo_compact_dark.svg?url';
import markLightUrl from '../../design/calcredit-logo/calcredit_mark_light.svg?url';
import markDarkUrl from '../../design/calcredit-logo/calcredit_mark_dark.svg?url';
import appIconLightUrl from '../../design/calcredit-logo/calcredit_app_icon_light.svg?url';
import appIconDarkUrl from '../../design/calcredit-logo/calcredit_app_icon_dark.svg?url';

/**
 * CalCredit logo: the single source of truth for the mark and the wordmark.
 * Uses official vector assets from /design/calcredit-logo/ (zero main branch legacy assets).
 *
 * Brand Guidelines:
 * - Red accent strictly fixed at #E23B22 in both light and dark modes.
 * - Ink adapts: #1B1815 in light mode, #F5EEDC (cream) in dark mode for legibility.
 * - Zero yellow anywhere.
 * - Native JSX vector paths matching design/calcredit-logo/calcredit_logo_compact_*.svg
 */
export type Props = {
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
  /** Theme override: 'light' | 'dark' */
  theme?: 'light' | 'dark';
};

// Aspect ratio for wordmark (width 288, height 49 => ~5.8776)
const WORD_ASPECT = 288 / 49;

export function MarkPlain({ theme }: { theme?: 'light' | 'dark' }) {
  const ink =
    theme === 'dark'
      ? '#F5EEDC'
      : theme === 'light'
      ? '#1B1815'
      : 'var(--cc-credit, #1B1815)';
  const cal = theme === 'dark' ? '#FF5440' : '#E23B22';

  return (
    <g transform="translate(-3 0)">
      {/* 10 Digits */}
      <g
        fill="none"
        stroke={ink}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M43 46 V82 M43 46 L33 54" />
        <ellipse cx="69" cy="64" rx="11" ry="18" />
      </g>
      {/* Red C Arc (radius 38, centre (56, 64)) */}
      <path
        d="M84.24 38.57 A38 38 0 1 0 84.24 89.43"
        fill="none"
        stroke={cal}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Red-tipped Pen at tangent */}
      <g transform="translate(84.24 89.43) rotate(42)">
        <path
          d="M-5.5 -50 Q-5.5 -54 0 -54 Q5.5 -54 5.5 -50 V-17 L1.4 -1 H-1.4 L-5.5 -17 Z"
          fill={ink}
        />
        <path
          d="M-5.5 -17 L-1.4 -1 H1.4 L5.5 -17 Z"
          fill={cal}
        />
      </g>
    </g>
  );
}

export function MarkTile({ theme }: { theme?: 'light' | 'dark' }) {
  const ink = theme === 'dark' ? '#F5EEDC' : '#1B1815';
  const cal = theme === 'dark' ? '#FF5440' : '#E23B22';

  return (
    <>
      <rect width="128" height="128" rx="28" fill="#F5EEDC" />
      <g transform="translate(-3 0)">
        <g
          fill="none"
          stroke="#1B1815"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M43 46 V82 M43 46 L33 54" />
          <ellipse cx="69" cy="64" rx="11" ry="18" />
        </g>
        <path
          d="M84.24 38.57 A38 38 0 1 0 84.24 89.43"
          fill="none"
          stroke={cal}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <g transform="translate(84.24 89.43) rotate(42)">
          <path
            d="M-5.5 -50 Q-5.5 -54 0 -54 Q5.5 -54 5.5 -50 V-17 L1.4 -1 H-1.4 L-5.5 -17 Z"
            fill="#1B1815"
          />
          <path
            d="M-5.5 -17 L-1.4 -1 H1.4 L5.5 -17 Z"
            fill={cal}
          />
        </g>
      </g>
    </>
  );
}

export function Wordmark({ theme }: { theme?: 'light' | 'dark' }) {
  const ink =
    theme === 'dark'
      ? '#F5EEDC'
      : theme === 'light'
      ? '#1B1815'
      : 'var(--cc-credit, #1B1815)';
  const cal = theme === 'dark' ? '#FF5440' : '#E23B22';

  return (
    <>
      {/* "Cal" in brand Red */}
      <g
        fill="none"
        stroke={cal}
        strokeWidth="7.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M38.36 6.62 A20 20 0 1 0 38.36 33.38" />
        <circle cx="67.50" cy="26" r="14" />
        <path d="M81.5 12 V40" />
        <path d="M97.5 0 V40" />
      </g>

      {/* "Credit" in Ink */}
      <g
        fill="none"
        stroke={ink}
        strokeWidth="7.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M146.36 6.62 A20 20 0 1 0 146.36 33.38" />
        <path d="M162.5 12 V40 M162.5 28 A14 14 0 0 1 176.5 12" />
        <path d="M186.5 26 H214.5 A14 14 0 1 0 211.53 34.62" />
        <circle cx="239.50" cy="26" r="14" />
        <path d="M253.5 0 V40" />
        <path d="M269.5 12 V40" />
        <path d="M287.5 3 V33 Q287.5 40 294.5 40 H296.5 M281.5 12 H295.5" />
      </g>

      {/* Red dot on the 'i' */}
      <circle
        cx="269.5"
        cy="1.5"
        r="4.34"
        fill={cal}
      />
    </>
  );
}

export default function CalCreditLogo({
  markSize = 36,
  wordHeight = 24,
  tile = false,
  gap = 10,
  className,
  style,
  theme,
}: Props) {
  const hasMark = markSize > 0;
  const hasWordmark = wordHeight > 0;
  const compact = hasMark && hasWordmark && !tile;
  const assetWidth = compact ? Math.max(110, markSize * (448 / 128)) : markSize;
  const assetHeight = compact ? assetWidth * (528 / 1344) : markSize;
  const lightAsset = tile
    ? appIconLightUrl
    : compact
      ? compactLightUrl
      : markLightUrl;
  const darkAsset = tile
    ? appIconDarkUrl
    : compact
      ? compactDarkUrl
      : markDarkUrl;

  const renderAsset = (src: string, variantClass = '') => (
    <img
      src={src}
      width={assetWidth}
      height={assetHeight}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`brand-sheet-logo__image shrink-0 ${variantClass}`}
    />
  );

  return (
    <span
      role="img"
      aria-label="CalCredit"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: !compact && hasMark && hasWordmark ? gap : 0,
        lineHeight: 0,
        ...style,
      }}
    >
      {hasMark && (
        theme
          ? renderAsset(theme === 'dark' ? darkAsset : lightAsset)
          : <>
              {renderAsset(lightAsset, 'brand-sheet-logo__auto-light')}
              {renderAsset(darkAsset, 'brand-sheet-logo__auto-dark')}
            </>
      )}
      {!hasMark && hasWordmark && (
        <svg
          height={wordHeight}
          width={wordHeight * WORD_ASPECT}
          aria-hidden="true"
          viewBox="14 -4 288 49"
          preserveAspectRatio="xMidYMid meet"
          className="shrink-0"
        >
          <Wordmark theme={theme} />
        </svg>
      )}
    </span>
  );
}
