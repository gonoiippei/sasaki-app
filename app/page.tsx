import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4">
      {/* Silhouette icon */}
      <div className="animate-fade-in mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-2xl">
          <svg
            className="w-20 h-20 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="animate-fade-in-delay text-2xl md:text-4xl font-bold text-center leading-relaxed mb-4">
        <span className="text-gray-400">ボクはいいんだけど、</span>
        <br />
        <span className="text-yellow-500 text-4xl md:text-6xl tracking-wider">
          SASAKI
        </span>
        <br />
        <span className="text-gray-400">がなんて言うかな？</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-in-delay2 text-gray-500 text-sm md:text-base mb-12 text-center">
        佐々木の日報とメッセージを学習したAIが、佐々木として回答します
      </p>

      {/* CTA Button */}
      <Link
        href="/ask"
        className="animate-fade-in-delay2 animate-pulse-glow bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-lg md:text-xl px-10 py-4 rounded-full transition-colors duration-300 shadow-lg"
      >
        SASAKIに聞く
      </Link>
    </div>
  );
}
