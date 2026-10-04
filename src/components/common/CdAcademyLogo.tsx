import React from 'react';

interface CdAcademyLogoProps {
  variant?: 'badge' | 'inline' | 'iconOnly';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CdAcademyLogo: React.FC<CdAcademyLogoProps> = ({
  variant = 'badge',
  size = 'md',
  showTagline = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { iconSize: 28, textClass: 'text-sm', badgeP: 'p-1 rounded-lg' },
    sm: { iconSize: 36, textClass: 'text-base', badgeP: 'p-1.5 rounded-xl' },
    md: { iconSize: 48, textClass: 'text-xl', badgeP: 'p-2.5 rounded-2xl' },
    lg: { iconSize: 64, textClass: 'text-2xl', badgeP: 'p-3.5 rounded-2xl' },
    xl: { iconSize: 96, textClass: 'text-4xl', badgeP: 'p-5 rounded-3xl' }
  };

  const currentSize = sizeMap[size];

  // Vector graphics matching the exact uploaded image
  const LogoGraphics = ({ dim }: { dim: number }) => (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm select-none"
    >
      {/* Background Radiance Rays */}
      <g stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.45">
        <line x1="100" y1="90" x2="100" y2="18" />
        <line x1="100" y1="90" x2="80" y2="22" />
        <line x1="100" y1="90" x2="120" y2="22" />
        <line x1="100" y1="90" x2="62" y2="34" />
        <line x1="100" y1="90" x2="138" y2="34" />
        <line x1="100" y1="90" x2="48" y2="52" />
        <line x1="100" y1="90" x2="152" y2="52" />
        <line x1="100" y1="90" x2="38" y2="76" />
        <line x1="100" y1="90" x2="162" y2="76" />
      </g>

      {/* Stylized Open Book Green Leaf Wings */}
      <g stroke="#ffffff" strokeWidth="1.2">
        {/* Left Upper Leaf */}
        <path
          d="M100,136 C90,118 64,96 38,92 C38,107 52,118 97,142 Z"
          fill="#22c55e"
        />
        {/* Left Middle Leaf */}
        <path
          d="M100,142 C88,128 62,113 41,113 C44,127 58,137 98,148 Z"
          fill="#16a34a"
        />
        {/* Left Lower Leaf */}
        <path
          d="M100,148 C89,139 70,132 54,134 C58,146 74,155 100,156 Z"
          fill="#15803d"
        />

        {/* Right Upper Leaf */}
        <path
          d="M100,136 C110,118 136,96 162,92 C162,107 148,118 103,142 Z"
          fill="#22c55e"
        />
        {/* Right Middle Leaf */}
        <path
          d="M100,142 C112,128 138,113 159,113 C156,127 142,137 102,148 Z"
          fill="#16a34a"
        />
        {/* Right Lower Leaf */}
        <path
          d="M100,148 C111,139 130,132 146,134 C142,146 126,155 100,156 Z"
          fill="#15803d"
        />

        {/* Central Book Spine Glow */}
        <path d="M100,138 L95,154 L100,151 L105,154 Z" fill="#ffffff" stroke="none" />
      </g>

      {/* 3D Graduation Cap (Mortarboard) */}
      <g>
        {/* Lower Left Facet */}
        <polygon points="68,76 100,96 100,120 68,98" fill="#991b1b" />
        {/* Lower Right Facet */}
        <polygon points="132,76 100,96 100,120 132,98" fill="#dc2626" />
        {/* Cap Top Rhombus with crisp white trim */}
        <polygon
          points="100,42 154,66 100,88 46,66"
          fill="#e11d48"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Top inner bevel facet */}
        <polygon
          points="100,46 148,66 100,83 52,66"
          fill="#ef4444"
        />
        {/* Cap Center Button */}
        <circle cx="100" cy="66" r="4.5" fill="#ffffff" />
        <circle cx="100" cy="66" r="2.5" fill="#fca5a5" />

        {/* Tassel cord dangling to the right */}
        <path
          d="M100,66 Q128,68 135,84"
          fill="none"
          stroke="#f87171"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Tassel drop */}
        <ellipse
          cx="136"
          cy="92"
          rx="3.2"
          ry="6.5"
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );

  if (variant === 'iconOnly') {
    return (
      <div
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
      >
        <LogoGraphics dim={currentSize.iconSize} />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center bg-black border border-neutral-800 text-white shadow-xl ${currentSize.badgeP} ${onClick ? 'cursor-pointer hover:border-neutral-700 transition' : ''} ${className}`}
      >
        <LogoGraphics dim={currentSize.iconSize} />
        <div className="text-center mt-1">
          <div className={`font-black tracking-wider text-white font-sans ${currentSize.textClass} leading-tight`}>
            CD ACADEMY
          </div>
          {showTagline && (
            <div className="text-[10px] sm:text-xs font-bold text-red-500 tracking-widest uppercase mt-0.5">
              Har Bachha Padhega
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline variant (light/standard background navigation)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="p-1 rounded-xl bg-black shadow-md flex items-center justify-center">
        <LogoGraphics dim={currentSize.iconSize * 0.9} />
      </div>
      <div className="flex flex-col">
        <span className={`font-black tracking-tight text-slate-900 leading-none ${currentSize.textClass}`}>
          CD <span className="text-red-600">ACADEMY</span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-bold text-red-600 tracking-wider uppercase mt-0.5">
            Har Bachha Padhega
          </span>
        )}
      </div>
    </div>
  );
};
