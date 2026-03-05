import { NextRequest } from "next/server";
import { loadAllDocuments } from "@/lib/search";
import { askSasakiWithGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "質問を入力してください" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Load all Sasaki data as personality context
    const allDocs = loadAllDocuments();
    if (allDocs.length === 0) {
      return new Response(
        JSON.stringify({ error: "佐々木のデータがまだありません。" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sasakiData = allDocs
      .map((d) => d.content)
      .join("\n\n---\n\n");

    // Stream response from Gemini
    const stream = await askSasakiWithGemini(question, sasakiData);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "エラーが発生しました";

    if (message.includes("API_KEY") || message.includes("api key")) {
      return new Response(
        JSON.stringify({
          error: "Gemini APIキーが設定されていません。",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
