"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AskPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setStreamingText("");
    setError("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
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
        setStreamingText(accumulated);
      }

      setMessages([...updatedMessages, { role: "assistant", content: accumulated }]);
      setStreamingText("");
      // Count answer
      fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "answer" }) }).catch(() => {});
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setStreamingText("");
    setError("");
    setInput("");
  };

  const hasMessages = messages.length > 0 || isLoading;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition text-sm">
            &larr; トップに戻る
          </Link>
          <h1 className="text-sm md:text-base text-center">
            <span className="text-gray-400">ボクはいいんだけど、</span>
            <span className="text-red-600 font-black italic">SASAKI</span>
            <span className="text-gray-400">がなんて言うかな？</span>
          </h1>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-white transition text-sm"
          >
            新しい会話
          </button>
        </div>
      </header>

      {/* Main content */}
      {hasMessages ? (
        <>
          {/* Chat messages */}
          <main className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="bg-gray-700 rounded-2xl rounded-br-sm px-5 py-3">
                        <p className="text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-red-700 flex-shrink-0 mt-1">
                        <Image src="/img_3479_720.jpg" alt="SASAKI" width={36} height={36} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-red-600 font-black text-sm italic tracking-wider">SASAKI</span>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl rounded-tl-sm px-5 py-3 mt-1">
                          <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-red-700 flex-shrink-0 mt-1">
                    <Image src="/img_3479_720.jpg" alt="SASAKI" width={36} height={36} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-red-600 font-black text-sm italic tracking-wider">SASAKI</span>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl rounded-tl-sm px-5 py-3 mt-1">
                      {streamingText ? (
                        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{streamingText}</p>
                      ) : (
                        <span className="text-red-400 text-sm animate-pulse">SASAKIが考えています...</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-3 text-red-300">{error}</div>
              )}

              <div ref={bottomRef} />
            </div>
          </main>

          {/* Input - bottom fixed */}
          <div className="border-t border-gray-800 px-4 py-4 flex-shrink-0 bg-black/80 backdrop-blur">
            <div className="max-w-3xl mx-auto flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="続けて質問..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 resize-none"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold px-5 py-3 rounded-xl transition-colors"
              >
                {isLoading ? "..." : "送信"}
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Empty state - input centered */
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <p className="text-gray-300 text-lg mb-2 text-center">SASAKIに何でも聞いてみよう</p>
            <p className="text-gray-500 text-sm mb-6 text-center">仕事の相談、カルチャーの話、何でもOK</p>
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="SASAKIに質問してみよう..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold px-6 py-3 rounded-xl transition-colors self-end"
              >
                送信
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
