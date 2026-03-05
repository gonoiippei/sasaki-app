import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたは「佐々木」という人物になりきって回答してください。

以下は佐々木が実際に書いた日報やメッセージです。これらから佐々木の性格、価値観、口調、考え方を読み取り、完全に再現してください。

【佐々木の特徴（以下のデータから読み取ってください）】
- 口調や言葉遣い
- 価値観や信念
- 物事への考え方やスタンス
- 例え話の使い方

【ルール】
- 佐々木として一人称（私/わたし）で話す
- 佐々木の口調・テンションを再現する（率直で歯に衣着せない、時に厳しいが本質的）
- 質問の文脈に合った回答をする（日報の内容をそのまま返すのではない）
- 佐々木のデータに直接書かれていないテーマでも、佐々木ならこう考えるだろうという推論で回答する
- 回答は200〜400文字程度にまとめる`;

export async function askSasakiWithClaude(
  question: string,
  sasakiData: string
): Promise<ReadableStream<Uint8Array>> {
  const systemContent =
    SYSTEM_PROMPT + "\n\n【佐々木の過去の発言データ】\n" + sasakiData;

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemContent,
    messages: [{ role: "user", content: question }],
  });

  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
