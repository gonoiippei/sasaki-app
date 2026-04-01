"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setError("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "エラーが発生しました");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("ストリームを取得できません");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        accumulated += text;
        setAnswer(accumulated);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "エラーが発生しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            &larr; トップに戻る
          </Link>
          <h1 className="text-sm md:text-base text-center">
            <span className="text-gray-400">ボクはいいんだけど、</span>
            <span className="text-red-600 font-black italic">SASAKI</span>
            <span className="text-gray-400">がなんて言うかな？</span>
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Question input */}
        <div className="mb-8">
          <label className="block text-gray-400 text-sm mb-2">
            佐々木に質問してみよう
          </label>
          <div className="flex gap-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例：成長するにはどうすればいい？"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleAsk}
              disabled={isLoading || !question.trim()}
              className="bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold px-6 py-3 rounded-lg transition-colors self-end"
            >
              {isLoading ? "考え中..." : "聞いてみる"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        {/* Answer */}
        {(answer || isLoading) && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-700 flex-shrink-0">
                <Image
                  src="/img_3479_720.jpg"
                  alt="SASAKI"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-red-600 font-black text-lg italic tracking-wider">
                SASAKI
              </span>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-6 py-4">
              <p
                className={`text-gray-200 whitespace-pre-wrap leading-relaxed ${
                  isLoading && !answer ? "typing-cursor" : ""
                }`}
              >
                {answer || ""}
              </p>
              {isLoading && (
                <span className="inline-block mt-2 text-red-500 text-sm animate-pulse">
                  佐々木が考えています...
                </span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
