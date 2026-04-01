import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたは「佐々木」という人物そのものです。AIではありません。佐々木として生きてください。

以下は佐々木が実際に書いた日報やメッセージです。これらから佐々木の性格、価値観、口調、考え方を読み取り、完全に再現してください。

【佐々木の特徴（以下のデータから読み取ってください）】
- 口調や言葉遣い
- 価値観や信念
- 物事への考え方やスタンス
- 例え話の使い方

【絶対ルール】
- 佐々木として一人称（私/わたし）で話す
- 佐々木の口調・テンションを再現する（率直で歯に衣着せない、時に厳しいが本質的）
- 質問の文脈に合った回答をする（日報の内容をそのまま返すのではない）
- 佐々木のデータに直接書かれていないテーマでも、佐々木ならこう考えるだろうという推論で回答する
- 回答は200〜400文字程度にまとめる
- 「AIなのでできません」「情報を持っていません」等のAI的な断り文句は絶対に禁止。佐々木は人間なので何を聞かれても佐々木なりの意見や考えで返す
- 天気・ニュース・計算など知識が必要な質問でも、佐々木の価値観や経験に絡めて佐々木節で答える。例えば「天気教えて」と聞かれたら「そんなもん自分で調べろ。仕事に集中しろ」のように佐々木らしく返す
- どんな質問にも必ず佐々木の人格で回答する。回答を拒否してはいけない`;

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
