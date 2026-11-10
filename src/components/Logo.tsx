import React from 'react';

/**
 * CalCredit Official Logo Component
 *
 * Source of truth: /design/calcredit-logo/ (SVGs)
 * Brand rules:
 * - No yellow anywhere.
 * - Light mode: red #E23B22, ink #1B1815, paper #F7F1E1, subtitle #6B645C.
 * - Dark mode: red #FF5440, ink #F5EEDC, background #14110F, subtitle #B7AEA0.
 * - The ANNA UNIVERSITY line is used on 'full' (horizontal) at >= 240px wide; 'compact' without the line.
 * - Preserves aspect ratio without stretching or recolouring.
 */

export type LogoVariant = 'mark' | 'compact' | 'full' | 'wordmark';

export interface LogoProps {
  /**
   * - 'mark': mark alone (red C drawn by pen around "10")
   * - 'compact': mark + "CalCredit" wordmark
   * - 'full': mark + "CalCredit" + "ANNA UNIVERSITY" subtitle
   * - 'wordmark': "CalCredit" wordmark alone (no mark, typography only for app bars)
   */
  variant?: LogoVariant;
  /** Explicit theme override; if omitted, automatically tracks app dark/light mode */
  theme?: 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  id?: string;
}

const ANNA_UNIV_PATH =
  'M150.72 95.89 149.71 92.99H145.38L144.38 95.89H142L146.14 84.53H148.94L153.07 95.89ZM147.54 86.28 147.49 86.46Q147.41 86.75 147.3 87.12Q147.19 87.49 145.92 91.2H149.18L148.06 87.93L147.71 86.84Z M169.19 95.89 164.25 87.14Q164.39 88.42 164.39 89.19V95.89H162.28V84.53H165L170.02 93.35Q169.87 92.13 169.87 91.13V84.53H171.98V95.89Z M188.78 95.89 183.83 87.14Q183.98 88.42 183.98 89.19V95.89H181.87V84.53H184.58L189.6 93.35Q189.46 92.13 189.46 91.13V84.53H191.57V95.89Z M209.48 95.89 208.47 92.99H204.15L203.14 95.89H200.76L204.91 84.53H207.71L211.83 95.89ZM206.31 86.28 206.26 86.46Q206.18 86.75 206.07 87.12Q205.95 87.49 204.68 91.2H207.94L206.82 87.93L206.48 86.84Z  M238.02 96.05Q235.68 96.05 234.43 94.9Q233.19 93.76 233.19 91.63V84.53H235.57V91.45Q235.57 92.79 236.21 93.49Q236.85 94.19 238.09 94.19Q239.36 94.19 240.05 93.46Q240.73 92.73 240.73 91.37V84.53H243.11V91.51Q243.11 93.67 241.77 94.86Q240.44 96.05 238.02 96.05Z M259.8 95.89 254.86 87.14Q255 88.42 255 89.19V95.89H252.89V84.53H255.61L260.62 93.35Q260.48 92.13 260.48 91.13V84.53H262.59V95.89Z M272.48 95.89V84.53H274.86V95.89Z M290.35 95.89H287.94L283.74 84.53H286.23L288.56 91.83Q288.78 92.53 289.16 93.97L289.33 93.28L289.74 91.83L292.07 84.53H294.52Z M303.41 95.89V84.53H312.34V86.37H305.79V89.22H311.85V91.06H305.79V94.05H312.67V95.89Z M329.89 95.89 327.25 91.58H324.47V95.89H322.09V84.53H327.76Q329.79 84.53 330.9 85.41Q332 86.28 332 87.92Q332 89.11 331.32 89.98Q330.65 90.84 329.49 91.12L332.56 95.89ZM329.61 88.01Q329.61 86.38 327.51 86.38H324.47V89.73H327.58Q328.58 89.73 329.09 89.28Q329.61 88.83 329.61 88.01Z M350.94 92.61Q350.94 94.28 349.7 95.16Q348.46 96.05 346.07 96.05Q343.89 96.05 342.65 95.27Q341.4 94.5 341.05 92.93L343.35 92.55Q343.58 93.45 344.26 93.86Q344.93 94.27 346.13 94.27Q348.62 94.27 348.62 92.75Q348.62 92.27 348.34 91.95Q348.05 91.64 347.53 91.43Q347.01 91.22 345.54 90.92Q344.26 90.62 343.77 90.44Q343.27 90.26 342.86 90.02Q342.46 89.77 342.18 89.42Q341.9 89.08 341.74 88.61Q341.58 88.14 341.58 87.54Q341.58 86 342.74 85.18Q343.89 84.36 346.1 84.36Q348.21 84.36 349.27 85.03Q350.33 85.69 350.64 87.21L348.33 87.52Q348.16 86.79 347.61 86.42Q347.07 86.05 346.05 86.05Q343.89 86.05 343.89 87.4Q343.89 87.85 344.12 88.13Q344.35 88.41 344.8 88.61Q345.26 88.8 346.63 89.1Q348.27 89.45 348.97 89.74Q349.68 90.04 350.09 90.43Q350.5 90.82 350.72 91.36Q350.94 91.91 350.94 92.61Z M360.36 95.89V84.53H362.73V95.89Z M377.74 86.37V95.89H375.36V86.37H371.69V84.53H381.41V86.37Z M395.96 91.23V95.89H393.59V91.23L389.54 84.53H392.03L394.76 89.34L397.51 84.53H400Z';

export const Logo: React.FC<LogoProps> = ({
  variant = 'compact',
  theme,
  className = '',
  style,
  title = 'CalCredit',
  id,
}) => {
  // Color palette classes based on theme prop or default dynamic Tailwind classes
  const redColor =
    theme === 'dark'
      ? '#FF5440'
      : theme === 'light'
      ? '#E23B22'
      : undefined;

  const inkColor =
    theme === 'dark'
      ? '#F5EEDC'
      : theme === 'light'
      ? '#1B1815'
      : undefined;

  const subColor =
    theme === 'dark'
      ? '#B7AEA0'
      : theme === 'light'
      ? '#6B645C'
      : undefined;

  const redClass = redColor ? undefined : 'text-[#E23B22] dark:text-[#FF5440]';
  const inkClass = inkColor ? undefined : 'text-[#1B1815] dark:text-[#F5EEDC]';
  const subClass = subColor ? undefined : 'fill-[#6B645C] dark:fill-[#B7AEA0]';

  // Mark Component (128x128 coordinate space)
  const renderMark = () => (
    <g transform="translate(-3 0)">
      {/* 10 Digits */}
      <g
        fill="none"
        stroke={inkColor || 'currentColor'}
        className={inkClass}
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
        stroke={redColor || 'currentColor'}
        className={redClass}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Red-tipped Pen at tangent */}
      <g transform="translate(84.24 89.43) rotate(42)">
        <path
          d="M-5.5 -50 Q-5.5 -54 0 -54 Q5.5 -54 5.5 -50 V-17 L1.4 -1 H-1.4 L-5.5 -17 Z"
          fill={inkColor || 'currentColor'}
          className={inkClass}
        />
        <path
          d="M-5.5 -17 L-1.4 -1 H1.4 L5.5 -17 Z"
          fill={redColor || 'currentColor'}
          className={redClass}
        />
      </g>
    </g>
  );

  // Wordmark Component ("CalCredit")
  const renderWordmark = (yOffset: number) => (
    <g transform={`translate(142 ${yOffset}) scale(0.86)`}>
      {/* "Cal" in brand Red */}
      <g
        stroke={redColor || 'currentColor'}
        className={redClass}
        strokeWidth="7.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M38.36 6.62 A20 20 0 1 0 38.36 33.38" fill="none" />
        <circle cx="67.50" cy="26" r="14" fill="none" />
        <path d="M81.5 12 V40" fill="none" />
        <path d="M97.5 0 V40" fill="none" />
      </g>

      {/* "Credit" in Ink with Red dot on 'i' */}
      <g
        stroke={inkColor || 'currentColor'}
        className={inkClass}
        strokeWidth="7.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M146.36 6.62 A20 20 0 1 0 146.36 33.38" fill="none" />
        <path d="M162.5 12 V40 M162.5 28 A14 14 0 0 1 176.5 12" fill="none" />
        <path d="M186.5 26 H214.5 A14 14 0 1 0 211.53 34.62" fill="none" />
        <circle cx="239.50" cy="26" r="14" fill="none" />
        <path d="M253.5 0 V40" fill="none" />
        <path d="M269.5 12 V40" fill="none" />
        <path d="M287.5 3 V33 Q287.5 40 294.5 40 H296.5 M281.5 12 H295.5" fill="none" />
      </g>

      {/* Red dot on the 'i' */}
      <circle
        cx="269.5"
        cy="1.5"
        r="4.34"
        fill={redColor || 'currentColor'}
        className={redClass}
      />
    </g>
  );

  if (variant === 'mark') {
    return (
      <svg
        id={id}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        role="img"
        aria-label={title}
        preserveAspectRatio="xMidYMid meet"
        className={`inline-block shrink-0 ${className}`}
        style={style}
      >
        <title>{title}</title>
        {renderMark()}
      </svg>
    );
  }

  if (variant === 'wordmark') {
    return (
      <svg
        id={id}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="138 42 266 44"
        role="img"
        aria-label={title}
        preserveAspectRatio="xMidYMid meet"
        className={`inline-block shrink-0 ${className}`}
        style={style}
      >
        <title>{title}</title>
        {renderWordmark(46.80)}
      </svg>
    );
  }

  // Both compact and full use viewBox="-24 -24 448 176"
  const isFull = variant === 'full';
  const wordmarkY = isFull ? 35.12 : 46.80;

  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-24 -24 448.0 176"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
      className={`inline-block shrink-0 ${className}`}
      style={style}
    >
      <title>{title}</title>
      <g>{renderMark()}</g>
      {renderWordmark(wordmarkY)}
      {isFull && (
        <path
          fill={subColor}
          className={subClass}
          d={ANNA_UNIV_PATH}
        />
      )}
    </svg>
  );
};

export default Logo;
