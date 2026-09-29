interface ChatCompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export async function generateLlmText({
  systemPrompt,
  userPrompt,
  maxTokens = 700,
}: ChatCompletionOptions): Promise<string | null> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.AI_API_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      console.error("AI provider request failed with status", response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? content.trim() : null;
  } catch (error) {
    console.error("AI provider request failed:", error instanceof Error ? error.message : "unknown error");
    return null;
  }
}
