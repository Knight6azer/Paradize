import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { reflections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * PATCH /api/reflections/[id] — Update a reflection
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, mood, isPrivate } = body;

    const db = getDb();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (content !== undefined) updateData.content = content;
    if (mood !== undefined) updateData.mood = mood;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const result = await db
      .update(reflections)
      .set(updateData)
      .where(eq(reflections.id, id))
      .returning();

    return NextResponse.json({ reflection: result[0] });
  } catch (error) {
    console.error("Update reflection error:", error);
    return NextResponse.json({ error: "Failed to update reflection" }, { status: 500 });
  }
}

/**
 * DELETE /api/reflections/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    await db.delete(reflections).where(eq(reflections.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete reflection error:", error);
    return NextResponse.json({ error: "Failed to delete reflection" }, { status: 500 });
  }
}
