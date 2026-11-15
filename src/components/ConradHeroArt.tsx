export function ConradHeroArt() {
  return (
    <div className="relative mx-auto aspect-4/5 w-full max-w-md lg:max-w-none">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-14px) rotate(-6deg); } }
        @keyframes flame { 0%,100% { transform: scaleY(1); opacity: .9; } 50% { transform: scaleY(1.18); opacity: 1; } }
        @keyframes twinkle { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
        @keyframes orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes drift { 0% { transform: translateX(0); } 100% { transform: translateX(12px); } }
        .ch-rocket { animation: float 4s ease-in-out infinite; transform-origin: 50% 50%; }
        .ch-flame { animation: flame 0.6s ease-in-out infinite; transform-origin: 50% 0%; }
        .ch-star { animation: twinkle 2.4s ease-in-out infinite; }
        .ch-orbit { animation: orbit 18s linear infinite; transform-origin: 400px 470px; }
        .ch-badge { animation: pulse 2.6s ease-in-out infinite; transform-origin: center; }
        .ch-planet { animation: drift 6s ease-in-out infinite alternate; }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 1000"
        width="100%"
        height="100%"
        role="img"
        aria-label="NASA Conrad Challenge preparation course"
        className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
      >
        <defs>
          <radialGradient id="g1" cx="0.2" cy="0.15" r="0.5">
            <stop offset="0%" stopColor="#F28F6B" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F28F6B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="0.85" cy="0.3" r="0.5">
            <stop offset="0%" stopColor="#A3E4D7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#A3E4D7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g3" cx="0.5" cy="0.9" r="0.45">
            <stop offset="0%" stopColor="#6FD3BE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6FD3BE" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rocket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D6ECFB" />
          </linearGradient>
          <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD3B6" />
            <stop offset="50%" stopColor="#F28F6B" />
            <stop offset="100%" stopColor="#B4532A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* stars */}
        <g fill="#FFFFFF">
          {[
            [60, 80, 1.5, 0],
            [140, 160, 1, 0.4],
            [220, 60, 1.2, 0.8],
            [310, 130, 0.9, 1.2],
            [400, 90, 1.4, 0.2],
            [500, 170, 1, 1.6],
            [600, 70, 1.3, 0.6],
            [700, 150, 1.1, 1.0],
            [760, 50, 1.6, 0.3],
            [90, 260, 1, 1.4],
            [720, 280, 1.2, 0.9],
            [180, 340, 0.8, 1.7],
            [650, 400, 1, 0.5],
            [50, 470, 1.1, 1.1],
            [770, 520, 0.9, 0.7],
            [300, 470, 0.7, 1.3],
            [520, 520, 1, 1.9],
          ].map(([cx, cy, r, d], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              opacity="0.9"
              className="ch-star"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </g>

        {/* planet */}
        <g className="ch-planet">
          <circle cx="680" cy="200" r="46" fill="#1F6FB2" opacity="0.35" />
          <circle cx="680" cy="200" r="46" fill="none" stroke="#A3E4D7" strokeWidth="1.5" opacity="0.4" />
          <ellipse cx="680" cy="200" rx="70" ry="14" fill="none" stroke="#A3E4D7" strokeWidth="1" opacity="0.35" />
        </g>

        {/* orbit ring */}
        <g className="ch-orbit">
          <ellipse cx="400" cy="470" rx="150" ry="40" fill="none" stroke="#FFD3B6" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" />
        </g>

        {/* rocket */}
        <g className="ch-rocket">
          <g transform="translate(400 470) rotate(-8)">
            <path d="M-18 95 Q0 170 18 95 Z" fill="url(#flame)" className="ch-flame" />
            <path d="M-10 95 Q0 140 10 95 Z" fill="#FFD3B6" opacity="0.85" className="ch-flame" />
            <path d="M-26 90 L-26 -40 Q0 -95 26 -40 L26 90 Z" fill="url(#rocket)" stroke="#0B4650" strokeWidth="2" />
            <path d="M-26 -40 Q0 -100 26 -40 Z" fill="#F28F6B" />
            <circle cx="0" cy="-10" r="11" fill="#1B7A88" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="-3" cy="-13" r="3" fill="#FFFFFF" opacity="0.6" />
            <path d="M-26 50 L-46 85 L-26 85 Z" fill="#F28F6B" />
            <path d="M26 50 L46 85 L26 85 Z" fill="#F28F6B" />
            <rect x="-26" y="25" width="52" height="8" fill="#0B4650" opacity="0.15" />
          </g>
        </g>

        {/* floating badge 1 */}
        <g className="ch-badge">
          <rect x="120" y="300" width="170" height="46" rx="23" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <text x="205" y="329" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
            12 classes · 6 modules
          </text>
        </g>

        {/* floating badge 2 */}
        <g className="ch-badge" style={{ animationDelay: "1.3s" }}>
          <rect x="520" y="620" width="150" height="46" rx="23" fill="rgba(242,143,107,0.25)" stroke="#F28F6B" strokeWidth="1" />
          <text x="595" y="649" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="800" fill="#FFD3B6" textAnchor="middle">
            Early bird ৳2,499
          </text>
        </g>
      </svg>
    </div>
  );
}
