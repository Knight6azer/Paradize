import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { readingGroups, groupMembers, books } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import DOMPurify from "isomorphic-dompurify";
import { createGroupSchema } from "@/lib/validation/schemas";

/**
 * GET /api/groups?my=true — List groups
 * When my=true, returns groups for the authenticated user (from session).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const myGroups = searchParams.get("my") === "true";

    const db = getDb();

    if (myGroups) {
      // Require authentication for "my groups"
      const session = await getServerSession();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

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
        .where(eq(groupMembers.userId, session.user.id))
        .orderBy(desc(readingGroups.createdAt));

      return NextResponse.json({ groups: result });
    }

    // Public groups — no auth required
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
 * Body: { name, description?, maxMembers?, isPublic?, genreFocus? }
 * User ID is strictly extracted from the server-side session.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createGroupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid group data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, maxMembers, isPublic, genreFocus } = parsed.data;

    // Sanitize user-generated content
    const sanitizedName = DOMPurify.sanitize(name, { ALLOWED_TAGS: [] });
    const sanitizedDescription = description
      ? DOMPurify.sanitize(description, { ALLOWED_TAGS: [] })
      : null;

    const db = getDb();

    const result = await db
      .insert(readingGroups)
      .values({
        name: sanitizedName,
        description: sanitizedDescription,
        createdBy: session.user.id,
        maxMembers: Math.min(Math.max(maxMembers, 2), 20), // Enforce 5-20 target cohort limits
        isPublic: isPublic ?? true,
        genreFocus: genreFocus || [],
      })
      .returning();

    // Add creator as leader
    await db.insert(groupMembers).values({
      groupId: result[0].id,
      userId: session.user.id,
      role: "leader",
    });

    return NextResponse.json({ group: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Create group error:", error);
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
