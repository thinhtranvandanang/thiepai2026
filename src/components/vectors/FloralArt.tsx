import React from 'react';
import { FlowerType } from '../../types/card';

interface FloralArtProps {
  flower: FlowerType;
  primary: string;
  accent: string;
  isDarkCanvas?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const FloralArt: React.FC<FloralArtProps> = ({
  flower,
  primary,
  accent,
  isDarkCanvas = false,
  className = '',
  style,
}) => {
  if (flower === 'none') return null;

  const strokeColor = isDarkCanvas ? '#F5DFB0' : primary;
  const leafColor = isDarkCanvas ? '#8BB59E' : '#4C7257';
  const accentFill = isDarkCanvas ? '#E2B86B' : accent;

  if (flower === 'lotus') {
    return (
      <svg
        viewBox="0 0 180 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {/* Lotus pad / leaves */}
        <path
          d="M28 106C46 92 70 96 90 112C110 96 134 92 152 106C128 118 106 118 90 115C74 118 52 118 28 106Z"
          fill={leafColor}
          fillOpacity="0.18"
          stroke={leafColor}
          strokeWidth="1.4"
        />
        {/* Outer left & right petals */}
        <path
          d="M90 105C62 100 38 82 32 58C52 60 74 75 90 105Z"
          fill={strokeColor}
          fillOpacity="0.12"
          stroke={strokeColor}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M90 105C118 100 142 82 148 58C128 60 106 75 90 105Z"
          fill={strokeColor}
          fillOpacity="0.12"
          stroke={strokeColor}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Mid left & right petals */}
        <path
          d="M90 104C66 86 55 58 60 34C76 48 86 72 90 104Z"
          fill={strokeColor}
          fillOpacity="0.18"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M90 104C114 86 125 58 120 34C104 48 94 72 90 104Z"
          fill={strokeColor}
          fillOpacity="0.18"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Center tall petal */}
        <path
          d="M90 104C74 78 74 44 90 18C106 44 106 78 90 104Z"
          fill={strokeColor}
          fillOpacity="0.22"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Delicate stamen dots */}
        <circle cx="90" cy="52" r="2.2" fill={accentFill} />
        <circle cx="84" cy="58" r="1.8" fill={accentFill} />
        <circle cx="96" cy="58" r="1.8" fill={accentFill} />
        {/* Side buds */}
        <path
          d="M42 84C35 76 34 68 38 62C44 68 45 76 42 84Z"
          fill={accentFill}
          fillOpacity="0.22"
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <path
          d="M138 84C145 76 146 68 142 62C136 68 135 76 138 84Z"
          fill={accentFill}
          fillOpacity="0.22"
          stroke={strokeColor}
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  if (flower === 'rose') {
    return (
      <svg
        viewBox="0 0 180 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {/* Foliage */}
        <path
          d="M42 92C26 84 20 68 24 58C38 60 50 74 58 92"
          fill={leafColor}
          fillOpacity="0.18"
          stroke={leafColor}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M138 92C154 84 160 68 156 58C142 60 130 74 122 92"
          fill={leafColor}
          fillOpacity="0.18"
          stroke={leafColor}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path d="M90 116V84" stroke={leafColor} strokeWidth="1.6" strokeLinecap="round" />
        {/* Outer rose petals */}
        <path
          d="M90 88C64 88 52 68 58 48C64 32 82 28 90 36C98 28 116 32 122 48C128 68 116 88 90 88Z"
          fill={strokeColor}
          fillOpacity="0.14"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <path
          d="M66 66C58 50 68 34 86 34C98 34 110 44 108 60"
          fill={strokeColor}
          fillOpacity="0.15"
          stroke={strokeColor}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Inner spiral */}
        <path
          d="M90 66C80 66 74 58 78 49C82 42 94 42 98 50C101 57 94 64 87 61C82 59 83 51 89 51"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Small side rosebuds */}
        <circle
          cx="46"
          cy="64"
          r="9"
          fill={accentFill}
          fillOpacity="0.18"
          stroke={strokeColor}
          strokeWidth="1.3"
        />
        <path d="M43 63C46 58 50 60 48 65" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
        <circle
          cx="134"
          cy="64"
          r="9"
          fill={accentFill}
          fillOpacity="0.18"
          stroke={strokeColor}
          strokeWidth="1.3"
        />
        <path d="M131 63C134 58 138 60 136 65" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (flower === 'chrysanthemum') {
    const petalAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    return (
      <svg
        viewBox="0 0 180 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-hidden="true"
      >
        <path
          d="M52 102C40 94 34 80 38 72C48 76 58 88 64 102"
          fill={leafColor}
          fillOpacity="0.2"
          stroke={leafColor}
          strokeWidth="1.4"
        />
        <path
          d="M128 102C140 94 146 80 142 72C132 76 122 88 116 102"
          fill={leafColor}
          fillOpacity="0.2"
          stroke={leafColor}
          strokeWidth="1.4"
        />
        <g transform="translate(90 62)">
          {petalAngles.map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-24"
              rx="5.5"
              ry="16"
              transform={`rotate(${deg})`}
              fill={accentFill}
              fillOpacity="0.22"
              stroke={strokeColor}
              strokeWidth="1.3"
            />
          ))}
          {petalAngles.map((deg) => (
            <ellipse
              key={`inner-${deg}`}
              cx="0"
              cy="-14"
              rx="4"
              ry="10"
              transform={`rotate(${deg + 15})`}
              fill={strokeColor}
              fillOpacity="0.14"
              stroke={strokeColor}
              strokeWidth="1.1"
            />
          ))}
          <circle cx="0" cy="0" r="8" fill={accentFill} fillOpacity="0.65" stroke={strokeColor} strokeWidth="1.4" />
        </g>
      </svg>
    );
  }

  if (flower === 'sunflower') {
    const outerRays = Array.from({ length: 16 }, (_, i) => i * 22.5);
    return (
      <svg
        viewBox="0 0 180 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-hidden="true"
      >
        <path d="M90 118V90" stroke={leafColor} strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M90 108C74 104 62 94 58 84C70 84 82 94 90 108Z"
          fill={leafColor}
          fillOpacity="0.2"
          stroke={leafColor}
          strokeWidth="1.3"
        />
        <path
          d="M90 108C106 104 118 94 122 84C110 84 98 94 90 108Z"
          fill={leafColor}
          fillOpacity="0.2"
          stroke={leafColor}
          strokeWidth="1.3"
        />
        <g transform="translate(90 58)">
          {outerRays.map((deg) => (
            <path
              key={deg}
              d="M0 -14C4 -26 4 -36 0 -41C-4 -36 -4 -26 0 -14Z"
              transform={`rotate(${deg})`}
              fill="#E4AF38"
              fillOpacity="0.38"
              stroke={strokeColor}
              strokeWidth="1.2"
            />
          ))}
          <circle cx="0" cy="0" r="14" fill={strokeColor} fillOpacity="0.82" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="9.5" fill="none" stroke="#F8E9C8" strokeWidth="1" strokeDasharray="2 2.5" />
          <circle cx="-3" cy="-2" r="1.2" fill="#F8E9C8" />
          <circle cx="3" cy="-2" r="1.2" fill="#F8E9C8" />
          <circle cx="0" cy="3" r="1.2" fill="#F8E9C8" />
        </g>
      </svg>
    );
  }

  // Orchid
  return (
    <svg
      viewBox="0 0 180 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Graceful arching stem */}
      <path
        d="M34 114C56 90 78 62 118 40C132 32 146 30 156 34"
        stroke={leafColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M34 114C30 92 38 78 52 72C48 88 44 100 34 114Z"
        fill={leafColor}
        fillOpacity="0.2"
        stroke={leafColor}
        strokeWidth="1.3"
      />
      {/* Main orchid blossom */}
      <g transform="translate(96 58)">
        <ellipse cx="0" cy="-16" rx="8" ry="13" fill={strokeColor} fillOpacity="0.16" stroke={strokeColor} strokeWidth="1.4" />
        <ellipse cx="-16" cy="-2" rx="13" ry="8" transform="rotate(-12 -16 -2)" fill={strokeColor} fillOpacity="0.2" stroke={strokeColor} strokeWidth="1.4" />
        <ellipse cx="16" cy="-2" rx="13" ry="8" transform="rotate(12 16 -2)" fill={strokeColor} fillOpacity="0.2" stroke={strokeColor} strokeWidth="1.4" />
        <path d="M-8 10C-12 20 -4 26 0 22C4 26 12 20 8 10Z" fill={accentFill} fillOpacity="0.32" stroke={strokeColor} strokeWidth="1.3" />
        <circle cx="0" cy="2" r="4" fill={accentFill} />
      </g>
      {/* Secondary smaller blossom */}
      <g transform="translate(132 42) scale(0.65)">
        <ellipse cx="0" cy="-16" rx="8" ry="13" fill={strokeColor} fillOpacity="0.16" stroke={strokeColor} strokeWidth="1.5" />
        <ellipse cx="-16" cy="-2" rx="13" ry="8" fill={strokeColor} fillOpacity="0.2" stroke={strokeColor} strokeWidth="1.5" />
        <ellipse cx="16" cy="-2" rx="13" ry="8" fill={strokeColor} fillOpacity="0.2" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="0" cy="2" r="4" fill={accentFill} />
      </g>
      {/* Bud */}
      <circle cx="154" cy="34" r="4.5" fill={strokeColor} fillOpacity="0.25" stroke={strokeColor} strokeWidth="1.2" />
    </svg>
  );
};

interface CornerFlourishProps {
  color: string;
  size?: number;
}

export const CornerFlourish: React.FC<CornerFlourishProps> = ({ color, size = 34 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2 30V6C2 3.79086 3.79086 2 6 2H30"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 22V10C8 8.89543 8.89543 8 10 8H22"
      stroke={color}
      strokeWidth="1"
      strokeOpacity="0.65"
      strokeLinecap="round"
    />
    <circle cx="6" cy="6" r="1.8" fill={color} />
  </svg>
);
