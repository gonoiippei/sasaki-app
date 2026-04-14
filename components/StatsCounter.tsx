"use client";

import { useEffect, useState } from "react";

export default function StatsCounter() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number | null>(null);

  useEffect(() => {
    // Count visitor
    fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "visitor" }) })
      .catch(() => {});
    // Get today's stats
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setVisitors(d.visitors); setAnswers(d.answers); })
      .catch(() => {});
  }, []);

  if (visitors === null) return null;

  return (
    <div className="flex gap-6 text-gray-500 text-xs md:text-sm relative z-10 mt-8">
      <p>
        今日SASAKIに何か言われた人{" "}
        <span className="text-red-500 font-bold text-base md:text-lg">{visitors}</span> 人
      </p>
      <p>
        今日SASAKIが回答した数{" "}
        <span className="text-red-500 font-bold text-base md:text-lg">{answers}</span> 件
      </p>
    </div>
  );
}
