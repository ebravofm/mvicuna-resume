import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

