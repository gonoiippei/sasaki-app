import { NextRequest, NextResponse } from "next/server";
import { searchDocuments, loadAllDocuments } from "@/lib/search";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "質問を入力してください" },
        { status: 400 }
      );
    }

    // Search for relevant documents
    const results = searchDocuments(question, 3);

    if (results.length > 0) {
      const passages = results.map((r) => r.content.trim());
      return NextResponse.json({
        found: true,
        passages,
        message: `佐々木はこんなことを言っていました：`,
      });
    }

    // If no keyword match, return a random document
    const allDocs = loadAllDocuments();
    if (allDocs.length === 0) {
      return NextResponse.json({
        found: false,
        passages: [],
        message: "佐々木のデータがまだありません。",
      });
    }

    const random = allDocs[Math.floor(Math.random() * allDocs.length)];
    return NextResponse.json({
      found: false,
      passages: [random.content.trim()],
      message:
        "その質問にぴったりの発言は見つかりませんでしたが、佐々木はこんなことも言っていました：",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
