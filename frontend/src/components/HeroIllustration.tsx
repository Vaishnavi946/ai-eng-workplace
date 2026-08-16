export default function HeroIllustration() {
  return (
    <svg width="360" height="300" viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="180" cy="260" rx="70" ry="12" fill="#E9E5F5" />

      <rect x="150" y="230" width="60" height="10" rx="4" fill="#1E1B2E" />
      <rect x="130" y="140" width="100" height="90" rx="8" fill="#1E1B2E" />
      <rect x="138" y="148" width="84" height="70" rx="4" fill="#F8F7FC" />
      <rect x="146" y="160" width="36" height="5" rx="2.5" fill="#7C3AED" />
      <rect x="146" y="172" width="58" height="5" rx="2.5" fill="#A29DB8" />
      <rect x="146" y="184" width="46" height="5" rx="2.5" fill="#A29DB8" />
      <rect x="146" y="196" width="30" height="5" rx="2.5" fill="#10B981" />

      <ellipse cx="180" cy="270" rx="58" ry="12" fill="#E9E5F5" fillOpacity="0.6" />
      <rect x="152" y="228" width="56" height="58" rx="20" fill="#7C3AED" />
      <circle cx="180" cy="212" r="22" fill="#FDD9B5" />
      <path d="M158 205 a22 22 0 0 1 44 0 q-5 -10 -22 -10 t-22 10Z" fill="#3B3550" />
      <rect x="134" y="234" width="12" height="36" rx="6" fill="#7C3AED" transform="rotate(-12 134 234)" />
      <rect x="214" y="234" width="12" height="36" rx="6" fill="#7C3AED" transform="rotate(12 214 234)" />

      <g>
        <rect x="10" y="30" width="88" height="52" rx="12" fill="white" stroke="#E9E5F5" strokeWidth="2" />
        <circle cx="34" cy="56" r="9" fill="#7C3AED" fillOpacity="0.15" stroke="#7C3AED" strokeWidth="1.5" />
        <text x="34" y="60" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#7C3AED">SP</text>
        <rect x="52" y="48" width="36" height="5" rx="2.5" fill="#E9E5F5" />
        <rect x="52" y="58" width="26" height="5" rx="2.5" fill="#E9E5F5" />
      </g>

      <g>
        <rect x="256" y="10" width="88" height="52" rx="12" fill="white" stroke="#E9E5F5" strokeWidth="2" />
        <circle cx="280" cy="36" r="9" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="280" y="40" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#F59E0B">PR</text>
        <rect x="298" y="28" width="36" height="5" rx="2.5" fill="#E9E5F5" />
        <rect x="298" y="38" width="26" height="5" rx="2.5" fill="#E9E5F5" />
      </g>

      <g>
        <rect x="262" y="150" width="88" height="52" rx="12" fill="white" stroke="#E9E5F5" strokeWidth="2" />
        <circle cx="286" cy="176" r="9" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1.5" />
        <text x="286" y="180" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#10B981">AI</text>
        <rect x="304" y="168" width="36" height="5" rx="2.5" fill="#E9E5F5" />
        <rect x="304" y="178" width="26" height="5" rx="2.5" fill="#E9E5F5" />
      </g>

      <line x1="98" y1="56" x2="140" y2="110" stroke="#E9E5F5" strokeWidth="2" />
      <line x1="256" y1="40" x2="215" y2="110" stroke="#E9E5F5" strokeWidth="2" />
      <line x1="262" y1="176" x2="225" y2="140" stroke="#E9E5F5" strokeWidth="2" />
    </svg>
  );
}