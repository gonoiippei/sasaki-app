import Link from "next/link";

function SasakiLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 220"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Angular S shape - thick stroke like YAZAWA's Z */}
      <path
        d="M 210 20 L 90 20 L 90 88 L 210 88 L 210 155 L 90 155"
        fill="none"
        stroke="#c41e1e"
        strokeWidth="18"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      {/* S.SASAKI text */}
      <text
        x="150"
        y="205"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Impact', sans-serif"
        fontWeight="900"
        fontSize="38"
        fill="#c41e1e"
        letterSpacing="4"
        fontStyle="italic"
      >
        S.SASAKI
      </text>
      {/* ® mark */}
      <text
        x="272"
        y="195"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fill="#c41e1e"
      >
        ®
      </text>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,30,30,0.08)_0%,_transparent_70%)]" />

      {/* Logo */}
      <div className="animate-fade-in mb-6 relative z-10">
        <SasakiLogo className="w-64 h-44 md:w-80 md:h-56" />
      </div>

      {/* Title */}
      <h1 className="animate-fade-in-delay text-xl md:text-3xl font-bold text-center leading-relaxed mb-10 relative z-10">
        <span className="text-gray-400">ボクはいいんだけど、</span>
        <br />
        <span className="text-red-600 text-4xl md:text-6xl tracking-[0.2em] font-black italic">
          SASAKI
        </span>
        <br />
        <span className="text-gray-400">がなんて言うかな？</span>
      </h1>

      {/* CTA Button */}
      <Link
        href="/ask"
        className="animate-fade-in-delay2 animate-pulse-glow bg-red-700 hover:bg-red-600 text-white font-bold text-lg md:text-xl px-10 py-4 rounded-full transition-colors duration-300 shadow-lg tracking-wider relative z-10"
      >
        SASAKIに聞く
      </Link>
    </div>
  );
}
