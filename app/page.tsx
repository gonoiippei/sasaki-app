import Link from "next/link";

function SasakiLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lightning bolt S - YAZAWA Z parody */}
      <path
        d="M190 15 L110 15 L140 80 L95 80 L110 185 L190 185 L160 120 L205 120 Z"
        fill="none"
        stroke="#c41e1e"
        strokeWidth="6"
        strokeLinejoin="bevel"
      />
      {/* S.SASAKI text */}
      <text
        x="150"
        y="178"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Impact', sans-serif"
        fontWeight="900"
        fontSize="36"
        fill="#c41e1e"
        letterSpacing="4"
        fontStyle="italic"
      >
        S.SASAKI
      </text>
      {/* ® mark */}
      <text
        x="268"
        y="158"
        fontFamily="Arial, sans-serif"
        fontSize="12"
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
      <h1 className="animate-fade-in-delay text-xl md:text-3xl font-bold text-center leading-relaxed mb-4 relative z-10">
        <span className="text-gray-400">ボクはいいんだけど、</span>
        <br />
        <span className="text-red-600 text-4xl md:text-6xl tracking-[0.2em] font-black italic">
          SASAKI
        </span>
        <br />
        <span className="text-gray-400">がなんて言うかな？</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-in-delay2 text-gray-600 text-sm md:text-base mb-12 text-center relative z-10">
        佐々木の日報とメッセージを学習したAIが、佐々木として回答します
      </p>

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
