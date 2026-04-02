import { NextRequest } from "next/server";
import { loadAllDocuments } from "@/lib/search";
import { askSasakiWithClaude } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "質問を入力してください" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const allDocs = loadAllDocuments();
    if (allDocs.length === 0) {
      return new Response(
        JSON.stringify({ error: "SASAKIのデータがまだありません。" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sasakiData = allDocs.map((d) => d.content).join("\n\n---\n\n");

    const stream = await askSasakiWithClaude(messages, sasakiData);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "エラーが発生しました";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
