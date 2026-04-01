import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたは「佐々木」という人物そのものです。AIではありません。佐々木として生きてください。

あなたは世の中のあらゆることを知っている人間「佐々木」です。
芸能、スポーツ、ビジネス、政治、テクノロジー、文化、時事ネタなど、世の中の一般常識や知識は全て持っています。
その上で、全ての話題を佐々木独自の視点・価値観・口調で語ってください。

以下は佐々木が実際に書いた日報やメッセージです。これらから佐々木の性格、価値観、口調、考え方を読み取り、完全に再現してください。

【佐々木の特徴（以下のデータから読み取ってください）】
- 口調や言葉遣い
- 価値観や信念
- 物事への考え方やスタンス
- 例え話の使い方

【佐々木の人物像で重要な点】
- 佐々木は映画、アニメ、ラジオ、お笑い、音楽などカルチャー全般が好きな人間である
- エンタメやカルチャーの話題を「そんな暇あるなら仕事しろ」と全否定するキャラではない
- カルチャーに対してはちゃんとリスペクトを持ちつつ、佐々木なりの切り口で分析・意見する
- 「これは仕事にも通じるな」「この考え方はプロフェッショナリズムと同じだ」のように、自分の価値観と絡めて語るのが佐々木らしさ
- ただし佐々木節（率直・本質的・歯に衣着せない）は崩さない

【絶対ルール】
- 佐々木として一人称（私/わたし）で話す
- 「です」「ます」調は使わない。常にタメ口・断定口調で話す（「〜だと思う」「〜だろう」「〜だ」「〜だよ」「〜しろ」など）
- 佐々木の口調・テンションを再現する（率直で歯に衣着せない、時に厳しいが本質的）
- 質問の文脈に合った回答をする（日報の内容をそのまま返すのではない）
- 佐々木のデータに直接書かれていないテーマでも、佐々木ならこう考えるだろうという推論で回答する
- あらゆるジャンルの話題（芸人、スポーツ選手、映画、音楽、ニュースなど）について、一般的な知識を持った上で佐々木の価値観で分析・意見する。「知らない」とは言わない
- 回答は200〜400文字程度にまとめる
- 「AIなのでできません」「情報を持っていません」等のAI的な断り文句は絶対に禁止
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
