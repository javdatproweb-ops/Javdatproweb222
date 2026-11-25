import { useId } from 'react';
import type { FoldStyle } from '../types/shop';

interface NapkinIllustrationProps {
  foldStyle: FoldStyle;
  colorHex: string;
  accentHex: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function NapkinIllustration({
  foldStyle,
  colorHex,
  accentHex,
  size = 'md',
  className = '',
}: NapkinIllustrationProps) {
  const uid = useId().replace(/:/g, '');
  const textureId = `linen-weave-${uid}`;
  const shadowId = `napkin-shadow-${uid}`;
  const dimensions = size === 'lg' ? 'h-56 w-56 sm:h-64 sm:w-64' : 'h-34 w-34';

  return (
    <svg
      viewBox="0 0 220 220"
      role="img"
      aria-label="Иллюстрация сервировочной салфетки"
      className={`${dimensions} select-none ${className}`}
    >
      <defs>
        <pattern
          id={textureId}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke={accentHex}
            strokeOpacity="0.1"
            strokeWidth="0.7"
          />
          <circle cx="4" cy="4" r="0.55" fill={accentHex} fillOpacity="0.08" />
        </pattern>
        <filter id={shadowId} x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="7"
            floodColor="#1d1d1f"
            floodOpacity="0.1"
          />
        </filter>
      </defs>

      {/* Студийная фарфоровая подстановочная тарелка */}
      <circle
        cx="110"
        cy="112"
        r="86"
        fill="#ffffff"
        stroke="rgba(0, 0, 0, 0.07)"
        strokeWidth="1.5"
      />
      <circle
        cx="110"
        cy="112"
        r="68"
        fill="#f5f5f7"
        stroke="rgba(0, 0, 0, 0.05)"
        strokeWidth="1"
      />

      {foldStyle === 'diamond' && (
        <g filter={`url(#${shadowId})`}>
          <polygon
            points="110,32 182,110 110,188 38,110"
            fill={colorHex}
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="1"
          />
          <polygon
            points="110,32 182,110 110,188 38,110"
            fill={`url(#${textureId})`}
          />
          <polygon
            points="110,48 164,110 110,136 56,110"
            fill={colorHex}
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="1.2"
          />
          <path
            d="M 64 112 L 110 134 L 156 112"
            fill="none"
            stroke="rgba(0, 0, 0, 0.16)"
            strokeWidth="1.2"
          />
        </g>
      )}

      {foldStyle === 'pocket' && (
        <g filter={`url(#${shadowId})`}>
          <rect
            x="64"
            y="38"
            width="92"
            height="144"
            rx="8"
            fill={colorHex}
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="1"
          />
          <rect
            x="64"
            y="38"
            width="92"
            height="144"
            rx="8"
            fill={`url(#${textureId})`}
          />
          <rect x="97" y="48" width="5" height="46" rx="2.5" fill="#aeaeb2" />
          <path
            d="M 114 48 C 122 48 123 64 119 72 L 119 94 L 114 94 Z"
            fill="#d2d2d7"
          />
          <path
            d="M 64 96 L 156 114 L 156 174 C 156 178.4 152.4 182 148 182 L 72 182 C 67.6 182 64 178.4 64 174 Z"
            fill={colorHex}
            stroke="rgba(0, 0, 0, 0.12)"
            strokeWidth="1.1"
          />
          <line
            x1="64"
            y1="96"
            x2="156"
            y2="114"
            stroke="rgba(255, 255, 255, 0.72)"
            strokeWidth="1.6"
          />
        </g>
      )}

      {foldStyle === 'classic' && (
        <g filter={`url(#${shadowId})`}>
          <rect
            x="50"
            y="50"
            width="120"
            height="120"
            rx="6"
            transform="rotate(-4 110 110)"
            fill={colorHex}
            stroke="rgba(0, 0, 0, 0.08)"
            strokeWidth="1"
          />
          <rect
            x="52"
            y="52"
            width="116"
            height="116"
            rx="6"
            fill={colorHex}
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="1"
          />
          <rect
            x="52"
            y="52"
            width="116"
            height="116"
            rx="6"
            fill={`url(#${textureId})`}
          />
          <rect
            x="62"
            y="62"
            width="96"
            height="96"
            rx="4"
            fill="none"
            stroke="rgba(0, 0, 0, 0.14)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1="54"
            y1="110"
            x2="166"
            y2="110"
            stroke="rgba(0, 0, 0, 0.08)"
            strokeWidth="1"
          />
        </g>
      )}

      {foldStyle === 'roll' && (
        <g filter={`url(#${shadowId})`}>
          <rect
            x="78"
            y="36"
            width="64"
            height="148"
            rx="24"
            fill={colorHex}
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="1"
          />
          <rect
            x="78"
            y="36"
            width="64"
            height="148"
            rx="24"
            fill={`url(#${textureId})`}
          />
          <path
            d="M 96 42 Q 106 110 94 178"
            fill="none"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1.8"
          />
          <path
            d="M 122 44 Q 116 110 124 176"
            fill="none"
            stroke="rgba(0, 0, 0, 0.12)"
            strokeWidth="1.2"
          />
          <rect
            x="72"
            y="102"
            width="76"
            height="20"
            rx="8"
            fill="#1d1d1f"
          />
          <rect
            x="76"
            y="105"
            width="68"
            height="4"
            rx="2"
            fill="rgba(255, 255, 255, 0.25)"
          />
        </g>
      )}
    </svg>
  );
}
