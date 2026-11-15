import React from 'react';
import { BackgroundType } from '../../types/card';

interface BackgroundArtProps {
  background: BackgroundType;
  primary: string;
  accent: string;
  paper: string;
}

export const BackgroundArt: React.FC<BackgroundArtProps> = ({
  background,
  primary,
  accent,
  paper,
}) => {
  if (background === 'plain') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: paper,
          backgroundImage:
            'radial-gradient(rgba(120, 100, 80, 0.045) 1px, transparent 0)',
          backgroundSize: '18px 18px',
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (background === 'blackboard') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#193127',
          backgroundImage:
            'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.06), transparent 55%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04), transparent 50%)',
          pointerEvents: 'none',
        }}
      >
        {/* Subtle wooden chalkboard edge */}
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            border: '2px solid rgba(212, 178, 122, 0.35)',
            borderRadius: '6px',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle chalk dust smears */}
        <svg
          viewBox="0 0 600 750"
          fill="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.14 }}
          aria-hidden="true"
        >
          <path d="M48 80H145" stroke="#F5EFE2" strokeWidth="1.5" strokeDasharray="4 6" />
          <path d="M460 680H550" stroke="#F5EFE2" strokeWidth="1.5" strokeDasharray="3 5" />
          <circle cx="95" cy="670" r="22" stroke="#F5EFE2" strokeWidth="1.2" strokeDasharray="5 4" />
          <path d="M485 95L515 70L535 105Z" stroke="#F5EFE2" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  if (background === 'school') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: paper,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 600 750"
          fill="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.14 }}
          aria-hidden="true"
        >
          {/* Soft sun / morning halo */}
          <circle cx="485" cy="120" r="56" fill={accent} fillOpacity="0.25" />
          {/* Gentle school building silhouette at bottom */}
          <path
            d="M40 695H560"
            stroke={primary}
            strokeWidth="1.5"
          />
          <rect x="135" y="615" width="330" height="80" stroke={primary} strokeWidth="1.5" fill={primary} fillOpacity="0.06" />
          {/* Central roof & clock gable */}
          <path
            d="M118 615L300 555L482 615H118Z"
            stroke={primary}
            strokeWidth="1.5"
            fill={accent}
            fillOpacity="0.1"
          />
          <circle cx="300" cy="590" r="13" stroke={primary} strokeWidth="1.4" />
          <path d="M300 583V590L305 593" stroke={primary} strokeWidth="1.3" strokeLinecap="round" />
          {/* Classroom arched windows */}
          {[175, 225, 345, 395].map((x) => (
            <rect
              key={x}
              x={x}
              y="635"
              width="28"
              height="36"
              rx="14"
              stroke={primary}
              strokeWidth="1.2"
            />
          ))}
          <rect x="282" y="638" width="36" height="57" rx="18" stroke={primary} strokeWidth="1.4" />
          {/* Flanking trees */}
          <circle cx="88" cy="635" r="28" stroke={primary} strokeWidth="1.3" fill={primary} fillOpacity="0.07" />
          <path d="M88 663V695" stroke={primary} strokeWidth="1.4" />
          <circle cx="512" cy="638" r="25" stroke={primary} strokeWidth="1.3" fill={primary} fillOpacity="0.07" />
          <path d="M512 663V695" stroke={primary} strokeWidth="1.4" />
        </svg>
      </div>
    );
  }

  if (background === 'chalk') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: paper,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 600 750"
          fill="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.16 }}
          aria-hidden="true"
        >
          {/* Open book sketch top-left */}
          <path
            d="M45 92C65 82 85 84 95 94C105 84 125 82 145 92V128C125 119 105 121 95 130C85 121 65 119 45 128V92Z"
            stroke={primary}
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <path d="M95 94V130" stroke={primary} strokeWidth="1.3" />
          {/* Compass / geometry top-right */}
          <circle cx="510" cy="95" r="24" stroke={accent} strokeWidth="1.4" strokeDasharray="4 4" />
          <path d="M490 120L535 74" stroke={primary} strokeWidth="1.3" strokeDasharray="3 3" />
          {/* Musical notes & quill bottom */}
          <path
            d="M58 640C85 628 115 654 146 636"
            stroke={accent}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <path
            d="M475 635C495 612 522 605 548 595C535 618 522 634 494 645L475 635Z"
            stroke={primary}
            strokeWidth="1.4"
          />
          <path d="M464 652L480 636" stroke={primary} strokeWidth="1.5" />
          {/* Subtle notebook horizontal rules */}
          <line x1="40" y1="180" x2="560" y2="180" stroke={primary} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 6" />
          <line x1="40" y1="570" x2="560" y2="570" stroke={primary} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 6" />
        </svg>
      </div>
    );
  }

  if (background === 'autumn') {
    const leaves = [
      { x: 64, y: 82, rot: -22, scale: 1.0 },
      { x: 520, y: 108, rot: 28, scale: 0.9 },
      { x: 48, y: 380, rot: 16, scale: 0.78 },
      { x: 545, y: 420, rot: -34, scale: 0.85 },
      { x: 86, y: 655, rot: 35, scale: 1.05 },
      { x: 506, y: 662, rot: -18, scale: 0.95 },
    ];
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: paper,
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(198, 152, 72, 0.11), transparent 62%)`,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 600 750"
          fill="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.28 }}
          aria-hidden="true"
        >
          {/* Gentle breeze curves */}
          <path d="M28 145C110 120 155 162 225 142" stroke={accent} strokeWidth="1.1" strokeOpacity="0.45" strokeDasharray="4 5" />
          <path d="M395 618C455 598 510 632 572 608" stroke={accent} strokeWidth="1.1" strokeOpacity="0.45" strokeDasharray="4 5" />
          {leaves.map((leaf, idx) => (
            <g
              key={idx}
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rot}) scale(${leaf.scale})`}
            >
              <path
                d="M0 -18C9 -10 12 4 0 18C-12 4 -9 -10 0 -18Z"
                fill={idx % 2 === 0 ? accent : primary}
                fillOpacity="0.22"
                stroke={idx % 2 === 0 ? accent : primary}
                strokeWidth="1.3"
              />
              <path d="M0 -14V22" stroke={idx % 2 === 0 ? accent : primary} strokeWidth="1" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // Pattern background
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: paper,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 600 750"
        fill="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.13 }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="vn-lattice" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 0L48 24L24 48L0 24Z" stroke={primary} strokeWidth="0.9" fill="none" />
            <circle cx="24" cy="24" r="4" stroke={accent} strokeWidth="0.9" fill="none" />
          </pattern>
        </defs>
        <rect width="600" height="750" fill="url(#vn-lattice)" />
      </svg>
    </div>
  );
};
