import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { readingGroups, groupMembers, users, books } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

/**
 * GET /api/groups?my=true&userId=... — List groups
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const myGroups = searchParams.get("my") === "true";
    const userId = searchParams.get("userId");

    const db = getDb();

    if (myGroups && userId) {
      // Get groups user is a member of
      const result = await db
        .select({
          id: readingGroups.id,
          name: readingGroups.name,
          description: readingGroups.description,
          memberCount: readingGroups.memberCount,
          maxMembers: readingGroups.maxMembers,
          genreFocus: readingGroups.genreFocus,
          isPublic: readingGroups.isPublic,
          currentBookTitle: books.title,
          role: groupMembers.role,
        })
        .from(groupMembers)
        .innerJoin(readingGroups, eq(groupMembers.groupId, readingGroups.id))
        .leftJoin(books, eq(readingGroups.currentBookId, books.id))
        .where(eq(groupMembers.userId, userId))
        .orderBy(desc(readingGroups.createdAt));

      return NextResponse.json({ groups: result });
    }

    // Public groups
    const result = await db
      .select({
        id: readingGroups.id,
        name: readingGroups.name,
        description: readingGroups.description,
        memberCount: readingGroups.memberCount,
        maxMembers: readingGroups.maxMembers,
        genreFocus: readingGroups.genreFocus,
        isPublic: readingGroups.isPublic,
        currentBookTitle: books.title,
      })
      .from(readingGroups)
      .leftJoin(books, eq(readingGroups.currentBookId, books.id))
      .where(eq(readingGroups.isPublic, true))
      .orderBy(desc(readingGroups.memberCount))
      .limit(50);

    return NextResponse.json({ groups: result });
  } catch (error) {
    console.error("Groups fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

/**
 * POST /api/groups — Create a new group
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, maxMembers = 20, isPublic = true, genreFocus = [] } = body;

    if (!userId || !name) {
      return NextResponse.json({ error: "userId and name are required" }, { status: 400 });
    }

    const db = getDb();

    const result = await db
      .insert(readingGroups)
      .values({
        name,
        description: description || null,
        createdBy: userId,
        maxMembers,
        isPublic,
        genreFocus,
      })
      .returning();

    // Add creator as leader
    await db.insert(groupMembers).values({
      groupId: result[0].id,
      userId,
      role: "leader",
    });

    return NextResponse.json({ group: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Create group error:", error);
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
