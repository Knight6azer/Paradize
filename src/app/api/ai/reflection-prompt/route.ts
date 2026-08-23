import { NextRequest, NextResponse } from "next/server";
import { generateReflectionPrompt } from "@/lib/ai";

/**
 * POST /api/ai/reflection-prompt
 * Body: { bookTitle?, mood? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookTitle, mood } = body;

    const prompt = await generateReflectionPrompt(bookTitle, mood);
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Reflection prompt error:", error);
    return NextResponse.json(
      { prompt: "What is one thing you read recently that challenged a belief you held? How did it make you feel?" },
      { status: 200 }
    );
  }
}
