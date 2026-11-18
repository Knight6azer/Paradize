import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { reflections } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

const updateReflectionSchema = z.object({
  content: z.string().min(10, "Reflection must be at least 10 characters").max(10000).optional(),
  mood: z
    .enum([
      "inspired",
      "thoughtful",
      "confused",
      "challenged",
      "grateful",
      "curious",
      "peaceful",
      "energized",
    ])
    .optional(),
  isPrivate: z.boolean().optional(),
});

/**
 * PATCH /api/reflections/[id] — Update a reflection
 * Requires authentication and strictly enforces user ownership.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = updateReflectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify reflection exists and belongs to the authenticated user
    const existing = await db
      .select({ id: reflections.id, userId: reflections.userId })
      .from(reflections)
      .where(eq(reflections.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Reflection not found" }, { status: 404 });
    }

    if (existing[0].userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this reflection" },
        { status: 403 }
      );
    }

    const { content, mood, isPrivate } = parsed.data;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (content !== undefined) {
      updateData.content = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    }
    if (mood !== undefined) {
      updateData.mood = mood;
    }
    if (isPrivate !== undefined) {
      updateData.isPrivate = isPrivate;
    }

    const result = await db
      .update(reflections)
      .set(updateData)
      .where(and(eq(reflections.id, id), eq(reflections.userId, session.user.id)))
      .returning();

    return NextResponse.json({ reflection: result[0] });
  } catch (error) {
    console.error("Update reflection error:", error);
    return NextResponse.json({ error: "Failed to update reflection" }, { status: 500 });
  }
}

/**
 * DELETE /api/reflections/[id] — Delete a reflection
 * Requires authentication and strictly enforces user ownership.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    // Verify reflection exists and belongs to the authenticated user
    const existing = await db
      .select({ id: reflections.id, userId: reflections.userId })
      .from(reflections)
      .where(eq(reflections.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Reflection not found" }, { status: 404 });
    }

    if (existing[0].userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this reflection" },
        { status: 403 }
      );
    }

    await db
      .delete(reflections)
      .where(and(eq(reflections.id, id), eq(reflections.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete reflection error:", error);
    return NextResponse.json({ error: "Failed to delete reflection" }, { status: 500 });
  }
}
