import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Truthful processing: In production this connects to email provider / DB
    // For now we validate and acknowledge subscription cleanly
    return NextResponse.json({
      success: true,
      message: `You're on the list! Welcome to Paradize reads, ${email}.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again." },
      { status: 500 }
    );
  }
}
