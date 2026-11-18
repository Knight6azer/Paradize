import { NextRequest, NextResponse } from "next/server";
import { generateReflectionPrompt } from "@/lib/ai";
import { z } from "zod";

const promptInputSchema = z.object({
  bookTitle: z.string().max(200).optional(),
  mood: z.string().max(50).optional(),
});

/**
 * POST /api/ai/reflection-prompt
 * Body: { bookTitle?, mood? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = promptInputSchema.safeParse(body);

    const bookTitle = parsed.success ? parsed.data.bookTitle : undefined;
    const mood = parsed.success ? parsed.data.mood : undefined;

    const prompt = await generateReflectionPrompt(bookTitle, mood);
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Reflection prompt error:", error);
    return NextResponse.json(
      { prompt: "What is one insight you encountered recently that challenged a belief you held? How did it make you feel?" },
      { status: 200 }
    );
  }
}
