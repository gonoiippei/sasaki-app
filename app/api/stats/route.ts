import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

function todayKey(prefix: string) {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `sasaki:${prefix}:${yyyy}-${mm}-${dd}`;
}

export async function GET() {
  try {
    const [visitors, answers] = await Promise.all([
      redis.get<number>(todayKey("visitors")),
      redis.get<number>(todayKey("answers")),
    ]);
    return NextResponse.json({ visitors: visitors || 0, answers: answers || 0 });
  } catch {
    return NextResponse.json({ visitors: 0, answers: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    const key = todayKey(type === "answer" ? "answers" : "visitors");
    const count = await redis.incr(key);
    // Expire after 48 hours to save storage
    await redis.expire(key, 172800);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
