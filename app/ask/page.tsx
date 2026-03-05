"use client";

import { useState } from "react";
import Link from "next/link";

interface AskResponse {
  found: boolean;
  passages: string[];
  message: string;
  error?: string;
}

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "エラーが発生しました");
      }

      setResult(data);
    } catch (err) {
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
          <h1 className="text-yellow-500 font-bold text-lg">
            SASAKIに聞く
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
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleAsk}
              disabled={isLoading || !question.trim()}
              className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold px-6 py-3 rounded-lg transition-colors self-end"
            >
              {isLoading ? "検索中..." : "聞いてみる"}
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
        {result && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="text-yellow-500 font-bold text-lg">
                SASAKI
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-4">{result.message}</p>

            <div className="space-y-4">
              {result.passages.map((passage, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-6 py-4"
                >
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {passage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="animate-fade-in flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="text-yellow-500 animate-pulse">
              佐々木の発言を探しています...
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
